<template>
  <Navbar selecto="aboutus" />
  <page-header head="All Employees" />
  <frontesearch v-model:search="searchQuery" placeh="ค้นหาด้วยชื่อ..."/>
  <!-- Loading State -->
  <div v-if="loading" class="employee-v-cards-container">
    <CardShimmer v-for="index in 30" :key="index" />
  </div>

  <!-- Loaded Content -->
  <div v-else class="employee-v-cards-container">
    <AboutusCard
      v-for="employee in paginatedEmployees"
      :name="employee.name || 'ชื่อไทย'"
      :description="employee.description"
      :key="employee.id"
      :image="employee.image || 'https://placehold.co/600x400'"
      :url='`aboutus/employees/details/${employee.id}`'
      @click="goToDetails(employee.id)"
    />
  </div>

  <div class="pagination">
    <div class="pagination-line"></div>
    <div class="pagination-controller">
      <button @click="changePage('prev')" :disabled="currentPage === 1">
        กลับ
      </button>
      <input
        type="number"
        v-model.number="pageInput"
        @change="goToPage"
        :min="1"
        :max="totalPages"
        class="page-input"
      />
      <span style="display: flex; align-self: center">
        จาก {{ totalPages }}
      </span>
      <button
        @click="changePage('next')"
        :disabled="currentPage === totalPages"
      >
        ถัดไป
      </button>
    </div>
    <div class="pagination-line"></div>
  </div>
</template>

<script>
import { useHead } from "@vueuse/head";
export default {
  data() {
    return {
      searchQuery: "",
      employees: [],
      currentPage: 1,
      itemsPerPage: 30,
      pageInput: 1,
      loading: true,
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredEmployees.length / this.itemsPerPage));
    },
    filteredEmployees() {
      const query = this.searchQuery?.toString().trim().toLowerCase() || ""; 
      return this.employees.filter(employee =>
        employee.name?.toLowerCase().includes(query)
      );
    },
  paginatedEmployees() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredEmployees.slice(start, start + this.itemsPerPage);
    }
  },

  watch: {
    currentPage(newPage) {
      this.pageInput = newPage;
    },
    searchQuery() {
      this.currentPage = 1; 
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    try {
      setTimeout(async () => {
        const response = await fetch("/api/employees_table");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        this.employees = data;
        this.loading = false;
      }, 200);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  },
  methods: {
    changePage(direction) {
      if (direction === "next" && this.currentPage < this.totalPages) {
        this.currentPage++;
      } else if (direction === "prev" && this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToPage() {
      if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
        this.currentPage = this.pageInput;
      } else {
        this.pageInput = this.currentPage;
      }
    },
    goToDetails(id) {
      this.$router.push(`/aboutus/employees/details/${id}`);
    },
  },
  setup() {
    useHead({
      title: "🥥Employee - Varieties",
      meta: [
        {
          name: "description",
          content: "Home page for Employee Knowledge Hub",
        },
      ],
    });
  },
};
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
