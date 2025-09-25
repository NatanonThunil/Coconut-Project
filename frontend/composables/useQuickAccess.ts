// ~/composables/useQuickAccess.ts
export function useQuickAccess() {
  const base = useRuntimeConfig().public.beUrl;

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const track = async (meta: { key: string; title?: string; link?: string; icon?: string }) => {
    try {
      await $fetch('/quick-access/track', {
        baseURL: base,
        method: 'POST',
        body: meta,
        headers: getAuthHeader(),   // ✅ เพิ่มตรงนี้
      });
    } catch (e) {
      console.error('[QuickAccess] track failed', e);
    }
  };

  const fetchTop = async (limit = 4) => {
    try {
      const res = await $fetch<{ items: Array<any> }>('/quick-access/top', {
        baseURL: base,
        query: { limit },
        headers: getAuthHeader(),   // ✅ เพิ่มตรงนี้
      });
      return res.items ?? [];
    } catch (e) {
      console.error('[QuickAccess] fetchTop failed', e);
      return [];
    }
  };

  return { track, fetchTop };
}
