// ~/composables/useExpertTags.ts
import { shallowRef, computed } from 'vue'

export type TagRow = { id: number; text: string }

export const useExpertTags = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || ''
  const be_api_url = config.public.beUrl
  const apiKey = 'Cocon541986' // must match backend
  const headers = { 'cocon-key': apiKey } as const

  // simple in-memory caches
  const _allTagsCache = shallowRef<TagRow[] | null>(null)
  const allTagNames = computed(() =>
    (_allTagsCache.value ?? []).map(t => t.text)
  )

  /** Get ALL tags (backend returns up to 100, ordered by text). */
  const getAllTags = async (opts?: { force?: boolean }) => {
    if (_allTagsCache.value && !opts?.force) return _allTagsCache.value
    const url = `${be_api_url}${apiBase}/tags`
    const rows = await $fetch<TagRow[]>(url, { headers })
    _allTagsCache.value = rows || []
    return _allTagsCache.value
  }

  /** Get ALL tag names as string[] */
  const getAllTagNames = async (opts?: { force?: boolean }) => {
    const rows = await getAllTags(opts)
    return rows.map(r => r.text)
  }

  /** (Optional) Suggestions for autocomplete */
  const getTagSuggestions = async (search: string) => {
    const url = `${be_api_url}${apiBase}/tags`
    return await $fetch<TagRow[]>(url, { headers, query: { search } })
  }

  /** (Optional) Tags for one expert */
  const getTagsByExpert = async (expertId: number) => {
    const url = `${be_api_url}${apiBase}/tags/experts/${expertId}/tags`
    return await $fetch<string[]>(url, { headers })
  }

  /** (Optional) Replace tags for one expert (max 5 enforced server-side too) */
  const setTagsForExpert = async (expertId: number, tags: string[]) => {
    const clean = [...new Set((tags || []).map(t => String(t || '').trim()).filter(Boolean))].slice(0, 5)
    const url = `${be_api_url}${apiBase}/tags/experts/${expertId}/tags`
    const res = await $fetch<{ expert_id: number; tags: string[] }>(url, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: { tags: clean },
    })
    // refresh cache opportunistically
    if (_allTagsCache.value) {
      for (const t of res.tags) {
        if (!_allTagsCache.value.some(x => x.text === t)) {
          _allTagsCache.value.push({ id: -1, text: t })
        }
      }
    }
    return res
  }

  /** (Optional) Experts by tag */
  const getExpertsByTag = async (tag: string) => {
    const url = `${be_api_url}${apiBase}/tags/experts/by-tag`
    return await $fetch<any[]>(url, { headers, query: { tag } })
  }

  return {
    // main asks
    getAllTags,
    getAllTagNames,
    allTagNames,        // computed cache (reactive)
    // helpers (optional)
    getTagSuggestions,
    getTagsByExpert,
    setTagsForExpert,
    getExpertsByTag,
    // raw cache (reactive)
    allTags: _allTagsCache,
  }
}
