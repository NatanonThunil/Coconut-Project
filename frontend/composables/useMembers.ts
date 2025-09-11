// ~/composables/useMembers.ts
export type Member = {
    id?: number
    image?: string | null
    name: string
    name_en?: string | null
    address?: string | null
    address_en?: string | null
    phoneNumber?: string | null
    status?: 0 | 1 | boolean
    description?: string | null
    description_en?: string | null
    email?: string | null
}

export const useMembers = () => {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || ''
    const be_api_url = config.public.beUrl
    const apiKey = 'Cocon541986' // TODO: move to runtime env

    const headers = { 'cocon-key': apiKey } as const

    const getMembers = async () => {
        const url = `${be_api_url}${apiBase}/members`
        console.log('Requesting URL:', url)
        return await $fetch<Member[]>(url, { headers })
    }

    const getMemberById = async (id: number) => {
        if (!id || isNaN(id as any)) {
            console.error('Invalid member ID:', id)
            throw new Error('Invalid member ID')
        }
        const url = `${be_api_url}${apiBase}/members/${id}`
        console.log('Requesting URL:', url)
        try {
            return await $fetch<Member>(url, { headers })
        } catch (error) {
            console.error(`Error fetching member by ID (${id}):`, error)
            throw error
        }
    }

    const createMember = async (payload: Omit<Member, 'id'>) => {
        const url = `${be_api_url}${apiBase}/members`
        console.log('Creating member at URL:', url)
        return await $fetch<{ id: number } & Member>(url, {
            method: 'POST',
            headers,
            body: payload,
        })
    }

    const updateMember = async (id: number, payload: Partial<Omit<Member, 'id'>>) => {
        if (!id || isNaN(id as any)) {
            console.error('Invalid member ID:', id)
            throw new Error('Invalid member ID')
        }
        const url = `${be_api_url}${apiBase}/members/${id}`
        console.log('Updating member at URL:', url)
        return await $fetch(url, {
            method: 'PUT',
            headers,
            body: payload,
        })
    }

    const deleteMember = async (id: number) => {
        if (!id || isNaN(id as any)) {
            console.error('Invalid member ID:', id)
            throw new Error('Invalid member ID')
        }
        const url = `${be_api_url}${apiBase}/members/${id}`
        console.log('Deleting member at URL:', url)
        return await $fetch(url, {
            method: 'DELETE',
            headers,
        })
    }

    return {
        getMembers,
        getMemberById,
        createMember,
        updateMember,
        deleteMember,
    }
}