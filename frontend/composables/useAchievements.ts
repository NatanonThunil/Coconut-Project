export const useAchievements = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/env-notwork'; // Ensure apiBase has a default value
    const be_api_url = config.public.beUrl; // ดึง มาจาก nuxt config
    const apiKey = 'Cocon541986'; // ยังติดปัญหาใช้า env ใน composable ไม่ได้ ให้มันอยู่ตรงนี้ไปก่อน

    const getAchievements = async () => {
        const url = `${be_api_url}${apiBase}/achievements`;
        console.log('Requesting URL:', url);

        return await $fetch(url, {
            headers: {
                'cocon-key': apiKey,
            },
        });
    };

    const getAchievementById = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid achievement ID:', id);
            throw new Error('Invalid achievement ID');
        }

        const url = `${be_api_url}${apiBase}/achievements/${id}`;
        console.log('Requesting URL:', url);
        try {
            const response = await $fetch(url, {
                headers: {
                    'cocon-key': apiKey,
                },
            });

            // Check if the response is valid
            if (!response || Object.keys(response).length === 0) {
                console.error(`Achievement with ID ${id} not found in response:`, response);
                throw new Error('Achievement not found');
            }

            return response; // Return the achievement data directly
        } catch (error) {
            console.error(`Error fetching achievement by ID (${id}):`, error.message || error);
            throw new Error(error.message || 'Failed to fetch achievement');
        }
    };

    const createAchievement = async (
        title: string,
        title_en: string,
        author: string,
        description: string,
        description_en: string,
        uploadDate: Date,
        status: boolean,
        pdf: string
    ) => {
        const url = `${be_api_url}${apiBase}/achievements`;
        console.log('Requesting URL:', url);
        return await $fetch(url, {
            method: 'POST',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                title,
                title_en,
                author,
                description,
                description_en,
                uploadDate,
                status,
                pdf,
            },
        });
    };

    return { getAchievements, getAchievementById, createAchievement };
};