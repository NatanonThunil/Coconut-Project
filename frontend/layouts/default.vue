<template>
  <div>
    <Suspense>
      <!-- SINGLE ROOT for default slot -->
      <template #default>
        <div class="layout-shell">
          <header>
            <Navbar selecto="home" v-model:search="searchQuery" />
          </header>

          <main>
            <!-- Normal content -->
            <div v-if="!isSearching" class="cocon-main-container">
              <slot />
            </div>

            <!-- Search surface -->
            <div v-else class="search-surface">
              <div style="height: 8rem;"></div>

              <div class="search-header">
                <div class="left">
                  <h3>ผลการค้นหา</h3>
                  <p v-if="searchQuery">
                    <span v-if="!searchError && !searchLoading">{{ total }} รายการ</span>
                  </p>
                </div>
              </div>

              <div v-if="searchLoading" class="search-loading">กำลังค้นหา…</div>
              <div v-else-if="searchError" class="search-error">{{ searchError }}</div>
              <div v-else-if="results.length === 0" class="search-empty">ไม่พบผลลัพธ์ที่ตรงกัน</div>

              <ul v-else class="result-list">
                <li v-for="item in results" :key="`${item.type}-${item.id}`" class="result-item">
                  <NuxtLinkLocale :to="item.url" class="result-link" @click="clearSearch">
                    <span class="badge">{{ typeLabel(item.type) }}</span>
                    <div class="result-main">
                      <div class="result-title" v-html="highlight(item.title)"></div>
                      <div class="result-snippet" v-html="highlight(item.snippet)"></div>
                    </div>
                  </NuxtLinkLocale>
                </li>
              </ul>
            </div>
          </main>

          <NewFooter />
        </div>
      </template>

      
      <template #fallback>
        <div class="loading-container">
          <ClientOnly>
            <DotLottieVue
              v-if="lottieLoaded"
              style="height: 300px; width: 300px"
              autoplay
              loop
              :src="loadingAnimation"
            />
            <template #fallback>
              <p style="font-size: 2.5rem;">กรุณารอสักครู่...</p>
            </template>
          </ClientOnly>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
let searchToken = 0

import { ref, computed, watch, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useSearchs, type SearchItem, type SearchType } from '~/composables/useSearchs'

const DotLottieVue = defineAsyncComponent(() =>
  import('@lottiefiles/dotlottie-vue').then(m => m.DotLottieVue)
)

const lottieLoaded = ref(false)
const loadingAnimation = ref('@/assets/load/loading.lottie')

async function preloadLottie() {
  try {
    const lottieUrl = new URL('@/assets/load/loading.lottie', import.meta.url).href
    loadingAnimation.value = lottieUrl
    lottieLoaded.value = true
  } catch (error) {
    console.error('Lottie preload error:', error)
  }
}

const searchQuery = ref('')
const { makeLiveSearcher } = useSearchs()
const live = makeLiveSearcher()

const results = ref<SearchItem[]>([])
const total = ref(0)
const searchLoading = ref(false)
const searchError = ref('')

const isSearching = computed(() => searchQuery.value.trim().length >= 2)

watch(
  () => searchQuery.value,
  async (q) => {
    const term = q.trim()
    searchError.value = ''
    results.value = []
    total.value = 0

    if (term.length < 2) {
      searchLoading.value = false
      return
    }

    searchLoading.value = true
    const token = ++searchToken

    try {
      const { promise } = live.run(term, { limit: 20, statusOnly: true })
      const res = await promise
      if (token !== searchToken) return
      results.value = res.data
      total.value = res.total
    } catch (e: any) {
      if (token !== searchToken) return

      if (isAbortError(e)) {
        await new Promise(r => setTimeout(r, 120))
        try {
          const { promise } = live.run(term, { limit: 20, statusOnly: true })
          const res = await promise
          if (token !== searchToken) return
          results.value = res.data
          total.value = res.total
        } catch (err2: any) {
          if (!isAbortError(err2)) {
            searchError.value = err2?.message || 'Search failed after retry'
          }
        }
      } else {
        searchError.value = e?.message || 'Search failed'
      }
    } finally {
      if (token === searchToken) {
        searchLoading.value = false
      }
    }
  }
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isSearching.value) clearSearch()
}

