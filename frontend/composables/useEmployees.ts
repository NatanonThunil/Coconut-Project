export const useEmployees = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/env-notwork'; // Ensure apiBase has a default value
    const be_api_url = config.public.beUrl; // ดึง มาจาก nuxt config
    const apiKey = 'Cocon541986'; // ยังติดปัญหาใช้า env ใน composable ไม่ได้ ให้มันอยู่ตรงนี้ไปก่อน

    const getEmployees = async () => {
        const url = `${be_api_url}${apiBase}/employees`;
        console.log('Requesting URL:', url);

        return await $fetch(url, {
            headers: {
                'cocon-key': apiKey,
            },
        });
    };

    const getEmployeeById = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid employee ID:', id);
            throw new Error('Invalid employee ID');
        }

        const url = `${be_api_url}${apiBase}/employees/${id}`;
        console.log('Requesting URL:', url);
        try {
            const response = await $fetch(url, {
                headers: {
                    'cocon-key': apiKey,
                },
            });
            return response;
        } catch (error) {
            console.error(`Error fetching employee by ID (${id}):`, error);
            throw error;
        }
    };

    const createEmployee = async (
        name: string,
        position: string,
        image: string, // ยังไม่ได้ทำรับรองรูปภาพ
        description: string,
        status: boolean,
        name_en: string,
        position_en: string,
        description_en: string,
        tag: string[] = [],
    
    ) => {
        const url = `${be_api_url}${apiBase}/employees`;
        console.log('Requesting URL:', url);
        return await $fetch(url, {
            method: 'POST',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                name,
                position,
                image,
                description,
                status,
                name_en,
                position_en,
                description_en,
                tag,
            },
        });
    };

    return { getEmployees, getEmployeeById, createEmployee };
};