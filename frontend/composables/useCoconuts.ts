export const useCoconuts = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/env-notwork';
    const be_api_url = config.public.beUrl;
    const apiKey = 'Cocon541986'; // Hardcoded for now

    const getCoconuts = async () => {
        const url = `${be_api_url}${apiBase}/coconuts`;
        console.log('Requesting URL:', url);

        return await $fetch(url, {
            headers: {
                'cocon-key': apiKey,
            },
        });
    };

    const getCoconutById = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid coconut ID:', id);
            throw new Error('Invalid coconut ID');
        }

        const url = `${be_api_url}${apiBase}/coconuts/${id}`;
        console.log('Requesting URL:', url);
        try {
            const response = await $fetch(url, {
                headers: {
                    'cocon-key': apiKey,
                },
            });
            return response;
        } catch (error) {
            console.error(`Error fetching coconut by ID (${id}):`, error);
            throw error;
        }
    };

    const createCoconut = async (
        description: string,
        origin: string,
        status: boolean,
        name_eng: string,
        name_th: string,
        sci_name_f: string,
        sci_name_m: string,
        sci_name_l: string,
        characteristics: string,
        youngold: 'Young' | 'Old',
        image: string // base64 string
    ) => {
        const url = `${be_api_url}${apiBase}/coconuts`;
        console.log('Requesting URL:', url);
        return await $fetch(url, {
            method: 'POST',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                description,
                origin,
                name_eng,
                name_th,
                sci_name_f,
                sci_name_m,
                sci_name_l,
                characteristics,
                youngold,
                status,
                image,
            },
        });
    };

    return { getCoconuts, getCoconutById, createCoconut };
};