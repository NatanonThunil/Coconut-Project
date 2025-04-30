export const useFooters = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/env-notwork'; // Ensure apiBase has a default value
    const be_api_url = config.public.beUrl; // ดึง มาจาก nuxt config
    const apiKey = 'Cocon541986'; // ยังติดปัญหาใช้า env ใน composable ไม่ได้ ให้มันอยู่ตรงนี้ไปก่อน

    const getFooters = async () => {
        const url = `${be_api_url}${apiBase}/footers`;
        console.log('Requesting URL:', url);

        return await $fetch(url, {
            headers: {
                'cocon-key': apiKey,
            },
        });
    };

    const getFooterById = async (id: number) => {
        const url = `${be_api_url}${apiBase}/footers/${id}`;
        console.log('Requesting URL:', url);
        try {
            return await $fetch(url, {
                headers: {
                    'cocon-key': apiKey,
                },
            });
        } catch (error) {
            console.error(`Error fetching footer by ID (${id}):`, error);
            throw error;
        }
    };

    

    return { getFooters, getFooterById };
};