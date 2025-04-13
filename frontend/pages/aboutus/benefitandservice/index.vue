<template>
    <Navbar selecto="aboutus" />
    <page-header head="Benefit and service" />
  
    <!-- Loading State -->
    <div v-if="loading" class="coconut-v-cards-container">
      <CardShimmer v-for="index in 30" :key="index" />
    </div>
  
    <!-- Loaded Content -->
    <div v-else class="coconut-v-cards-container">
      <!-- <CoconutCards
        v-for="coconut in paginatedCoconuts"
        :key="coconut.id"
        :img="coconut.image || 'https://via.placeholder.com/1280x720'"
        :url="`/coconut-varieties/details/${coconut.id}`"
        :name="coconut.name_th || 'ชื่อไทย'"
        :sci_front="coconut.sci_name_f || 'วิทย์ 1'"
        :sci_middle="coconut.sci_name_m || 'วิทย์ 2'"
        :sci_back="coconut.sci_name_l || 'วิทย์ 3'"
        @click="goToDetails(coconut.id)"
      /> -->
  
      <AboutusCard v-for="coconut in paginatedCoconuts" :name="coconut.name || 'ชื่อไทย'" :description="coconut.description" :key="coconut.id" :image="coconut.image || 'https://via.placeholder.com/1280x720'" :url="`aboutus/employees/details/${coconut.id}`" @click="goToDetails(coconut.id)"/>
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
        coconuts: [],
        currentPage: 1,
        itemsPerPage: 30,
        pageInput: 1,
        loading: true,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.coconuts.length / this.itemsPerPage);
      },
      paginatedCoconuts() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.coconuts.slice(start, end);
      },
    },
    watch: {
      currentPage(newPage) {
        this.pageInput = newPage;
      },
    },
    async mounted() {
      window.scrollTo(0, 0);
      try {
        setTimeout(async () => {
          const response = await fetch("/api/members_table", {
      headers: {
       "CKH": '541986Cocon',
       
      },
    });
          if (!response.ok) throw new Error("Failed to fetch data");
          const data = await response.json();
          this.coconuts = data;
          this.loading = false;
        }, 200);
      } catch (error) {
        console.error("Error fetching coconuts:", error);
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
        title: "🥥Coconut - Varieties",
        meta: [
          {
            name: "description",
            content: "Home page for Coconut Knowledge Hub",
          },
        ],
      });
    },
  };
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
  