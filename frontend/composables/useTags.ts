// ~/composables/useTags.ts
import { useRuntimeConfig } from '#app'

export type Tag = { id?: number; name: string }

export function useTags() {
  const config = useRuntimeConfig()
  const base = (config.public.apiBase?.replace(/\/+$/, '') || 'http://localhost:5100')
  const endpoint = `${base}/experts/tags`     // matches routes I gave you

  function headers(withKey = false): HeadersInit {
    const h: HeadersInit = { 'Content-Type': 'application/json' }
    const key = config.public.coconKey || (config as any).coconKey
    if (withKey && key) (h as any)['cocon-key'] = key
    return h
  }

  async function getAllTags(): Promise<Tag[]> {
    const url = `${endpoint}/all`
    const r = await fetch(url, { method: 'GET', headers: headers(false) })
    if (!r.ok) throw new Error(`Get tags failed: ${r.status} ${r.statusText}`)
    return r.json()
  }

  async function createTag(name: string) {
    const url = `${endpoint}`
    const r = await fetch(url, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify({ name })
    })
    if (!r.ok) {
      const msg = await r.text().catch(() => '')
      throw new Error(`Create tag failed: ${r.status} ${r.statusText} ${msg}`)
    }
    return r.json() as Promise<{ id: number | null; name: string }>
  }

  return { getAllTags, createTag }
}
