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

  async function getTags(search = '') {
    const url = search
      ? `${endpoint}/with-count?search=${encodeURIComponent(search)}`
      : `${endpoint}/with-count`
    const r = await fetch(url, { method: 'GET', headers: headers(true) })
    if (!r.ok) throw new Error(`Get tags failed: ${r.status} ${r.statusText}`)
    return r.json()
  } // ~/composables/useTags.js (หรือ .ts ถ้าใช้ TS แต่ห้ามใส่ type ในไฟล์ .js)
  async function createTag(text) {
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify({ text })
    });

    const raw = await r.text(); // อ่านเป็น text ก่อน
    if (!r.ok) {
      // ถ้ามีข้อความ error ก็ตีเป็น error ให้ครบถ้วน
      throw new Error(raw || `Create tag failed: ${r.status} ${r.statusText}`);
    }

    // รองรับกรณี body ว่าง (กัน error json())
    if (!raw) {
      throw new Error('Create tag failed: empty response from server');
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error('Create tag failed: invalid JSON response');
    }

    if (!data || typeof data.id === 'undefined') {
      throw new Error('Create tag failed: malformed response');
    }
    return data; // { id, text }
  }


  async function renameTag(id: number, text: string) {
    const r = await fetch(`${endpoint}/${id}`, {
      method: 'PUT', headers: headers(true), body: JSON.stringify({ text })
    })
    if (!r.ok) throw new Error(await r.text())
    return r.json()
  }

  async function getExpertsByTagId(id: number) {
    const r = await fetch(`${endpoint}/${id}/experts`, { method: 'GET', headers: headers(true) })
    if (!r.ok) throw new Error(await r.text())
    return r.json()
  }

  async function detachTagFromExpert(expertId: number, tagId: number) {
    const r = await fetch(`${endpoint}/experts/${expertId}/tags/${tagId}`, { method: 'DELETE', headers: headers(true) })
    if (!r.ok) throw new Error(await r.text())
    return r.json()
  }

  async function attachTagToExpert(expertId: number, tagId: number) {
    const r = await fetch(`${endpoint}/experts/${expertId}/tags/${tagId}`, { method: 'POST', headers: headers(true) })
    if (!r.ok) throw new Error(await r.text())
    return r.json()
  }

  async function deleteTag(id: number) {
    const r = await fetch(`${endpoint}/${id}`, { method: 'DELETE', headers: headers(true) })
    if (!r.ok) throw new Error(await r.text())
    return r.json()
  }

  // ✅ ใหม่: ค้นหา expert ด้วยชื่อ/อีเมล/องค์กร
  async function searchExperts(q: string) {
    const url = `${endpoint}/experts/search?q=${encodeURIComponent(q || '')}`
    const r = await fetch(url, { method: 'GET', headers: headers(true) })
    if (!r.ok) throw new Error(await r.text())
    return r.json()
  }

  return {
    getTags,
    renameTag,
    getExpertsByTagId,
    detachTagFromExpert,
    attachTagToExpert,
    deleteTag,
    searchExperts,
    createTag
  }
}
