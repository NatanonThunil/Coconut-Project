export const useHerobars = () => {
    const config = useRuntimeConfig();
    const be_api_url = config.public.beUrl;
    const apiKey = 'Cocon541986';
    const apiBase = config.public.apiBase || '';
    const getHerobarById = async (id: number) => {
        const url = `${be_api_url}${apiBase}/herobars/${id}`;
        try {
            return await $fetch(url, {
                headers: {
                    'cocon-key': apiKey,
                },
            });
        } catch (error) {
            console.error('Error fetching herobar:', error);
            throw error;
        }
    };

    const updateHerobarById = async (
        id: number,
        text: string,
        text_en: string,
        x: number,
        y: number,
        image: string
    ) => {
        const url = `${be_api_url}${apiBase}/herobars/${id}`;
        return await $fetch(url, {
            method: 'PUT',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                text,
                text_en,
                x,
                y,
                image,
            },
        });
    };

    return { getHerobarById, updateHerobarById };
};