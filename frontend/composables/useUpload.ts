// composables/useUpload.ts
import imageCompression from 'browser-image-compression';

const B = 1024 * 1024;
const MAX_BASE64_MB = 50;       // absolute limit for what we POST
const TARGET_BINARY_MB = 37.5;  // good first target (~50 MB base64 after overhead)

const fileToDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });

const base64Bytes = (dataUrl: string) => {
  const i = dataUrl.indexOf(',');
  const raw = i !== -1 ? dataUrl.slice(i + 1) : dataUrl;
  return Math.floor((raw.length * 3) / 4); // ~binary size
};

// Normalize any input to a File (so the compressor accepts it)
const toFile = async (input: File | string, fallbackName = 'image.webp'): Promise<File> => {
  if (input instanceof File) return input;

  if (typeof input === 'string') {
    // data URL?
    if (input.startsWith('data:')) {
      const blob = await (await fetch(input)).blob();
      return new File([blob], fallbackName, { type: blob.type || 'image/png' });
    }

    // raw base64 string
    const binary = atob(input);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'image/webp' });
    return new File([blob], fallbackName, { type: 'image/webp' });
  }

  throw new Error('Unsupported input to uploadImage');
};

// Compress until base64 <= 50MB.
// 1) Try keeping original dimensions, drop quality 0.9 -> 0.5.
// 2) If still too big, start reducing maxWidthOrHeight progressively.
async function compressUntilFits50MB(original: File): Promise<{ dataUrl: string; attempts: number }> {
  let attempts = 0;

  // Phase 1: keep original dimensions (no maxWidthOrHeight), reduce quality
  for (let quality = 0.9; quality >= 0.5; quality -= 0.1) {
    attempts++;
    const c1 = await imageCompression(original, {
      // keep original width/height
      maxSizeMB: TARGET_BINARY_MB,  // library target to encourage size drop
      initialQuality: quality,
      useWebWorker: true,
      fileType: 'image/webp',
    });
    const dataUrl = await fileToDataURL(c1);
    if (base64Bytes(dataUrl) <= MAX_BASE64_MB * B) {
      return { dataUrl, attempts };
    }
  }

  // Phase 2: reduce resolution step-by-step
  // Start with something big and shrink; tune to your preference.
  const edges = [4096, 3500, 3000, 2560, 2200, 1920, 1600, 1400, 1280];
  for (const maxEdge of edges) {
    attempts++;
    const c2 = await imageCompression(original, {
      maxWidthOrHeight: maxEdge,
      maxSizeMB: TARGET_BINARY_MB,
      initialQuality: 0.85,   // reset to a decent quality
      useWebWorker: true,
      fileType: 'image/webp',
    });
    const dataUrl = await fileToDataURL(c2);
    if (base64Bytes(dataUrl) <= MAX_BASE64_MB * B) {
      return { dataUrl, attempts };
    }
  }

  // Final shot: very small edge with lower quality
  attempts++;
  const c3 = await imageCompression(original, {
    maxWidthOrHeight: 1200,
    maxSizeMB: 25,
    initialQuality: 0.75,
    useWebWorker: true,
    fileType: 'image/webp',
  });
  const dataUrl = await fileToDataURL(c3);
  if (base64Bytes(dataUrl) <= MAX_BASE64_MB * B) {
    return { dataUrl, attempts };
  }

  throw new Error('IMAGE_TOO_LARGE_AFTER_COMPRESSION');
}

export const useUpload = () => {
  const config = useRuntimeConfig();
  const be_api_url = config.public.beUrl;
  const apiKey = config.public.apiKey || 'Cocon541986';
  const apiBase = config.public.apiBase || '';

  const uploadImage = async (fileOrString: File | string, saveAs: string) => {
    // 1) Normalize to File
    const file = await toFile(fileOrString, saveAs.endsWith('.webp') ? saveAs : `${saveAs}.webp`);

    // 2) Compress until base64 <= 50MB (unlimited width/height policy)
    const { dataUrl } = await compressUntilFits50MB(file);

    // 3) Strip prefix & POST (JSON API)
    const i = dataUrl.indexOf(',');
    const pureBase64 = i !== -1 ? dataUrl.slice(i + 1) : dataUrl;

    const url = `${be_api_url}${apiBase}/img-upload`;
    return await $fetch(url, {
      method: 'POST',
      headers: {
        'cocon-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: {
        image: pureBase64,
        // Send a filename; backend uses path.basename() anyway
        path: saveAs.endsWith('.webp') ? saveAs : `${saveAs}.webp`,
      },
    });
  };

  return { uploadImage };
};
