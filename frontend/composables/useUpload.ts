export const useUpload = () => {
    const config = useRuntimeConfig();
    const be_api_url = config.public.beUrl;
    const apiKey = 'Cocon541986';
    const apiBase = config.public.apiBase || '/env-notwork'; 
    const uploadImage = async (base64Image: string, imagePath: string) => {
        const url = `${be_api_url}${apiBase}/img-upload`;
        return await $fetch(url, {
            method: 'POST',
            headers: {
                'cocon-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: {
                image: base64Image,
                path: imagePath,
            },
        });
    };

    return { uploadImage };
};
