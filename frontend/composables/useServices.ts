// composables/useServices.ts
export type Service = {
    id: number;
    image: string | null;         // path like "/images/xxx.webp"
    title: string;
    description: string | null;
    status: 0 | 1;                // tinyint(1)
    title_en: string;
    description_en: string | null;
};

export type ServiceCreatePayload = {
    image: string;                // REQUIRED: path from /img-upload
    title: string;                // REQUIRED
    title_en: string;             // REQUIRED
    description?: string | null;
    description_en?: string | null;
    status?: boolean | 0 | 1;     // optional; default 0/1 on server
};

export type ServiceUpdatePayload = Partial<ServiceCreatePayload>;

const toStatusNum = (v: unknown): 0 | 1 => (Number(v) ? 1 : 0);

export const useServices = () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '';
    const be_api_url = config.public.beUrl;
    const apiKey = (config.public.apiKey as string) || 'Cocon541986'; // keep or move to env

    const baseUrl = `${be_api_url}${apiBase}/services`;
    const headers = { 'cocon-key': apiKey };

    const getServices = async (): Promise<Service[]> => {
        return await $fetch<Service[]>(baseUrl, { headers });
    };

    const getServiceById = async (id: number): Promise<Service> => {
        if (!id || isNaN(id as any)) throw new Error('Invalid service ID');
        return await $fetch<Service>(`${baseUrl}/${id}`, { headers });
    };

    const createService = async (payload: ServiceCreatePayload): Promise<Service> => {
        if (!payload?.title || !payload?.title_en) {
            throw new Error('title and title_en are required');
        }
        if (!payload?.image) {
            throw new Error('image path is required (upload via /img-upload first)');
        }

        const body = {
            image: payload.image,
            title: payload.title,
            description: payload.description ?? '',
            status: payload.status === undefined ? 0 : toStatusNum(payload.status),
            title_en: payload.title_en,
            description_en: payload.description_en ?? '',
        };

        return await $fetch<Service>(baseUrl, {
            method: 'POST',
            headers,
            body,
        });
    };

    const updateService = async (id: number, payload: ServiceUpdatePayload): Promise<{ message: string }> => {
        if (!id || isNaN(id as any)) throw new Error('Invalid service ID');

        // Only send provided fields; normalize status if present
        const body: Record<string, any> = {};
        if (payload.image !== undefined) body.image = payload.image;
        if (payload.title !== undefined) body.title = payload.title;
        if (payload.description !== undefined) body.description = payload.description;
        if (payload.status !== undefined) body.status = toStatusNum(payload.status);
        if (payload.title_en !== undefined) body.title_en = payload.title_en;
        if (payload.description_en !== undefined) body.description_en = payload.description_en;

        if (Object.keys(body).length === 0) throw new Error('No fields to update');

        return await $fetch<{ message: string }>(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers,
            body,
        });
    };

    const deleteService = async (id: number): Promise<{ message: string }> => {
        if (!id || isNaN(id as any)) throw new Error('Invalid service ID');
        return await $fetch<{ message: string }>(`${baseUrl}/${id}`, {
            method: 'DELETE',
            headers,
        });
    };

    return { getServices, getServiceById, createService, updateService, deleteService };
};
