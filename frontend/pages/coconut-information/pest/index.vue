<template>
  <Navbar selecto="pests" />
  <div style="height: 8rem"></div>
  <div class="faqs-path">
    <NuxtLinkLocale to="/coconut-information/">{{ $t('CoconutInfo') }}</NuxtLinkLocale>/
    <NuxtLinkLocale to="/pests">{{ $t('Pest') }}</NuxtLinkLocale>
  </div>
  <h1 class="context-header">{{ $t("Pest") }}</h1>
  <div style="height: 5rem"></div>

  <!-- Search Input -->
  <label class="coconut-v-input">
    <img src="/icon/search.svg" alt="search icon" />
    <input
      type="text"
      placeholder="Search by name..."
      v-model="searchQuery"
      @input="filterPests"
    />
  </label>

  <!-- Filters -->
  <div class="all-filter-container">
    <label class="filter-dropdown" v-for="(filter, key) in filters" :key="key">
      <select
        v-model="filter.model"
        class="filter-select"
        @change="filterPests"
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
  <div v-else-if="filteredPests.length === 0" class="no-results">
    <img
      class="no-result-image"
      src="/icon/notfound.png"
      draggable="false"
      alt="No pests found"
    />
    {{ $t("No pests found") }}
  </div>
  <div v-else class="all-event-card-container">
    <NuxtLinkLocale
      v-for="(pest, index) in paginatedPests"
      :key="pest.id"
      :to="`/coconut-information/pest/details/${pest.id}`"
    >
      <!-- ✅ PestCard inline -->
      <div class="pest-card">
        <img :src="pest.image || defaultImage" alt="pest image" />
        <div class="card-content">
          <h3>
            {{ currentLocale === "th" ? pest.name : pest.name_en }}
          </h3>
          <p>{{ pest.sci_name || 'No description available' }}</p>
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
import { useHead } from "@vueuse/head";
import { useI18n } from "vue-i18n";
import { usePests } from "@/composables/usePests";

const { getPests } = usePests();

export default {
  data() {
    return {
      pests: [],
      filteredPests: [],
      searchQuery: "",
      loading: true,
      defaultImage: "https://placehold.co/600x400",
      filters: {
        category: {
          label: this.$t("Category"),
          model: "",
          options: [
            { value: "0", text: this.$t("Young-coconut") },
            { value: "1", text: this.$t("Old-coconut") },
          ],
        },
        type: {
          label: this.$t("All"),
          model: "",
          options: [
            { value: "0", text: this.$t("Pest") },
            { value: "1", text: this.$t("Weed") },
            { value: "2", text: this.$t("Disease") },
            { value: "3", text: this.$t("Insect") },
            { value: "4", text: this.$t("Other enemies") },
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
      return Math.ceil(this.filteredPests.length / this.itemsPerPage);
    },
    paginatedPests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredPests.slice(start, start + this.itemsPerPage);
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    try {
      const data = await getPests();
      this.pests = Array.isArray(data) ? data : [];
      this.filteredPests = this.pests;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching pests:", error);
      this.pests = [];
      this.filteredPests = [];
      this.loading = false;
    }
  },
  methods: {
    filterPests() {
      const query = this.searchQuery.toLowerCase();
      this.filteredPests = this.pests.filter((pest) => {
        const nameTh = (pest.name || "").toLowerCase();
        const nameEng = (pest.name_en || "").toLowerCase();
        const matchesQuery = nameTh.includes(query) || nameEng.includes(query);
        const matchesCategory =
          this.filters.category.model === "" ||
          pest.category?.toString() === this.filters.category.model;
        const matchesType =
          this.filters.type.model === "" ||
          pest.type?.toString() === this.filters.type.model;

        return matchesQuery && matchesCategory && matchesType;
      });
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
      title: "🥥Coconut - Pest Information",
      meta: [
        {
          name: "description",
          content: "Pest Information page for Coconut Knowledge Hub",
        },
      ],
    });
  },
};
</script>

<style scoped>
/* ===== Filters ===== */
.all-filter-container {
  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
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

/* ===== Search Box ===== */
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

/* ===== Cards Container (เหมือน coconut) ===== */
.all-event-card-container {
  height: auto;
  width: 80%;
  display: flex;
  justify-self: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 2rem;
}

/* ===== PestCard เท่ากับ CoconutCard ===== */
.pest-card {
  height: 18rem;
  width: 15rem;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}
.pest-card:hover {
  transform: scale(1.05);
}
.pest-card img {
  width: 100%;
  height: 60%;
  object-fit: cover;
}
.pest-card .card-content {
  padding: 0.5rem;
  text-align: center;
}

/* ===== Loading Shimmer ===== */
.CardShimmer {
  height: 18rem;
  width: 15rem;
  border-radius: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer-effect 1.5s infinite;
}
@keyframes shimmer-effect {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ===== Pagination ===== */
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

/* ===== Responsive ===== */
@media (max-width: 662px) {
  .all-event-card-container {
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
