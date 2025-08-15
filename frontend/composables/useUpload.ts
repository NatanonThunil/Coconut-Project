export const useUpload = () => {
  const config = useRuntimeConfig();
  const be_api_url = config.public.beUrl;
  const apiKey = 'Cocon541986';

  const uploadImage = async (base64Image: string, imagePath: string) => {
    if (!base64Image || !imagePath) {
      throw new Error('Image data and image path are required.');
    }

    try {
      // Determine MIME type from extension
      let mimeType = 'image/jpeg'; // default
      const ext = imagePath.split('.').pop()?.toLowerCase();
      if (ext === 'png') mimeType = 'image/png';
      else if (ext === 'webp') mimeType = 'image/webp';
      else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';

      // Only prepend data URL if not already present
      const fullBase64 = base64Image.startsWith('data:image')
        ? base64Image
        : `data:${mimeType};base64,${base64Image}`;

      const url = `${be_api_url}/img-upload`;

      const response = await $fetch(url, {
        method: 'POST',
        headers: {
          'cocon-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: {
          image: fullBase64, // send full data URL
          path: imagePath,   // matches server "path"
        },
      });

      return response;
    } catch (error: any) {
      console.error('Image upload failed:', error);
      throw new Error(error?.data?.error || error.message || 'Upload failed');
    }
  };

  return { uploadImage };
};
