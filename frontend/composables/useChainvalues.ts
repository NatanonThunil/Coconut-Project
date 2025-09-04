export const useChainvalues = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '';
    const be_api_url = config.public.beUrl;
    const apiKey = 'Cocon541986'; // Hardcoded for now

    const getChainvalues = async () => {
        const url = `${be_api_url}${apiBase}/chain-values`;
        console.log('Requesting URL:', url);
        return await $fetch(url, {
            headers: { 'cocon-key': apiKey },
        });
    };

    const getChainvalueById = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid chain value ID:', id);
            throw new Error('Invalid chain value ID');
        }

        const url = `${be_api_url}${apiBase}/chain-values/${id}`;
        console.log('Requesting URL:', url);
        try {
            return await $fetch(url, { headers: { 'cocon-key': apiKey } });
        } catch (error) {
            console.error(`Error fetching chain value by ID (${id}):`, error);
            throw error;
        }
    };

    const createChainvalue = async (
        image: string, // base64 string
        title: string,
        title_en: string,
        description: string,
        description_en: string,
        status: boolean,
        type: '0' | '1' | '2',
        category: '0' | '1'
    ) => {
        const url = `${be_api_url}${apiBase}/chain-values`;
        console.log('Requesting URL:', url);

        return await $fetch(url, {
            method: 'POST',
            headers: { 'cocon-key': apiKey },
            body: {
                image,
                title,
                title_en,
                description,
                description_en,
                status,
                type,
                category,
            },
        });
    };

    const updateChainvalue = async (
        id: number,
        payload: {
            image?: string;
            title?: string;
            title_en?: string;
            description?: string;
            description_en?: string;
            status?: boolean;
            type?: '0' | '1' | '2';
            category?: '0' | '1';
        }
    ) => {
        const url = `${be_api_url}${apiBase}/chain-values/${id}`;
        console.log('Updating chain value at URL:', url);
        return await $fetch(url, {
            method: 'PUT',
            headers: { 'cocon-key': apiKey },
            body: payload,
        });
    };

    const deleteChainvalue = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid chain value ID:', id);
            throw new Error('Invalid chain value ID');
        }

        const url = `${be_api_url}${apiBase}/chain-values/${id}`;
        console.log('Deleting chain value at URL:', url);
        return await $fetch(url, {
            method: 'DELETE',
            headers: { 'cocon-key': apiKey },
        });
    };

    return { getChainvalues, getChainvalueById, createChainvalue, updateChainvalue, deleteChainvalue };
};
