<template>
 
     <div style="height: 8rem"></div>
    <div class="faqs-path">
     <NuxtLinkLocale to="/coconut-information/">{{ $t('CoconutInfo') }}</NuxtLinkLocale>/
     <NuxtLinkLocale to="/coconut-information/coconut-varieties">{{ $t('Coconut-varieties') }}</NuxtLinkLocale>
    </div>
    <div style="height: 1rem"></div>
  <h1 class="context-header">{{ $t('CoconutInfo') }}</h1>
  <div style="height: 5rem;"></div>

  <label class="coconut-v-input">
    <img src="/icon/search.svg" />
    <input type="text" placeholder="ค้นหาด้วยชื่อ..." v-model="searchQuery" @input="filterCoconuts" />
  </label>

  <div class="all-filter-container">
    <label class="filter-dropdown">
      <select v-model="filterType" @change="filterCoconuts" class="filter-select">
        <option value="">{{ (currentLocale == 'th')? "ทั้งหมด" : "All"}}</option>
        <option value="Young">{{ (currentLocale == 'th')? "มะพร้าวอ่อน" : "Young Coconut"}}</option>
        <option value="Old">{{ (currentLocale == 'th')? "มะพร้าวแก่" : "Old Coconut"}}</option>
      </select>
    </label>
  </div>

  <!-- Loading State -->
  <div v-if="loading" class="coconut-v-cards-container">
    <CardShimmer v-for="index in 30" :key="index" />
  </div>

  <div v-else class="coconut-v-cards-container">
    <CoconutCards
      v-for="coconut in paginatedCoconuts"
      :key="coconut.id"
      :img="coconut.image || noimageHandle"
      :url="`/coconut-varieties/details/${coconut.id}`"
      :name="coconut.name_th || 'ชื่อไทย'"
      :sci_front="coconut.sci_name_f || 'วิทย์ 1'"
      :sci_middle="coconut.sci_name_m || 'วิทย์ 2'"
      :sci_back="coconut.sci_name_l || 'วิทย์ 3'"
      @click="goToDetails(coconut.id)"
    />
  </div>

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
      <span style="display: flex; align-self: center;">จาก {{ totalPages }}</span>
      <button @click="changePage('next')" :disabled="currentPage === totalPages">ถัดไป</button>
    </div>
    <div class="pagination-line"></div>
  </div>
</template>

<script>
import { useHead } from '@vueuse/head';
import { useCoconuts } from '~/composables/useCoconuts';
import noimageHandle from '/img/no-image-handle.png';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { getCoconuts } = useCoconuts();

export default {
  data() {
    return {
      coconuts: [],
      filteredCoconuts: [],
      searchQuery: '',
      filterType: '',
      currentPage: 1,
      itemsPerPage: 30,
      pageInput: 1,
      loading: true,
    };
  },
  setup() {
    const { locale } = useI18n();
    const currentLocale = computed(() => locale.value);

    useHead({
      title: '🥥Coconut - Varieties',
      meta: [{ name: 'description', content: 'Home page for Coconut Knowledge Hub' }],
    });

    return { currentLocale };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredCoconuts.length / this.itemsPerPage);
    },
    paginatedCoconuts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCoconuts.slice(start, end);
    },
  },
  watch: {
    searchQuery() {
      this.filterCoconuts();
    },
    filterType() {
      this.filterCoconuts();
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    try {
      const data = await getCoconuts();
      const coconutArray = Array.isArray(data) ? data : data.coconuts || [];
      this.coconuts = coconutArray.filter(coconut => coconut.status);
      this.filteredCoconuts = [...this.coconuts];
      this.loading = false;
    } catch (error) {
      console.error('Error fetching coconuts:', error);
    }
  },
  methods: {
    filterCoconuts() {
      const query = this.searchQuery.toLowerCase();

      this.filteredCoconuts = this.coconuts.filter((coconut) => {
        const matchesName =
          (coconut.name_th || '').toLowerCase().includes(query) ||
          (coconut.name_eng || '').toLowerCase().includes(query);

        const matchesType = this.filterType
          ? (coconut.youngold || '').toLowerCase() === this.filterType.toLowerCase()
          : true;

        return matchesName && matchesType;
      });

      this.currentPage = 1;
    },
    changePage(direction) {
      if (direction === 'next' && this.currentPage < this.totalPages) {
        this.currentPage++;
      } else if (direction === 'prev' && this.currentPage > 1) {
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
      this.$router.push(`/coconut-information/coconut-varieties/details/${id}`);
    },
  },
};
</script>



<style scoped>
.filters-container {
  display: flex;
  justify-content: center;
}

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

.filter-select:focus {
  border-color: #4e6d16;
}

.all-filter-container {

  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
}
.context-header {
  display: flex;
  justify-self: center;
}

label.coconut-v-input {
  transition: ease-in-out 0.5s;
  display: flex;
  justify-self: center;
  width: 60%;
  height: 3rem;
  outline: 3px solid #4e6d16;
  border-radius: 10px;
  overflow: hidden;
  cursor: text;
  animation: btnexpand 0.5s ease-in-out forwards;
}

label.coconut-v-input:hover {
  outline: 4px solid #4e6d16;
}

label.coconut-v-input img {
  display: flex;
  align-self: center;
  padding-left: 0.5rem;
  width: 10%;
  height: 2rem;
}

label.coconut-v-input input {
  all: unset;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow: hidden;
  width: 90%;
}

@keyframes shimmer-effect {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

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

.CardShimmer {
  height: 18rem;
  width: 15rem;
  border-radius: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer-effect 1.5s infinite;
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

@media (max-width: 662px) {
  .coconut-v-cards-container {
    width: 90%;
  }
}

@keyframes btnexpand {
  0% {
    opacity: 0;
    width: 20%;
  }

  100% {
    opacity: 1;
    width: 60%;
  }
}
</style>
