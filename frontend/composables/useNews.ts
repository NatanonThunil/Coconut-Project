export const useNews = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/coconut-api'; // Ensure apiBase has a default value
    const be_api_url = 'https://coconut-kukps.com'; // Replace with your actual backend API URL
    const apiKey = 'Cocon541986'; // Replace with your actual API key

    const getNews = async () => {
        const url = `${be_api_url}${apiBase}/news`;
        console.log('Requesting URL:', url);

        return await $fetch(url, {
            headers: {
                'cocon-key': apiKey,
            },
        });
    };

    const getNewsById = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid news ID:', id);
            throw new Error('Invalid news ID');
        }

        const url = `${be_api_url}${apiBase}/news/${id}`;
        console.log('Requesting URL:', url);
        try {
            const response = await $fetch(url, {
                headers: {
                    'cocon-key': apiKey,
                },
            });
            return response;
        } catch (error) {
            console.error(`Error fetching news by ID (${id}):`, error);
            throw error;
        }
    };

    const createNews = async (
        title: string,
        images: string,
        author: string,
        upload_date: Date,
        description: string,
        summerize: string,
        hot_new: string,
        status: boolean,
        title_en: string,
        description_en: string,
        summerize_en: string
    ) => {
        const url = `${be_api_url}${apiBase}/news`;
        console.log('Requesting URL:', url);
        return await $fetch(url, {
            method: 'POST',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                title,
                images,
                author,
                upload_date,
                description,
                summerize,
                hot_new,
                status,
                title_en,
                description_en,
                summerize_en,
            },
        });
    };

    return { getNews, getNewsById, createNews };
};