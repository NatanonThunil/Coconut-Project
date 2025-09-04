export const useEvents = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || ''; // Ensure apiBase has a default value
    const be_api_url = config.public.beUrl; // ดึง มาจาก nuxt config
    const apiKey = 'Cocon541986'; // ยังติดปัญหาใช้า env ใน composable ไม่ได้ ให้มันอยู่ตรงนี้ไปก่อน

    const getEvents = async () => {
        const url = `${be_api_url}${apiBase}/events`;
        console.log('Requesting URL:', url);

        return await $fetch(url, {
            headers: {
                'cocon-key': apiKey,
            },
        });
    };

    const getEventById = async (id: number) => {
        if (!id || isNaN(id)) {
            console.error('Invalid event ID:', id);
            throw new Error('Invalid event ID');
        }

        const url = `${be_api_url}${apiBase}/events/${id}`;
        console.log('Requesting URL:', url);
        try {
            const response = await $fetch(url, {
                headers: {
                    'cocon-key': apiKey,
                },
            });
            return response;
        } catch (error) {
            console.error(`Error fetching event by ID (${id}):`, error);
            throw error;
        }
    };
   
    const createEvent = async (
        image: string, ///ยังไม่ได้ทำรับรองรูปภาพ
        title: string, 
        organizer: string,
        date_start: Date,
        date_end: Date,
        location_name: string,
        location_url: string,
        register_url: string,
        description: string,
        event_category: 'educate' | 'conference' | 'other',
        status: boolean,
        location_name_en: string,
        title_en: string,
        description_en: string
    ) => {
        const url = `${be_api_url}${apiBase}/events`;
        console.log('Requesting URL:', url);
        return await $fetch(url, {
            method: 'POST',
            headers: {
                'cocon-key': apiKey,
            },
            body: {
                image,
                title,
                organizer,
                date_start,
                date_end,
                location_name,
                location_url,
                register_url,
                description,
                event_category,
                status,
                location_name_en,
                title_en,
                description_en,
            },
        });
    };

    return { getEvents, getEventById, createEvent };
};