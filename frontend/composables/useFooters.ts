export const useFooters = () => {
    const config = useRuntimeConfig();
    const be_api_url = config.public.beUrl; // ดึง มาจาก nuxt config
    const apiKey = 'Cocon541986'; // ยังติดปัญหาใช้า env ใน composable ไม่ได้ ให้มันอยู่ตรงนี้ไปก่อน
    const apiBase = config.public.apiBase || '/env-notwork';

    const getFooterById = async (id: number) => {
        const url = `${be_api_url}${apiBase}/footers/${id}`;
       
        try {
            return await $fetch(url, {
                headers: {
                    'cocon-key': apiKey,
                },
            });
        } catch (error) {
            
            throw error;
        }
    };

    const updateFooterById = async (
        id: number,
        text: string,
        text_en: string,
        credit: string,
        credit_en: string
    ) => {
        const url = `${be_api_url}${apiBase}/footers/${id}`;
      
        return await $fetch(url, {
            method: 'PUT',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                text,
                text_en,
                credit,
                credit_en,
            },
        });
    };

    return { getFooterById, updateFooterById };
};