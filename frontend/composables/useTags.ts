// ~/composables/useTags.ts
import { useRuntimeConfig } from '#app'

export type Tag = { id: number; text: string }

export function useTags() {
  const config = useRuntimeConfig()
  const base = (config.public.apiBase?.replace(/\/+$/, '') || 'http://localhost:5100')
  const endpoint = `${base}/tags`
  const key = 'Cocon541986' // Hardcoded for now

  function headers(withKey = false): HeadersInit {
    const h: HeadersInit = { 'Content-Type': 'application/json' }
    if (withKey && key) (h as any)['cocon-key'] = key
    return h
  }

  async function getTags(search = ''): Promise<Tag[]> {
    const url = search
      ? `${endpoint}/with-count?search=${encodeURIComponent(search)}`
      : `${endpoint}/with-count`
    const r = await fetch(url, { method: 'GET', headers: headers(true) })
    if (!r.ok) throw new Error(`Get tags failed: ${r.status} ${r.statusText}`)
    return r.json()
  }

  // ✅ สร้าง tag ใหม่
  async function createTag(text: string) {
    const url = `${endpoint}`
    const r = await fetch(url, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify({ text })
    })
    if (!r.ok) throw new Error(await r.text())
    return r.json() as Promise<{ id: number; text: string }>
  }

  // ✅ อัปเดตชื่อแท็ก
  async function renameTag(id: number, text: string) {
    const url = `${endpoint}/${id}`
    const r = await fetch(url, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify({ text })
    })
    if (!r.ok) throw new Error(await r.text())
    return r.json() as Promise<Tag>
  }

  // ✅ ดึง experts ที่ใช้แท็กนี้ (by id)
  async function getExpertsByTagId(id: number) {
    const url = `${endpoint}/${id}/experts`
    const r = await fetch(url, { method: 'GET', headers: headers(true) })
    if (!r.ok) throw new Error(await r.text())
    return r.json() as Promise<any[]>
  }

  // ✅ detach แท็กออกจาก expert คนเดียว
  async function detachTagFromExpert(expertId: number, tagId: number) {
    const url = `${endpoint}/experts/${expertId}/tags/${tagId}`
    const r = await fetch(url, { method: 'DELETE', headers: headers(true) })
    if (!r.ok) throw new Error(await r.text())
    return r.json() as Promise<{ ok: boolean }>
  }

  // ✅ ดึงแท็กทั้งหมดของ expert (by expert id)
  async function getTagsByExpert(expertId: number) {
    const url = `${endpoint}/experts/${expertId}/tags`
    const r = await fetch(url, { method: 'GET', headers: headers(true) })
    if (!r.ok) throw new Error(await r.text())
    return r.json() as Promise<string[]>
  }

  // ✅ แทนที่แท็กของ expert (สูงสุด 5)
  async function updateExpertTags(expertId: number, tags: string[]) {
    const url = `${endpoint}/experts/${expertId}/tags`
    const r = await fetch(url, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify({ tags })
    })
    if (!r.ok) throw new Error(await r.text())
    return r.json() as Promise<{ expert_id: number; tags: string[] }>
  }

  return {
    getTags,
    createTag,
    renameTag,
    getExpertsByTagId,
    detachTagFromExpert,
    getTagsByExpert,
    updateExpertTags,
  }
}