function clearSearch() {
  searchQuery.value = ''
  results.value = []
  total.value = 0
  searchError.value = ''
}

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  await preloadLottie()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

/* ---------- Highlight helpers ---------- */
function escapeHtml(s: string) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildHighlightRegex(q: string): RegExp | null {
  const raw = q.trim()
  if (!raw) return null
  const tokens = raw.split(/[\s,;|/\\]+/).filter(Boolean).slice(0, 10)
  if (!tokens.length) return null
  const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = tokens.map(esc).join('|')
  try { return new RegExp(`(${pattern})`, 'gi') } catch { return null }
}

const hlRegex = computed(() => buildHighlightRegex(searchQuery.value))

function highlight(text: string) {
  const safe = escapeHtml(text)
  const rx = hlRegex.value
  if (!rx) return safe
  return safe.replace(rx, '<mark>$1</mark>')
}

function isAbortError(e: any) {
  return e?.name === 'AbortError'
      || e?.message?.toLowerCase?.().includes('aborted')
      || e?.code === 20
}

function typeLabel(t: SearchType) {
  switch (t) {
    case 'new': return 'ข่าวสาร'
    case 'coconut': return 'พันธุ์มะพร้าว'
    case 'pest': return 'ศัตรูพืช'
    case 'achievement': return 'ผลงาน'
    case 'chain_values': return 'ห่วงโซ่คุณค่า'
    case 'employee': return 'บุคลากร'
    case 'event': return 'กิจกรรม'
    case 'expert': return 'ผู้เชี่ยวชาญ'
    case 'faq': return 'คำถามที่พบบ่อย'
    case 'member': return 'สมาชิก'
    default: return t
  }
}
</script>



<style scoped>
.search-surface {
  max-width: 1080px;
  margin: 2rem auto;
  padding: 0 1rem 4rem;
}

.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-header .left h3 {
  margin: 0;
}

.clear-btn {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: .4rem .8rem;
  cursor: pointer;
  background: white;
}

.search-loading {
  padding: 1rem 0;
  opacity: .8;
}

.search-error {
  padding: 1rem;
  color: #b91c1c;
  background: #fee2e2;
  border-radius: 12px;
}

.search-empty {
  padding: 1rem 0;
  opacity: .7;
}

.result-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: .5rem;
}

.result-item {
  outline: 1px solid #e5e7eb;
  border-radius: 16px;
  background: white;
  transition: ease-in-out 0.2s;
}

.result-item:hover {
  transform: scale(1.05);
  background: rgba(1, 1, 1, 0.05);
}

.result-link {
  display: flex;
  gap: .75rem;
  padding: .9rem 1rem;
  text-decoration: none;
  color: inherit;
}

.badge {
  flex: 0 0 auto;
  font-size: .75rem;
  line-height: 1;
  padding: .45rem .55rem;
  border-radius: 999px;
  min-width: 5rem;
  text-align: center;
  outline: #4E6D16 solid 2px;
  color: #4E6D16;
  align-self: flex-start;
  transition: all 0.3s ease-in-out;
}

.result-list .result-item:hover .badge {
  background: #4E6D16;
  color: white;
  outline: none;
}
.result-main {
  min-width: 0;
}

.result-title {
  font-weight: 600;
  margin-bottom: .2rem;
}

.result-snippet {
  font-size: .9rem;
  color: #4b5563;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cocon-main-container {
  opacity: 0;
  animation: fadein 0.6s forwards;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8f8f8;
  z-index: 9999;
}

.loading-container p {
  font-size: 1.5rem;
  color: #555;
  animation: bounce 1s infinite ease-in-out;
}

/* Bouncing animation */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes fadein {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

main {
  scroll-behavior: smooth;
}
</style>
