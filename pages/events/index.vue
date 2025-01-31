<template>
  <Navbar selecto="events" />
  <div style="height: 10rem;"></div>
  <h1 class="context-header">{{ $t('Events') }}</h1>
  <div style="height: 5rem;"></div>

  <!-- Search Input -->
  <label class="event-v-input">
    <img src="@/assets/icon/search.svg" alt="search icon">
    <input type="text" placeholder="Search by name..." v-model="searchQuery" @input="filterEvents" />
  </label>

  <!-- Filters -->
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

  <!-- Events -->
  <div v-if="loading" class="all-event-card-container">
    <EventCardShimmer v-for="index in itemsPerPage" :key="index" />
  </div>
  <div v-else-if="paginatedEvents.length === 0" class="no-results">
    <img src="@/assets/icon/notfound.png" draggable="false" alt="No events found">
    {{ $t('No events found') }}
  </div>
  <div v-else class="all-event-card-container">
    <EventCards v-for="event in paginatedEvents" :key="event.id" :url="`/events/details/${event.id}`"
      :image="event.image || 'https://placehold.co/600x400'" :title="event.title || 'No title provided'"
      :datestart="formatDate(event.date_start) || 'No date provided'" :location="event.location_name || 'Unknown'"
      :description="event.description || 'No description available'" />
  </div>

  <!-- Pagination -->
  <div v-if="!loading" class="pagination">
    <button @click="changePage('prev')" :disabled="currentPage === 1">Prev</button>
    <input type="number" v-model.number="pageInput" @change="goToPage" :min="1" :max="totalPages" />
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="changePage('next')" :disabled="currentPage === totalPages">Next</button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      events: [],
      filteredEvents: [],
      searchQuery: '',
      filters: {
        category: {
          label: this.$t('Category'),
          model: '',
          options: [
            { value: 'educate', text: this.$t('Educate') },
            { value: 'conference', text: this.$t('Conference') },
            { value: 'other', text: this.$t('Other') },
          ],
        },
        status: {
          label: this.$t('Status'),
          model: '',
          options: [
            { value: 'upcoming', text: this.$t('Upcoming') },
            { value: 'ongoing', text: this.$t('Ongoing') },
            { value: 'finished', text: this.$t('Finished') },
          ],
        },
        sort: {
          label: this.$t('Sort By'),
          model: 'newest',
          options: [
            { value: 'newest', text: this.$t('Newest') },
            { value: 'oldest', text: this.$t('Oldest') },
          ],
        },
      },
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
      const response = await fetch('/api/events_table');
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

      this.filteredEvents = this.events
        .filter(event => {
          if (this.searchQuery && !event.title?.toLowerCase().includes(this.searchQuery.toLowerCase())) {
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

      this.currentPage = 1; // Reset to first page on filter change
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
    // formatDate(date) {
    //   // Add your date formatting logic here
    //   return new Date(date).toLocaleDateString();
    // },
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

  margin: 1.8rem;
  display: flex;
  justify-self: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 80%;
  min-height: 20rem;
  gap: 1.5rem;
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
</style>