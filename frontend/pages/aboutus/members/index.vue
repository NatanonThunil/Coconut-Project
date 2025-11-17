<template>

  <div style="height: 8rem"></div>
 
  <Breadcrumb />
  <h1 class="context-header">{{ $t("All Member") }}</h1>
  <div style="height: 5rem;"></div>
  <frontesearch :placeholder="(currentLocale === 'th') ? 'ค้นหาด้วยชื่อสมาชิก...' : 'Search by member name...'"
    v-model:search="searchQuery" />

  <!-- Loading State -->
  <div v-if="loading" class="coconut-v-cards-container">
    <CardShimmer v-for="index in 30" :key="index" />
  </div>

  <!-- Loaded Content -->
  <div v-else class="coconut-v-cards-container">


    <AboutusCard v-for="coconut in paginatedCoconuts"
      :name="(currentLocale === 'th') ? coconut.name || coconut.name_en : coconut.name_en || coconut.name"
      pp="members" :id="coconut.id"
      :description="(currentLocale === 'th') ? coconut.description : coconut.description_en" :key="coconut.id"
      :image="coconut.image || 'https://via.placeholder.com/1280x720'" :phone-number="coconut.phoneNumber" :email="coconut.email"/> 
  </div>

  <div class="pagination">
    <div class="pagination-line"></div>
    <div class="pagination-controller">
      <button @click="changePage('prev')" :disabled="currentPage === 1">
       {{ (currentLocale === 'th')?  'กลับ' : 'Back'}}
      </button>
      <input type="number" v-model.number="pageInput" @change="goToPage" :min="1" :max="totalPages"
        class="page-input" />
      <span style="display: flex; align-self: center">
         {{ (currentLocale === 'th')?  'จาก' : 'of'}} {{ totalPages }}
      </span>
      <button @click="changePage('next')" :disabled="currentPage === totalPages">
         {{ (currentLocale === 'th')?  'ถัดไป' : 'Next'}} 
      </button>
    </div>
    <div class="pagination-line"></div>
  </div>
  <div style="height: 3rem;"></div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useHead } from "@vueuse/head";
import { useMembers } from "~/composables/useMembers";
import { useI18n } from 'vue-i18n'
const { getMembers } = useMembers();

const coconuts = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(30);
const pageInput = ref(1);
const loading = ref(true);
const { locale } = useI18n()
const currentLocale = computed(() => locale.value)
const fetchMembers = async () => {
  try {
    loading.value = true;
    const raw = await getMembers();

    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.members)
        ? raw.members
        : [];

    if (!list.length) {
      console.warn("No members found or unexpected response format:", raw);
    }

    coconuts.value = list
      .filter((member) => member.status === 1)
      .map((item) => ({
        id: item.id,
        image: item.image,
        name: item.name,
        name_en: item.name_en || item.name,
        email: item.email,
        address: item.address,
        address_en: item.address_en || item.address,
        phoneNumber: item.phoneNumber,
        status: item.status,
        description: item.description,
        description_en: item.description_en || item.description,
      }));
  } catch (error) {
    console.error("Error fetching members:", error);
    coconuts.value = [];
  } finally {
    loading.value = false;
  }
};

const totalPages = computed(() =>
  Math.ceil(coconuts.value.length / itemsPerPage.value)
);

const paginatedCoconuts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return coconuts.value.slice(start, end);
});

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

const goToDetails = (id) => {
  window.location.href = `/aboutus/members/details/${id}`;
};

useHead({
  title: "🥥Coconut - Varieties",
  meta: [
    {
      name: "description",
      content: "Home page for Coconut Knowledge Hub",
    },
  ],
});

onMounted(() => {
  window.scrollTo(0, 0);
  fetchMembers();
});
</script>

<style scoped>
.coconut-v-cards-container {
  height: auto;
  width: 80%;
  display: flex;
  justify-self: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 2rem;
}

/* Pagination */
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