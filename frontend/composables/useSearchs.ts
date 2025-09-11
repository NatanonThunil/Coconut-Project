// ~/composables/useSearchs.ts
import { useRuntimeConfig } from '#app'

export type SearchType =
  | 'new'
  | 'coconut'
  | 'pest'
  | 'achievement'
  | 'chain_values'
  | 'employee'
  | 'event'
  | 'expert'
  | 'faq'
  | 'member'

export type SearchItem = {
  type: SearchType
  id: number
  title: string
  snippet: string
  url: string
  score?: number
}

export type SearchResponse = {
  query: string
  total: number
  page: number
  limit: number
  data: SearchItem[]
}

type SearchOptions = {
  types?: SearchType[]            // restrict tables
  statusOnly?: boolean            // defaults true on BE; pass false to include all
  limit?: number                  // default 20
  page?: number                   // default 1
  signal?: AbortSignal            // for abortable calls
}

export function useSearchs() {
  const config = useRuntimeConfig()

  const base = (config.public.apiBase || 'http://localhost:5100').replace(/\/+$/, '')
  const endpoint = `${base}/search`


  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'cocon-key': config.public.apiKey || '',
  }

  function buildURL(q: string, opts?: SearchOptions) {
    const params = new URLSearchParams()
    params.set('q', String(q).trim())
    if (opts?.types?.length) params.set('types', opts.types.join(','))
    if (typeof opts?.statusOnly === 'boolean') params.set('statusOnly', String(opts.statusOnly))
    if (opts?.limit) params.set('limit', String(opts.limit))
    if (opts?.page) params.set('page', String(opts.page))
    return `${endpoint}?${params.toString()}`
  }


  async function search(q: string, opts?: SearchOptions): Promise<SearchResponse> {
    if (!q?.trim()) {
      return { query: '', total: 0, page: 1, limit: opts?.limit ?? 20, data: [] }
    }
    const url = buildURL(q, opts)

    const res = await fetch(url, {
      method: 'GET',
      headers: defaultHeaders,
      signal: opts?.signal,
  
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
    
      if (res.status === 403) {
        throw new Error('403 Forbidden: invalid or missing API key (header "cocon-key").')
      }
      throw new Error(`[${res.status}] ${text || 'Search request failed'}`)
    }

    const json = (await res.json()) as SearchResponse

    json.data = Array.isArray(json.data) ? json.data as SearchItem[] : []
    return json
  }


  function searchEverywhere(q: string, opts?: Omit<SearchOptions, 'types'>) {
    return search(q, opts)
  }

  function searchByTypes(q: string, types: SearchType[], opts?: Omit<SearchOptions, 'types'>) {
    return search(q, { ...opts, types })
  }


  function makeLiveSearcher() {
    let controller: AbortController | null = null

    return {
      run(q: string, opts?: SearchOptions) {
        if (controller) controller.abort()
        controller = new AbortController()
        const promise = search(q, { ...opts, signal: controller.signal })
        return { promise, abort: () => controller?.abort() }
      },
      abort() {
        controller?.abort()
      },
    }
  }

  function groupByType(items: SearchItem[]) {
    return items.reduce<Record<SearchType, SearchItem[]>>((acc, item) => {
      const key = item.type as SearchType
      acc[key] ||= []
      acc[key].push(item)
      return acc
    }, {} as Record<SearchType, SearchItem[]>)
  }

  return {
    search,
    searchEverywhere,
    searchByTypes,
    makeLiveSearcher,
    groupByType,
  }
}
