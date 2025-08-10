export const useExperts = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/env-notwork';
    const be_api_url = config.public.beUrl;
    const apiKey = 'Cocon541986'; // ยังติดปัญหาใช้า env ใน composable ไม่ได้

    const getExperts = async () => {
        const url = `${be_api_url}${apiBase}/experts`;
        console.log('Requesting URL:', url);

        return await $fetch(url, {
            headers: {
                'cocon-key': apiKey,
            },
        });
    };

    const getExpertById = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid expert ID:', id);
            throw new Error('Invalid expert ID');
        }

        const url = `${be_api_url}${apiBase}/experts/${id}`;
        console.log('Requesting URL:', url);
        try {
            const response = await $fetch(url, {
                headers: {
                    'cocon-key': apiKey,
                },
            });
            return response;
        } catch (error) {
            console.error(`Error fetching expert by ID (${id}):`, error);
            throw error;
        }
    };

    const createExpert = async (
        image: string,
        name: string,
        name_en: string,
        address: string,
        address_en: string,
        phoneNumber: string,
        status: boolean,
        description: string,
        description_en: string,
        type: string,
        email: string
    ) => {
        const url = `${be_api_url}${apiBase}/experts`;
        console.log('Requesting URL:', url);
        return await $fetch(url, {
            method: 'POST',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                image,
                name,
                name_en,
                address,
                address_en,
                phoneNumber,
                status,
                description,
                description_en,
                type,
                email,
            },
        });
    };

    return { getExperts, getExpertById, createExpert };
};