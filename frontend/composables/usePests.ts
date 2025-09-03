export const usePests = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '';
    const be_api_url = config.public.beUrl;
    const apiKey = 'Cocon541986'; 

    const getPests = async () => {
        const url = `${be_api_url}${apiBase}/pests`;
        console.log('Requesting URL:', url);
        return await $fetch(url, {
            headers: { 'cocon-key': apiKey },
        });
    };

    const getPestById = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid pest ID:', id);
            throw new Error('Invalid pest ID');
        }

        const url = `${be_api_url}${apiBase}/pests/${id}`;
        console.log('Requesting URL:', url);
        try {
            return await $fetch(url, { headers: { 'cocon-key': apiKey } });
        } catch (error) {
            console.error(`Error fetching pest by ID (${id}):`, error);
            throw error;
        }
    };

    const createPest = async (
        image: string,
        name: string,
        name_en: string,
        sci_name: string,
        lifecycle: string,
        prevent: string,
        lifecycle_en: string,
        prevent_en: string,
        status: boolean,
        type: '1' | '2' | '3' | '4'
    ) => {
        const url = `${be_api_url}${apiBase}/pests`;
        console.log('Requesting URL:', url);

        return await $fetch(url, {
            method: 'POST',
            headers: { 'cocon-key': apiKey },
            body: {
                image,
                name,
                name_en,
                sci_name,
                lifecycle,
                prevent,
                lifecycle_en,
                prevent_en,
                status,
                type,
            },
        });
    };

    const updatePest = async (
        id: number,
        payload: {
            image?: string;
            name?: string;
            name_en?: string;
            sci_name?: string;
            lifecycle?: string;
            prevent?: string;
            lifecycle_en?: string;
            prevent_en?: string;
            status?: boolean;
            type?: '1' | '2' | '3' | '4';
        }
    ) => {
        const url = `${be_api_url}${apiBase}/pests/${id}`;
        console.log('Updating pest at URL:', url);
        return await $fetch(url, {
            method: 'PUT',
            headers: { 'cocon-key': apiKey },
            body: payload,
        });
    };

    const deletePest = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid pest ID:', id);
            throw new Error('Invalid pest ID');
        }

        const url = `${be_api_url}${apiBase}/pests/${id}`;
        console.log('Deleting pest at URL:', url);
        return await $fetch(url, {
            method: 'DELETE',
            headers: { 'cocon-key': apiKey },
        });
    };

    return { getPests, getPestById, createPest, updatePest, deletePest };
};
    

  
