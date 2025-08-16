export const useUploadPDF = () => {
  const config = useRuntimeConfig();
  const be_api_url = config.public.beUrl;
  const apiBase = config.public.apiBase;
  const apiKey = 'Cocon541986';

  const uploadPDF = async (base64PDF, pdfPath) => {
    if (!base64PDF || !pdfPath) {
      throw new Error('PDF data and PDF path are required.');
    }

    try {
      // Only prepend data URL if not already present
      const fullBase64 = base64PDF.startsWith('data:application/pdf')
        ? base64PDF
        : `data:application/pdf;base64,${base64PDF}`;

      const url = `${be_api_url}${apiBase}/pdf-upload`; // backend route

      // $fetch in Nuxt 3 prefers `body` for JSON payloads
      const response = await $fetch(url, {
        method: 'POST',
        headers: {
          'cocon-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: {
          pdf: fullBase64,
          path: pdfPath,
        },
      });

      return response;
    } catch (err) {
      console.error('PDF upload failed:', err);
      throw new Error(err?.data?.error || err.message || 'PDF upload failed');
    }
  };

  return { uploadPDF };
};
