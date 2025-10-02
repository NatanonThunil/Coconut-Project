// ~/composables/useSponsors.ts
type Sponsor = {
  id: number
  footer_id: number
  logo: string
  url: string
  alt?: string | null
  created_at?: string
}

type CreateSponsorInput = {
  footer_id: number
  logo: string
  url: string
  alt?: string | null
}

type UpdateSponsorInput = {
  logo?: string
  url?: string
  alt?: string | null
}

export const useSponsors = () => {
  const config = useRuntimeConfig()
  // แนะนำให้ตั้งค่าใน nuxt.config:
  // runtimeConfig.public.apiBase = '/api'
  // runtimeConfig.public.beUrl = 'https://your-backend'
  // runtimeConfig.public.apiKey = 'Cocon541986'  // หรือจาก .env
  const base = (config.public.beUrl || '').replace(/\/+$/, '')
  const apiBase = (config.public.apiBase || '').replace(/^\/?/, '/')
  const BASE_URL = `${base}${apiBase}sponsors`

  const headers = {
    'Content-Type': 'application/json',
    'cocon-key': config.public.apiKey as string
  }

  // ===== helpers =====
  const handleFetch = async <T>(promise: Promise<T>): Promise<T> => {
    try {
      return await promise
    } catch (err: any) {
      // ปรับข้อความ error ให้อ่านง่าย
      const msg =
        err?.data?.error ||
        err?.message ||
        'Request failed'
      throw new Error(msg)
    }
  }

  // ===== queries =====

  /** ดึง sponsor ทั้งหมดของ footer */
  const getSponsorsByFooter = async (footerId: number): Promise<Sponsor[]> => {
    const url = `${BASE_URL}/footer/${footerId}`
    return handleFetch(
      $fetch<Sponsor[]>(url, { headers, method: 'GET' })
    )
  }

  /** ดึง sponsor ตาม id */
  const getSponsor = async (id: number): Promise<Sponsor> => {
    const url = `${BASE_URL}/${id}`
    return handleFetch(
      $fetch<Sponsor>(url, { headers, method: 'GET' })
    )
  }

  /** สร้าง sponsor ใหม่ */
  const createSponsor = async (data: CreateSponsorInput): Promise<Sponsor> => {
    return handleFetch(
      $fetch<Sponsor>(BASE_URL, {
        headers,
        method: 'POST',
        body: data
      })
    )
  }

  /** แก้ไข sponsor ตาม id */
  const updateSponsor = async (id: number, data: UpdateSponsorInput): Promise<Sponsor> => {
    const url = `${BASE_URL}/${id}`
    return handleFetch(
      $fetch<Sponsor>(url, {
        headers,
        method: 'PUT',
        body: data
      })
    )
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
        throw new Error(`ต้องมีสปอนเซอร์อย่างน้อย ${minCount} รายต่อ footer นี้`)
      }
    }

    const url = `${BASE_URL}/${id}`
    return handleFetch(
      $fetch<{ message: string }>(url, { headers, method: 'DELETE' })
    )
  }

  // ===== composable state (optional) =====
  // ใช้ในหน้า/คอมโพเนนท์เพื่อ cache และ reactive ได้ง่าย
  const sponsors = useState<Record<number, Sponsor[]>>('sponsorsByFooter', () => ({}))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchSponsorsToState = async (footerId: number) => {
    loading.value = true
    error.value = null
    try {
      const rows = await getSponsorsByFooter(footerId)
      sponsors.value[footerId] = rows
    } catch (e: any) {
      error.value = e.message || 'โหลดข้อมูลล้มเหลว'
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

  return {
    // raw CRUD
    getSponsorsByFooter,
    getSponsor,
    createSponsor,
    updateSponsor,
    deleteSponsor,

    // reactive state helpers
    sponsors,
    loading,
    error,
    fetchSponsorsToState,
    addSponsorToState,
    updateSponsorInState,
    removeSponsorFromState
  }
}
