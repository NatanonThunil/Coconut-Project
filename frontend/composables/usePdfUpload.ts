// composables/useUploadPDF.ts
const B = 1024 * 1024;
const MAX_BINARY_MB = 50;         // server enforces 50 MB binary after (re)save
const SOFT_BASE64_POST_MB = 70;   // avoid posting absurdly large base64 (~>50 MB binary * 4/3)

/** Read any File as a data URL */
const fileToDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });

/** Approximate binary bytes from base64/dataURL length */
const base64Bytes = (maybeDataUrl: string) => {
  const i = maybeDataUrl.indexOf(',');
  const raw = i !== -1 ? maybeDataUrl.slice(i + 1) : maybeDataUrl;
  return Math.floor((raw.length * 3) / 4);
};

/** Normalize PDF input to a data URL */
const toPdfDataUrl = async (input: File | string): Promise<string> => {
  if (input instanceof File) {
    if (input.type && input.type !== 'application/pdf') {
      // Allow some browsers that don’t set type; just warn in console
      console.warn('useUploadPDF: File type is not application/pdf, continuing anyway.');
    }
    return await fileToDataURL(input);
  }
  if (typeof input === 'string') {
    // already a data URL?
    if (input.startsWith('data:application/pdf')) return input;
    // raw base64? make a data URL
    return `data:application/pdf;base64,${input}`;
  }
  throw new Error('Unsupported input to uploadPDF (expect File or string).');
};

type UploadPdfResponse = {
  message: string;
  sizeMB: number;
  path: string;
};

export const useUploadPDF = () => {
  const config = useRuntimeConfig();
  const be_api_url = config.public.beUrl;
  const apiBase   = config.public.apiBase || '';
  const apiKey    = config.public.apiKey  || 'Cocon541986';

  /**
   * Upload a PDF. Input can be a File, a data URL, or a raw base64 string.
   * The backend will do a structural recompress and enforce < 50 MB binary.
   */
  const uploadPDF = async (
    fileOrString: File | string,
    saveAs: string,
    opts?: { timeoutMs?: number }
  ): Promise<UploadPdfResponse> => {
    if (!fileOrString || !saveAs) throw new Error('PDF data and saveAs path are required.');

    // 1) Normalize to data URL (backend accepts data URL or base64)
    const dataUrl = await toPdfDataUrl(fileOrString);

    // 2) Soft client-side size guard (base64 ~ 4/3 of binary)
    const estBytes = base64Bytes(dataUrl);
    const softCap = SOFT_BASE64_POST_MB * B;
    if (estBytes > softCap) {
      throw new Error(
        `PDF is too large to upload (~${(estBytes / B).toFixed(1)} MB base64). ` +
        `Please export at lower DPI or split the PDF.`
      );
    }

    // 3) POST to backend (JSON)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), opts?.timeoutMs ?? 90_000);

    const url = `${be_api_url}${apiBase}/pdf-upload`;
    try {
      const res = await $fetch<UploadPdfResponse>(url, {
        method: 'POST',
        headers: {
          'cocon-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: {
          pdf: dataUrl,
          path: saveAs.toLowerCase().endsWith('.pdf') ? saveAs : `${saveAs}.pdf`,
        },
        signal: controller.signal,
      });
      return res; // { message, sizeMB, path }
    } catch (err: any) {
      // Surface server/nuxt $fetch errors
      const msg = err?.data?.error || err?.message || 'PDF upload failed';
      throw new Error(msg);
    } finally {
      clearTimeout(timeout);
    }
  };

  return { uploadPDF };
};
