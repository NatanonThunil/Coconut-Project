<template>
  <Navbar selecto="aboutus" />

  <div style="height: 8rem"></div>
  <div class="faqs-path">
    <NuxtLinkLocale to="/aboutus">{{ $t('AboutUs') }}</NuxtLinkLocale>/
    <NuxtLinkLocale to="/aboutus/achievements">{{ $t('Achievement') }}</NuxtLinkLocale>
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
    <Achievemento v-for="achievement in paginatedAchievements" :key="achievement.id"
      :picture="achievement.thumbnail || noimageHandle" :title="achievement.title"
      :text="achievement.description" :url="`/aboutus/achievements/details/${achievement.id}`" color="white"
      :author="achievement.author" />
  </div>

  <!-- Pagination -->
  <div class="pagination">
    <div class="pagination-line"></div>
    <div class="pagination-controller">
      <button @click="changePage('prev')" :disabled="currentPage === 1">กลับ</button>
      <input type="number" v-model.number="pageInput" @change="goToPage" :min="1" :max="totalPages"
        class="page-input" />
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
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/build/pdf.worker';
import noimageHandle from '/img/no-image-handle.png';
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


const fetchAchievements = async () => {
  try {
    const response = await fetch('/api/achievements', {
      headers: {
        "CKH": '541986Cocon',
      },
    });
    const { achievements } = await response.json();

    const filteredAchievements = achievements.filter(achievement => achievement.status === 1);

    await Promise.all(filteredAchievements.map(async (achievement) => {
      if (achievement.pdf && isValidPdfUrl(achievement.pdf)) {
        achievement.thumbnail = await generateThumbnail(achievement.pdf);
      }
    }));

    Achievements.value = filteredAchievements;
  } catch (e) {
    console.error('Error fetching achievements:', e);
  } finally {
    loading.value = false;
  }
};

const isValidPdfUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const generateThumbnail = async (pdfUrl) => {
  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    if (!pdf.numPages) throw new Error('Invalid PDF structure');
    const page = await pdf.getPage(1);

    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = { canvasContext: context, viewport };
    await page.render(renderContext).promise;

    return canvas.toDataURL();
  } catch (e) {
    console.error(`Error generating thumbnail for PDF: ${pdfUrl}`, e.message);
    return 'https://placehold.co/600x400';
  }
};

// Watch search query and reset to first page
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Filter achievements based on search query
const filteredAchievements = computed(() => {
  const query = searchQuery.value?.toString().trim().toLowerCase() || "";
  return Achievements.value.filter(achievement => {
    const matchesTitle = achievement.title?.toLowerCase().includes(query);
    return matchesTitle;
  });
});

// Handle the filters applied
const filterEvents = () => {
  const sortBy = filters.value.find(filter => filter.label === 'Sort By').model;

  let filteredList = filteredAchievements.value;

  // Apply sorting based on the selected option
  if (sortBy === 'newest') {
    filteredList = filteredList.sort((a, b) => b.id - a.id); // Higher ID first
  } else if (sortBy === 'oldest') {
    filteredList = filteredList.sort((a, b) => a.id - b.id); // Lower ID first
  }

  return filteredList;
};

// Total number of pages
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filterEvents().length / itemsPerPage.value));
});

// Paginated achievements for the current page
const paginatedAchievements = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filterEvents().slice(start, start + itemsPerPage.value);
});

// Pagination handlers
const changePage = (direction) => {
  if (direction === "next" && currentPage.value < totalPages.value) {
    currentPage.value++;
  } else if (direction === "prev" && currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToPage = () => {
  if (pageInput.value >= 1 && pageInput.value <= totalPages.value) {
    currentPage.value = pageInput.value;
  } else {
    pageInput.value = currentPage.value;
  }
};

// Fetch achievements on mounted
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
