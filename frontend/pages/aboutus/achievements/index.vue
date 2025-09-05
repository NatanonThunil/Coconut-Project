<template>
  <Navbar selecto="aboutus" />

  <div style="height: 8rem"></div>
  <div class="faqs-path">
    <NuxtLinkLocale to="/aboutus">{{ $t('AboutUs') }}</NuxtLinkLocale>/
    <NuxtLinkLocale to="/aboutus/achievements">{{ $t('Achievements') }}</NuxtLinkLocale>
  </div>
  <div style="height: 1rem"></div>
  <h1 class="context-header">{{ $t("Achievement") }}</h1>
  <div style="height: 5rem"></div>
  <div style="height: 1rem"></div>
  <frontesearch :placeholder="'ค้นหาด้วยชื่องาน...'" v-model:search="searchQuery" />

  <div class="all-filter-container">
    <label class="filter-dropdown" v-for="(filter, key) in filters" :key="key">
      <select v-model="filter.model" class="filter-select" @change="filterEvents">
        <option value="">{{ filter.label }}</option>
        <option v-for="option in filter.options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </label>
  </div>

  <div style="height: 1rem"></div>

  <!-- Achievements Display -->
  <div class="card-achivments-container">
    <Achievemento
      v-for="achievement in paginatedAchievements"
      :key="achievement.id"
      :picture="achievement.thumbnail || noimageHandle"
      :title="achievement.title"
      :text="achievement.description"
      :url="`/aboutus/achievements/details/${achievement.id}`"
      color="white"
      :author="achievement.author"
    />
  </div>

  <!-- Pagination -->
  <div class="pagination">
    <div class="pagination-line"></div>
    <div class="pagination-controller">
      <button @click="changePage('prev')" :disabled="currentPage === 1">กลับ</button>
      <input
        type="number"
        v-model.number="pageInput"
        @change="goToPage"
        :min="1"
        :max="totalPages"
        class="page-input"
      />
      <span style="display: flex; align-self: center">จาก {{ totalPages }}</span>
      <button @click="changePage('next')" :disabled="currentPage === totalPages">ถัดไป</button>
    </div>
    <div class="pagination-line"></div>
  </div>

  <div style="height: 5rem"></div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
const currentLocale = computed(() => locale.value);

import { ref, onMounted, computed, watch } from 'vue';

// ✅ Use modern pdfjs build and a resolvable worker URL
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
if (process.client) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
}

import noimageHandle from '/img/no-image-handle.png';
import { useAchievements } from '~/composables/useAchievements';
const { getAchievements } = useAchievements();

const Achievements = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const pageInput = ref(1);
const loading = ref(true);

const filters = ref([
  {
    label: 'Sort By',
    model: 'newest',
    options: [
      { value: 'newest', text: 'Newest' },
      { value: 'oldest', text: 'Oldest' },
    ],
  },
]);

// 🔧 helper: accept absolute or relative '/pdfs/...' and make absolute
const toAbsoluteUrl = (u) => {
  if (!process.client || !u) return '';
  try {
    return new URL(u, window.location.origin).href; // handles relative paths
  } catch {
    return '';
  }
};

// 🔧 relaxed check: looks like a PDF path or URL
const isValidPdfUrl = (u) =>
  typeof u === 'string' && /\.pdf(\?|#|$)/i.test(u.trim());

const fetchAchievements = async () => {
  try {
    loading.value = true;

    // fetch raw
    const raw = await getAchievements();

    // normalize list
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.achievements)
        ? raw.achievements
        : [];

    if (!list.length) {
      console.warn("No achievements found or unexpected response format:", raw);
    }

    // only published
    const filteredAchievements = list.filter(ach => ach.status === 1);

    // generate thumbnails (first page) if pdf exists
    await Promise.all(
      filteredAchievements.map(async (achievement) => {
        if (achievement.pdf && isValidPdfUrl(achievement.pdf)) {
          achievement.thumbnail = await generateThumbnail(achievement.pdf);
        } else {
          achievement.thumbnail = noimageHandle;
        }
      })
    );

    Achievements.value = filteredAchievements;
  } catch (e) {
    console.error('Error fetching achievements:', e);
  } finally {
    loading.value = false;
  }
};

const generateThumbnail = async (pdfUrl) => {
  try {
    const absolute = toAbsoluteUrl(pdfUrl);
    if (!absolute) throw new Error('Bad PDF URL');

    const loadingTask = pdfjsLib.getDocument({
      url: absolute,
      withCredentials: false, // set true only if your /pdfs needs cookies
    });

    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const scale = 1.25; // a bit smaller for performance
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D not available');

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    return canvas.toDataURL('image/png');
  } catch (e) {
    console.error(`Error generating thumbnail for PDF: ${pdfUrl}`, e?.message || e);
    return 'https://placehold.co/600x400';
  }
};

// reset page on search
watch(searchQuery, () => { currentPage.value = 1; });

// filtered list by query
const filteredAchievements = computed(() => {
  const query = searchQuery.value?.toString().trim().toLowerCase() || "";
  return Achievements.value.filter(achievement => {
    const matchesTitle = achievement.title?.toLowerCase().includes(query);
    return matchesTitle;
  });
});

// apply sort
const filterEvents = () => {
  const sortBy = filters.value.find(f => f.label === 'Sort By').model;
  let filteredList = [...filteredAchievements.value];

  if (sortBy === 'newest') {
    filteredList.sort((a, b) => b.id - a.id);
  } else if (sortBy === 'oldest') {
    filteredList.sort((a, b) => a.id - b.id);
  }
  return filteredList;
};

// pagination
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filterEvents().length / itemsPerPage.value))
);

const paginatedAchievements = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filterEvents().slice(start, start + itemsPerPage.value);
});

const changePage = (direction) => {
  if (direction === "next" && currentPage.value < totalPages.value) currentPage.value++;
  else if (direction === "prev" && currentPage.value > 1) currentPage.value--;
};

const goToPage = () => {
  if (pageInput.value >= 1 && pageInput.value <= totalPages.value) {
    currentPage.value = pageInput.value;
  } else {
    pageInput.value = currentPage.value;
  }
};

onMounted(fetchAchievements);
</script>

<style scoped>
.filter-dropdown {
  width: 100%;
}
.filter-select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}
.all-filter-container {
  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
}
.card-achivments-container {
  display: flex;
  flex-direction: column;
  width: 80%;
  justify-content: center;
  gap: 1rem;
  margin: 0% 10%;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem;
}
.pagination button {
  padding: 0.5rem 1rem;
  background-color: #4e6d16;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.pagination .page-input {
  width: 3rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.3rem;
}
.pagination .pagination-line {
  width: fit-content;
  min-width: 20%;
  height: 4px;
  background-color: #4e6d16;
}
.pagination-controller {
  justify-content: center;
  display: flex;
  justify-content: space-around;
  width: 20rem;
}
</style>
