export const useFAQs = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/env-notwork'; // Ensure apiBase has a default value
    const be_api_url = config.public.beUrl; // ดึง มาจาก nuxt config
    const apiKey = 'Cocon541986'; // ยังติดปัญหาใช้า env ใน composable ไม่ได้ ให้มันอยู่ตรงนี้ไปก่อน

    const getFAQs = async () => {
        // const url = `${be_api_url}/faqs`;
        const url = `${be_api_url}${apiBase}/faqs`;
        console.log('Requesting URL:', url);


        return await $fetch(url, {
            headers: {
                'cocon-key': apiKey,
            },
        });
    };



    const createFAQs = async (
        question: string,
        answer: string,
        status: boolean,
        isadvice: boolean,
        question_en: string,
        answer_en: string
    ) => {
        const url = `${be_api_url}${apiBase}/faqs`;
        console.log('Requesting URL:', url);
        return await $fetch(url, {
            method: 'POST',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                question, answer, status, isadvice, question_en, answer_en
            },
        });
    };
    const deleteFAQ = async (id: number) => {
        const url = `${be_api_url}${apiBase}/faqs/${id}`;
        console.log('Deleting FAQ at URL:', url);
        return await $fetch(url, {
            method: 'DELETE',
            headers: {
                'cocon-key': apiKey,
            },
        });
    };
    const updateFAQ = async (
        id: number,
        question: string,
        answer: string,
        status: boolean,
        isadvice: boolean,
        question_en: string,
        answer_en: string
    ) => {
        const url = `${be_api_url}${apiBase}/faqs/${id}`;
        console.log('Updating FAQ at URL:', url);
        return await $fetch(url, {
            method: 'PUT',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                question, answer, status, isadvice, question_en, answer_en
            },
        });
    };

    return { getFAQs, createFAQs, deleteFAQ, updateFAQ };
};