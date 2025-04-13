<template>
  <Navbar selecto="events" />
  <div style="height: 8rem"></div>
    <div class="faqs-path">
      
        <NuxtLinkLocale to="/events">{{ $t('Events') }}</NuxtLinkLocale>
    </div>
  <h1 class="context-header">{{ $t('Events') }}</h1>
  <div style="height: 5rem;"></div>


  <label class="event-v-input">
    <img src="/icon/search.svg" alt="search icon">
    <input type="text" :placeholder="(currentLocale === 'th') ?'ค้นหาด้วยชื่อกิจกรรม...':'Search by Event`s name...' " v-model="searchQuery" @input="filterEvents" />
  </label>


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


  <div class="grid-container">
    <div v-if="loading" class="all-event-card-container">
      <EventCardShimmer v-for="index in itemsPerPage" :key="index" />
    </div>
    <div v-else-if="paginatedEvents.length === 0" class="no-results">
      <img src="/icon/notfound.png" draggable="false" alt="No events found">
      {{ $t('No events found') }}
    </div>
    <div v-else class="all-event-card-container">
      <EventCards v-for="event in paginatedEvents" :key="event.id" :url="`/events/details/${event.id}`"
        :image="event.image || 'https://placehold.co/600x400'" :title="(currentLocale === 'th') ? (event.title || 'No title provided')
          : (event.title_en || 'No English title provided')" :datestart="formatDate(event.date_start) || 'No date provided'"
        :location="(currentLocale === 'th')? (event.location_name || 'Unknown') : (event.location_name_en || 'No English location provided')" :description="(currentLocale === 'th') ? (event.description || 'No description available'):(event.description_en || 'No description available')" />
    </div>
  </div>

  <div class="pagination">
        <div class="pagination-line"></div>
        <div class="pagination-controller">
            <button @click="changePage('prev')" :disabled="currentPage === 1">กลับ</button>
            <input type="number" v-model.number="pageInput" @change="goToPage" :min="1" :max="totalPages"
                class="page-input" />
            <span style="display: flex; align-self: center;">จาก {{ totalPages }}</span>
            <button @click="changePage('next')" :disabled="currentPage === totalPages">ถัดไป</button>
        </div>
        <div class="pagination-line"></div>
    </div>

  
</template>


<script>
import nfi from '/img/News404.png';
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { locale, t } = useI18n();
    const currentLocale = computed(() => locale.value);

    const filters = reactive({
      category: {
        label: computed(() => t('Event_category')),
        model: '',
        options: [
          { value: 'educate', text: computed(() => t('Educate')) },
          { value: 'conference', text: computed(() => t('Conference')) },
          { value: 'other', text: computed(() => t('Other')) },
        ],
      },
      status: {
        label: computed(() => t('Event_status')),
        model: '',
        options: [
          { value: 'upcoming', text: computed(() => t('Upcoming')) },
          { value: 'ongoing', text: computed(() => t('Ongoing')) },
          { value: 'finished', text: computed(() => t('Finished')) },
        ],
      },
      sort: {
        label: computed(() => t('Event_date')),
        model: 'newest',
        options: [
          { value: 'newest', text: computed(() => t('Newest')) },
          { value: 'oldest', text: computed(() => t('Oldest')) },
        ],
      },
    });

    return { currentLocale, filters };
  },
  data() {
    return {
      events: [],
      filteredEvents: [],
      searchQuery: '',
      loading: true,
      currentPage: 1,
      itemsPerPage: 30,
      pageInput: 1,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    },
    paginatedEvents() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredEvents.slice(start, start + this.itemsPerPage);
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    try {
      const response = await fetch('/api/events', {
      headers: {
       "CKH": '541986Cocon',
       
      },
    });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      this.events = Array.isArray(data) ? data.filter(event => event.status === 1) : [];
      this.filterEvents();
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    filterEvents() {
      const now = new Date();
      const { category, status, sort } = this.filters;
      const searchQueryLower = this.searchQuery.toLowerCase();

      this.filteredEvents = this.events
        .filter(event => {
          if (this.searchQuery && !((event.title || "").toLowerCase().includes(searchQueryLower))) {
            return false;
          }

          if (category.model && event.event_category !== category.model) {
            return false;
          }

          if (status.model === 'ongoing' && !(new Date(event.date_start) <= now && new Date(event.date_end) >= now)) {
            return false;
          }
          if (status.model === 'upcoming' && new Date(event.date_start) <= now) {
            return false;
          }
          if (status.model === 'finished' && (!event.date_end || new Date(event.date_end) > now)) {
            return false;
          }
          return true;
        })
        .sort((a, b) => {
          return sort.model === 'oldest'
            ? new Date(a.date_start) - new Date(b.date_start)
            : new Date(b.date_start) - new Date(a.date_start);
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
  },
};
</script>



<style scoped>


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

.no-results {
  text-align: center;
  flex-direction: column;
  font-size: 3rem;
  color: #777;
  min-height: 30rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-results img {
  height: 10rem;
  margin: 2rem;
  opacity: 0.5;
}

.all-filter-container {

  margin-top: 1rem;
  gap: 1rem;
  display: flex;
  justify-content: start;
  justify-self: center;
  width: 60%;
}

.all-event-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 20rem));
  max-width: calc(5 * 20rem + 4 * 15px);
  gap: 15px;
  width: 80%;
  justify-content: center;
  margin: 1rem auto;
}



h1.context-header {
  text-align: center;
}

label.event-v-input {
  transition: ease-in-out 0.5s;
  display: flex;
  justify-self: center;
  width: 60%;
  height: 3rem;
  outline: 3px solid #4e6d16;
  border-radius: 10px;
  overflow: hidden;
}

label.event-v-input:hover {
  outline: 4px solid #4e6d16;
}

label.event-v-input img {
  align-self: center;
  padding-left: 0.5rem;
  width: 10%;
  height: 2rem;
}

label.event-v-input input {
  all: unset;
  padding-left: 1rem;
  width: 90%;
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

@media (max-width: 1024px) {
  .all-event-card-container {
    grid-template-columns: repeat(2, 20rem);
  }
}

/* Mobile View (1-2 Columns) */
@media (max-width: 691px) {
  .all-event-card-container {
    grid-template-columns: repeat(1, 20rem);
  }
}


</style>