export const useMembers = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '';
    const be_api_url = config.public.beUrl;
    const apiKey = 'Cocon541986'; // Same as before — can be moved to env later

    const getMembers = async () => {
        const url = `${be_api_url}${apiBase}/members`;
        console.log('Requesting members from URL:', url);
        return await $fetch(url, {
            headers: {
                'cocon-key': apiKey,
            },
        });
    };
    const getMemberById = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid members ID:', id);
            throw new Error('Invalid members ID');
        }

        const url = `${be_api_url}${apiBase}/members/${id}`;
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

    const createMember = async (
        image: string,
        name: string,
        name_en: string,
        email: string,
        address: string,
        address_en: string,
        phoneNumber: string,
        status: boolean,
        description: string,
        description_en: string
    ) => {
        const url = `${be_api_url}${apiBase}/members`;
        console.log('Creating member at URL:', url);
        return await $fetch(url, {
            method: 'POST',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                image, name, name_en, email, address, address_en,
                phoneNumber, status, description, description_en
            },
        });
    };

    const deleteMember = async (id: number) => {
        const url = `${be_api_url}${apiBase}/members/${id}`;
        console.log('Deleting member at URL:', url);
        return await $fetch(url, {
            method: 'DELETE',
            headers: {
                'cocon-key': apiKey,
            },
        });
    };

    const updateMember = async (
        id: number,
        image: string,
        name: string,
        name_en: string,
        email: string,
        address: string,
        address_en: string,
        phoneNumber: string,
        status: boolean,
        description: string,
        description_en: string
    ) => {
        const url = `${be_api_url}${apiBase}/members/${id}`;
        console.log('Updating member at URL:', url);
        return await $fetch(url, {
            method: 'PUT',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                image, name, name_en, email, address, address_en,
                phoneNumber, status, description, description_en
            },
        });
    };

    return {
        getMembers,
        getMemberById,
        createMember,
        deleteMember,
        updateMember,
    };
};