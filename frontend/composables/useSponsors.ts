// composables/useSponsors.ts
export type Sponsor = {
  id: number
  footer_id: number
  logo: string
  url: string
  alt?: string | null
  created_at?: string
  position?: number
}

export type CreateSponsorInput = {
  footer_id: number
  logo: string
  url: string
  alt?: string | null
  position?: number
}

export type UpdateSponsorInput = {
  logo?: string
  url?: string
  alt?: string | null
  position?: number
}

type FetchErr = {
  statusCode?: number
  statusMessage?: string
  data?: any
  message?: string
  response?: { status?: number; statusText?: string; _data?: any; url?: string }
}

export const useSponsors = () => {
  const config = useRuntimeConfig()
  const DEBUG = true // ตั้ง false เมื่องานจริง

  // ---- URL normalize ที่กันทุกเคส ----
  const be = (config.public.beUrl || '').replace(/\/+$/, '')            // ตัดท้าย /
  const apiBaseRaw = (config.public.apiBase || '')                       // เช่น '/coconut-api' หรือ 'coconut-api/'
  const apiBase = apiBaseRaw
    ? `/${apiBaseRaw.replace(/^\/+/, '').replace(/\/+$/, '')}/`
    : '/'
  const baseUrl = `${be}${apiBase}sponsors`                               // ผลลัพธ์: https://host/coconut-api/sponsors
  const apiKey = (config.public.apiKey as string) || 'Cocon541986'

  const headers = { 'cocon-key': apiKey }

  if (DEBUG) {
    // log ครั้งเดียวพอ
    // @ts-ignore
    window.__SPONSOR_DEBUG__ = { be, apiBase, baseUrl, apiKeyPreview: apiKey?.slice?.(0, 3) + '***' }
    console.info('[useSponsors] config:', { be, apiBase, baseUrl })
  }

  // ---- helper: แปลง error ของ $fetch ให้อ่านง่าย ----
  const toNiceError = (err: any): Error => {
    const e = err as FetchErr
    const code = e?.statusCode ?? e?.response?.status
    const statusText = e?.statusMessage ?? e?.response?.statusText
    const serverData = e?.data ?? e?.response?._data
    const serverMsg = (serverData && (serverData.error || serverData.message)) || undefined
    const msg = serverMsg || e?.message || statusText || 'Request failed'
    if (DEBUG) {
      console.error('[useSponsors] fetch error:', {
        url: e?.response?.url,
        code,
        statusText,
        serverData,
        raw: err
      })
    }
    return new Error(code ? `[${code}] ${msg}` : msg)
  }

  // ---- wrapper: เสริม hook for debugging + timeout ----
  const run = async <T>(url: string, opts: Parameters<typeof $fetch<T>>[1] = {}) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 15000) // กันเคสค้าง 15s
    try {
      if (DEBUG) console.log('[useSponsors] request ->', url, opts?.method || 'GET', { headers: opts?.headers, body: opts?.body })
      const res = await $fetch<T>(url, {
        signal: controller.signal,
        headers,
        onRequest({ options }) {
          if (DEBUG) console.log('[useSponsors] onRequest', { url, options })
        },
        onRequestError({ error }) {
          if (DEBUG) console.warn('[useSponsors] onRequestError', error)
        },
        onResponse({ response }) {
          if (DEBUG) console.log('[useSponsors] onResponse', { status: response.status, url: response.url })
        },
        onResponseError({ response }) {
          if (DEBUG) console.warn('[useSponsors] onResponseError', { status: response.status, data: response._data })
        },
        ...opts,
      })
      return res
    } catch (err) {
      throw toNiceError(err)
    } finally {
      clearTimeout(id)
    }
  }

  // ===== queries =====
  const getSponsorsByFooter = async (footerId: number): Promise<Sponsor[]> => {
    const url = `${baseUrl}/footer/${footerId}`
    return run<Sponsor[]>(url, { method: 'GET' })
  }

  const getSponsor = async (id: number): Promise<Sponsor> => {
    const url = `${baseUrl}/${id}`
    return run<Sponsor>(url, { method: 'GET' })
  }

  const createSponsor = async (data: CreateSponsorInput): Promise<Sponsor> => {
    return run<Sponsor>(baseUrl, { method: 'POST', body: data })
  }

  const updateSponsor = async (id: number, data: UpdateSponsorInput): Promise<Sponsor> => {
    const url = `${baseUrl}/${id}`
    return run<Sponsor>(url, { method: 'PUT', body: data })
  }

  /**
   * ลบ sponsor ตาม id
   * - ป้องกันเหลือต่ำกว่า minCount (ดีฟอลต์ 4) ถ้าให้ footerId มาด้วย
   * - ถ้าต้องการข้ามกฎนี้ ให้ส่ง { enforceMin: false }
   */
  const deleteSponsor = async (
    id: number,
    opts?: { footerId?: number; minCount?: number; enforceMin?: boolean }
  ): Promise<{ message: string }> => {
    const enforceMin = opts?.enforceMin ?? true
    const minCount = opts?.minCount ?? 4

    if (enforceMin && opts?.footerId) {
      const list = await getSponsorsByFooter(opts.footerId)
      if (list.length <= minCount) {
        throw new Error(`ต้องมีสปอนเซอร์อย่างน้อย ${minCount} รายต่อ footer นี้ (ปัจจุบัน ${list.length})`)
      }
    }

    const url = `${baseUrl}/${id}`
    return run<{ message: string }>(url, { method: 'DELETE' })
  }

  // ===== state =====
  const sponsors = useState<Record<number, Sponsor[]>>('sponsorsByFooter', () => ({}))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchSponsorsToState = async (footerId: number) => {
    loading.value = true
    error.value = null
    try {
      const rows = await getSponsorsByFooter(footerId)
      sponsors.value[footerId] = Array.isArray(rows) ? rows : []
    } catch (e: any) {
      error.value = e?.message || 'โหลดข้อมูลล้มเหลว'
    } finally {
      loading.value = false
    }
  }

  const addSponsorToState = (footerId: number, sp: Sponsor) => {
    if (!sponsors.value[footerId]) sponsors.value[footerId] = []
    sponsors.value[footerId].push(sp)
  }

  const updateSponsorInState = (footerId: number, sp: Sponsor) => {
    const arr = sponsors.value[footerId]
    if (!arr) return
    const i = arr.findIndex(x => x.id === sp.id)
    if (i !== -1) arr[i] = sp
  }

  const removeSponsorFromState = (footerId: number, id: number) => {
    const arr = sponsors.value[footerId]
    if (!arr) return
    sponsors.value[footerId] = arr.filter(x => x.id !== id)
  }

  // ---- ฟังก์ชันทดสอบดีบักเร็ว ๆ ----
  const __debugPing = async () => {
    // เรียก endpoint ที่ง่ายที่สุด เช่น GET /sponsors/footer/1
    // ปรับ footerId ให้ตรงกับข้อมูลที่มีจริงในฐาน
    return getSponsorsByFooter(1)
  }

  return {
    // raw CRUD
    getSponsorsByFooter,
    getSponsor,
    createSponsor,
    updateSponsor,
    deleteSponsor,

    // state helpers
    sponsors,
    loading,
    error,
    fetchSponsorsToState,
    addSponsorToState,
    updateSponsorInState,
    removeSponsorFromState,

    // debug
    __debugPing
  }
}
