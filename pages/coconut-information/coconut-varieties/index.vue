<template>
  <Navbar selecto="coconutdata" />
  <div style="height: 8rem"></div>
  <div class="faqs-path">
    <NuxtLinkLocale to="/coconut-varieties">{{ $t('Coconut-varieties') }}</NuxtLinkLocale>
  </div>
  <h1 class="context-header">{{ $t("CoconutInfo") }}</h1>
  <div style="height: 5rem"></div>

  <!-- Search Input -->
  <label class="coconut-v-input">
    <img src="/icon/search.svg" alt="search icon" />
    <input
      type="text"
      placeholder="Search by name..."
      v-model="searchQuery"
      @input="filterCoconuts"
    />
  </label>

  <!-- Filters -->
  <div class="all-filter-container">
    <label class="filter-dropdown" v-for="(filter, key) in filters" :key="key">
      <select
        v-model="filter.model"
        class="filter-select"
        @change="filterCoconuts"
      >
        <option value="">{{ filter.label }}</option>
        <option
          v-for="option in filter.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
    </label>
  </div>

  <!-- Loading State -->
  <div v-if="loading" class="all-event-card-container">
    <CardShimmer v-for="index in 30" :key="index" />
  </div>

  <!-- Loaded Content -->
  <div v-else-if="filteredCoconuts.length === 0" class="no-results">
    <img src="/icon/notfound.png" draggable="false" alt="No coconuts found" />
    {{ $t("No coconuts found") }}
  </div>

  <div v-else class="all-event-card-container">
    <NuxtLinkLocale
      v-for="(coconut, index) in paginatedCoconuts"
      :key="coconut.id"
      :to="`/coconut-information/coconut-varieties/details/${coconut.id}`"
    >
      <div class="coconut-card">
        <img :src="coconut.image || defaultImage" alt="Coconut Image" />
        <div class="card-content">
          <h2>
            {{ currentLocale === 'th' ? coconut.name_th : (coconut.name_eng || coconut.name_th) }}
          </h2>
          <p>{{ coconut.sci_name_f || 'วิทย์ 1' }}</p>
          <p>{{ coconut.sci_name_m || 'วิทย์ 2' }}</p>
          <p>{{ coconut.sci_name_l || 'วิทย์ 3' }}</p>
        </div>
      </div>
    </NuxtLinkLocale>
  </div>

  <!-- Pagination -->
  <div v-if="!loading" class="pagination">
    <button @click="changePage('prev')" :disabled="currentPage === 1">
      Prev
    </button>
    <input
      type="number"
      v-model.number="pageInput"
      @change="goToPage"
      :min="1"
      :max="totalPages"
    />
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="changePage('next')" :disabled="currentPage === totalPages">
      Next
    </button>
  </div>
</template>

<script>
import { useHead } from '@vueuse/head';
import { useI18n } from 'vue-i18n';
export default {
  data() {
    return {
      coconuts: [],
      filteredCoconuts: [],
      searchQuery: '',
      loading: true,
      defaultImage: 'https://placehold.co/600x400',
      // Added a sample filter for demonstration
      filters: {
        variety: {
          label: this.$t("Category"),
          model: "",
          options: [
            { value: "young", text: this.$t("Young-coconut") },
            { value: "mature", text: this.$t("Old-coconut") },
          ],
        },
      },
      currentPage: 1,
      itemsPerPage: 30,
      pageInput: 1,
    };
  },
  computed: {
    currentLocale() {
      const { locale } = useI18n();
      return locale.value;
    },
    totalPages() {
      return Math.ceil(this.filteredCoconuts.length / this.itemsPerPage);
    },
    paginatedCoconuts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredCoconuts.slice(start, start + this.itemsPerPage);
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
        const response = await fetch('/api/coconut', {
          headers: {
            CKH: '541986Cocon',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        // Filter out inactive coconuts as before
        this.coconuts = data.filter(coconut => coconut.status);
        this.filteredCoconuts = [...this.coconuts];
        this.loading = false;
      }, 200);
    } catch (error) {
      console.error('Error fetching coconuts:', error);
    }
  },
  methods: {
    filterCoconuts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredCoconuts = this.coconuts.filter((coconut) => {
        const nameMatch =
          (coconut.name_th && coconut.name_th.toLowerCase().includes(query)) ||
          (coconut.name_eng && coconut.name_eng.toLowerCase().includes(query));
        
        // Apply the variety filter if one is selected (assumes coconut.variety exists)
        const varietyMatch =
          !this.filters.variety.model ||
          (coconut.variety && coconut.variety === this.filters.variety.model);
        
        return nameMatch && varietyMatch;
      });
      this.currentPage = 1;
    },
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
  },
  setup() {
    useHead({
      title: '🥥Coconut - Varieties',
      meta: [
        {
          name: 'description',
          content: 'Coconut Varieties page for Coconut Knowledge Hub',
        },
      ],
    });
  },
};
</script>

<style scoped>
.all-filter-container {
  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
}

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

.faqs-path {
  margin: 1rem 0;
  text-align: center;
}

.faqs-path a {
  color: gray;
  text-decoration: none;
  margin-left: 5rem; 
}


.context-header {
  display: flex;
  justify-self: center;
  text-align: center;
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

.all-event-card-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin: 2rem;
  justify-items: center;
}

.coconut-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  animation: fadeIn 0.5s ease-in-out;
}

.coconut-card:hover {
  transform: scale(1.05);
}

.coconut-card img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.card-content {
  padding: 1rem;
  text-align: center;
}

.card-content h2 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.card-content p {
  font-size: 1rem;
  color: gray;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 662px) {
  .coconut-v-cards-container {
    width: 90%;
  }
}
</style>
