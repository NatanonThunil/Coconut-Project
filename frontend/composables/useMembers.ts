export const useMembers = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '';
    const be_api_url = config.public.beUrl;
    const apiKey = 'Cocon541986'; // can move to env

    // GET all members
    const getMembers = async () => {
        const url = `${be_api_url}${apiBase}/members`;
        console.log('Requesting members from URL:', url);
        return await $fetch(url, {
            headers: { 'cocon-key': apiKey },
        });
    };

    // GET member by ID
    const getMemberById = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid member ID:', id);
            throw new Error('Invalid member ID');
        }

        const url = `${be_api_url}${apiBase}/members/${id}`;
        console.log('Requesting member at URL:', url);
        try {
            return await $fetch(url, { headers: { 'cocon-key': apiKey } });
        } catch (error) {
            console.error(`Error fetching member by ID (${id}):`, error);
            throw error;
        }
    };

    // CREATE member
    const createMember = async (
        payload: {
            image: string;
            name: string;
            name_en: string;
            email: string;
            address: string;
            address_en: string;
            phoneNumber: string;
            status: boolean | number;
            description: string;
            description_en: string;
        }
    ) => {
        const url = `${be_api_url}${apiBase}/members`;
        console.log('Creating member at URL:', url);
        return await $fetch(url, {
            method: 'POST',
            headers: { 'cocon-key': apiKey },
            body: payload,
        });
    };

    // UPDATE member
    const updateMember = async (
        id: number,
        payload: {
            image?: string;
            name?: string;
            name_en?: string;
            email?: string;
            address?: string;
            address_en?: string;
            phoneNumber?: string;
            status?: boolean | number;
            description?: string;
            description_en?: string;
        }
    ) => {
        if (!id || isNaN(id)) throw new Error('Invalid member ID');

        const url = `${be_api_url}${apiBase}/members/${id}`;
        console.log('Updating member at URL:', url);
        return await $fetch(url, {
            method: 'PUT',
            headers: { 'cocon-key': apiKey },
            body: payload,
        });
    };

    // DELETE member
    const deleteMember = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid member ID:', id);
            throw new Error('Invalid member ID');
        }

        const url = `${be_api_url}${apiBase}/members/${id}`;
        console.log('Deleting member at URL:', url);
        return await $fetch(url, {
            method: 'DELETE',
            headers: { 'cocon-key': apiKey },
        });
    };

    return {
        getMembers,
        getMemberById,
        createMember,
        updateMember,
        deleteMember,
    };
};
