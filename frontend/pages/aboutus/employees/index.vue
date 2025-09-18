<template>

  <div style="height: 8rem"></div>
  <div class="faqs-path">
    <NuxtLinkLocale to="/">{{ $t('Home') }}</NuxtLinkLocale>/
    <NuxtLinkLocale to="/aboutus">{{ $t('AboutUs') }}</NuxtLinkLocale>/
    <NuxtLinkLocale to="/aboutus/employees">{{ $t('All Employees') }}</NuxtLinkLocale>
  </div>
  
  <h1 class="context-header">{{ $t("All Employees") }}</h1>
  <div style="height: 5rem;"></div>
  <frontesearch v-model:search="searchQuery" :placeholder="(currentLocale === 'th')? 'ค้นหาด้วยชื่อ...': 'Search by employee name'" />
  <!-- Loading State -->
  <div v-if="loading" class="employee-v-cards-container">
    <CardShimmer v-for="index in 30" :key="index" />
  </div>

  <!-- Loaded Content -->
  <div v-else class="employee-v-cards-container">
    <AboutusCard v-for="employee in paginatedEmployees" :name="(currentLocale === 'th')? employee.name || employee.name_en : employee.name_en || employee.name"
    :description="(currentLocale === 'th')? employee.description || employee.description_en : employee.description_en || employee.description" :key="employee.id" :image="employee.image || 'https://placehold.co/600x400'"
      pp="employees"  :phone-number="employee.phoneNumber" :email="employee.email" :id="employee.id"/>
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
import { useEmployees } from '~/composables/useEmployees'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from "@vueuse/head";

const { getEmployees } = useEmployees()
const employees = ref([])
const searchQuery = ref("")
const currentPage = ref(1)
const itemsPerPage = 30
const pageInput = ref(1)
const loading = ref(true)
const { locale } = useI18n()
const currentLocale = computed(() => locale.value)

const fetchapi = async () => {
  try {
    loading.value = true
    // รับมาเป็น json
    const raw = await getEmployees()

    // แปลงเป็น array
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.employees)
        ? raw.employees
        : []

    if (!list.length) {
      console.warn("No employees found or unexpected response format:", raw)
    }

    // กรองเฉพาะที่ status === 1
    employees.value = list
      .filter(employee => employee.status === 1)
      .map(item => ({
        id: item.id,
        image: item.image,
        name: item.name,
        name_en: item.name_en || item.name,
        address: item.address,
        address_en: item.address_en || item.address,
        phoneNumber: item.phoneNumber,
        status: item.status,
        description: item.description,
        description_en: item.description_en || item.description,
        email: item.email,
      }))
  } catch (error) {
    console.error("Error fetching employees:", error)
    employees.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchapi)

const filteredEmployees = computed(() => {
  const query = searchQuery.value?.toString().trim().toLowerCase() || ""
  return employees.value
    .filter(employee => employee.status)
    .filter(employee =>
    (employee.name?.toLowerCase().includes(query) ||
      employee.name_en?.toLowerCase().includes(query))
    )
    .sort((a, b) => b.id - a.id)
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEmployees.value.length / itemsPerPage))
)

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredEmployees.value.slice(start, start + itemsPerPage)
})

function changePage(direction) {
  if (direction === "next" && currentPage.value < totalPages.value) {
    currentPage.value++
  } else if (direction === "prev" && currentPage.value > 1) {
    currentPage.value--
  }
}

function goToPage() {
  if (pageInput.value >= 1 && pageInput.value <= totalPages.value) {
    currentPage.value = pageInput.value
  } else {
    pageInput.value = currentPage.value
  }
}

function goToDetails(id) {
  window.location.href = `/aboutus/employees/details/${id}`
}

useHead({
  title: "🥥Employee - Varieties",
  meta: [
    {
      name: "description",
      content: "Home page for Employee Knowledge Hub",
    },
  ],
})
</script>

<style scoped>
.employee-v-cards-container {
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
