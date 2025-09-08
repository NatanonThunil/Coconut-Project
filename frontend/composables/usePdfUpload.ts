// composables/useUploadPDF.ts
const MB = 1024 * 1024;
const MAX_BINARY_MB = 50;        // must match server
const SOFT_FILE_MB = 50;         // client soft cap for File.size

type UploadPdfResponse = { message: string; sizeMB: number; path: string };

export const useUploadPDF = () => {
  const config = useRuntimeConfig();
  const be_api_url = config.public.beUrl || '';     // e.g. http://localhost:5100
  const apiBase    = config.public.apiBase || '';   // e.g. /coconut-api
  const apiKey     = config.public.apiKey  || 'Cocon541986';

  const uploadPDF = async (
    fileOrString: File | string,
    saveAs: string,
    opts?: { timeoutMs?: number }
  ): Promise<UploadPdfResponse> => {
    if (!fileOrString || !saveAs) throw new Error('PDF data and saveAs path are required.');

    let file: File;

    if (fileOrString instanceof File) {
      if (fileOrString.size > SOFT_FILE_MB * MB) {
        throw new Error(`PDF is too large (> ${SOFT_FILE_MB} MB). Please export at lower DPI or split the PDF.`);
      }
      file = fileOrString;
    } else {
      const s = fileOrString.trim();
      const dataUrl = s.startsWith('data:application/pdf;base64,')
        ? s
        : s.startsWith('data:application/pdf')
        ? s
        : `data:application/pdf;base64,${s}`;

      const blob = await (await fetch(dataUrl)).blob();
      if (blob.size > SOFT_FILE_MB * MB) {
        throw new Error(`PDF is too large (> ${SOFT_FILE_MB} MB). Please export at lower DPI or split the PDF.`);
      }
      file = new File([blob], saveAs.toLowerCase().endsWith('.pdf') ? saveAs : `${saveAs}.pdf`, {
        type: 'application/pdf',
      });
    }

    // ---- build URL directly (no joinURL) ----
    // Ensure apiBase starts with "/" if you use it
    const url = `${be_api_url}${apiBase}/pdf-upload`;

    const fd = new FormData();
    fd.append('pdf', file);
    fd.append('path', saveAs.toLowerCase().endsWith('.pdf') ? saveAs : `${saveAs}.pdf`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), opts?.timeoutMs ?? 90_000);

    try {
      const res = await $fetch<UploadPdfResponse>(url, {
        method: 'POST',
        headers: { 'cocon-key': apiKey }, // don’t set Content-Type, browser does it
        body: fd as any,
        signal: controller.signal,
      });
      return res;
    } catch (err: any) {
      const status = err?.response?.status || err?.statusCode;
      if (status === 413) {
        throw new Error('Upload rejected (413). The upstream proxy/body limit is too small. Please raise Nginx/host limit.');
      }
      throw new Error(err?.data?.error || err?.message || 'PDF upload failed');
    } finally {
      clearTimeout(timeout);
    }
  };

  return { uploadPDF };
};
