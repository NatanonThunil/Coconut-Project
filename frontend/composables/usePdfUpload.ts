// ~/composables/usePdfUpload.ts
export const usePdfUpload = () => {
  const config = useRuntimeConfig();
  const be_api_url = config.public.beUrl;
  const apiBase = config.public.apiBase || '/env-notwork'; // Ensure apiBase has a default value
  const apiKey = 'Cocon541986';

  const uploadPdf = async (base64Pdf: string, pdfName: string) => {
    const url = `${be_api_url}${apiBase}/pdf-upload`;
    return await $fetch(url, {
      method: 'POST',
      headers: {
        'cocon-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: {
        pdf: base64Pdf,
        path: pdfName,
      },
    });
  };

  return { uploadPdf };
};
