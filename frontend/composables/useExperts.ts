// ~/composables/useExperts.ts
export type Expert = {
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
  type?: number | null
  email?: string | null
}

export const useExperts = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || ''
  const be_api_url = config.public.beUrl
  const apiKey = 'Cocon541986' // Hardcoded for now (must match backend API_SECRET)

  const headers = { 'cocon-key': apiKey } as const

  const getExperts = async () => {
    const url = `${be_api_url}${apiBase}/experts`
    console.log('Requesting URL:', url)
    return await $fetch<Expert[]>(url, { headers })
  }

  const getExpertById = async (id: number) => {
    if (!id || isNaN(id as any)) {
      console.error('Invalid expert ID:', id)
      throw new Error('Invalid expert ID')
    }
    const url = `${be_api_url}${apiBase}/experts/${id}`
    console.log('Requesting URL:', url)
    try {
      return await $fetch<Expert>(url, { headers })
    } catch (error) {
      console.error(`Error fetching expert by ID (${id}):`, error)
      throw error
    }
  }

  const createExpert = async (payload: Omit<Expert, 'id'>) => {
    const url = `${be_api_url}${apiBase}/experts`
    console.log('Requesting URL:', url)
    return await $fetch<{ id: number } & Expert>(url, {
      method: 'POST',
      headers,
      body: payload,
    })
  }

  const updateExpert = async (id: number, payload: Partial<Omit<Expert, 'id'>>) => {
    if (!id || isNaN(id as any)) {
      console.error('Invalid expert ID:', id)
      throw new Error('Invalid expert ID')
    }
    const url = `${be_api_url}${apiBase}/experts/${id}`
    console.log('Updating expert at URL:', url)
    return await $fetch(url, {
      method: 'PUT',
      headers,
      body: payload,
    })
  }

  const deleteExpert = async (id: number) => {
    if (!id || isNaN(id as any)) {
      console.error('Invalid expert ID:', id)
      throw new Error('Invalid expert ID')
    }
    const url = `${be_api_url}${apiBase}/experts/${id}`
    console.log('Deleting expert at URL:', url)
    return await $fetch(url, {
      method: 'DELETE',
      headers,
    })
  }

  return { getExperts, getExpertById, createExpert, updateExpert, deleteExpert }
}
