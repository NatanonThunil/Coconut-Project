<template>
    <Navbar selecto="events" />
    <div style="height: 10rem;"></div>
    <h1 class="context-header">{{ $t('Events') }}</h1>
    <div style="height: 5rem;"></div>
  
    <label class="event-v-input">
      <img src="@/assets/icon/search.svg" alt="search icon">
      <input type="text" placeholder="ค้นหาด้วยชื่อ..." v-model="searchQuery" />
    </label>
  
    <div class="all-filter-container">
      <div class="filters-container">
        <label class="filter-dropdown">
          <select v-model="selectedSort" class="filter-select">
            <option value="newest">{{ $t('Newest') }}</option>
            <option value="oldest">{{ $t('Oldest') }}</option>
          </select>
        </label>
      </div>
  
      <div class="filters-container">
        <label class="filter-dropdown">
          <select v-model="selectedStatus" class="filter-select">
            <option value="">{{ $t('All') }}</option>
            <option value="upcoming">{{ $t('Upcoming') }}</option>
            <option value="ongoing">{{ $t('Ongoing') }}</option>
            <option value="finished">{{ $t('Finished') }}</option>
          </select>
        </label>
      </div>
    </div>
  
    <div v-if="loading" class="all-event-card-container">
      <EventCardShimmer v-for="index in 30" :key="index"/>
    </div>
    <div v-else>
      <div v-if="filteredEvents.length === 0" class="no-results"><img src="@/assets/icon/notfound.png" draggable="false">{{ $t('No events found') }}</div>
      <div v-else class="all-event-card-container">
        <EventCards v-for="event in filteredEvents" :key="event.id" 
          :url="`/events/details/${event.id}`"
          :image="event.image || 'https://placehold.co/600x400'"
          :title="event.title || 'No title provided'"
          :datestart="event.date_start ? formatDate(event.date_start) : 'No date provided'"
          :location="event.location_name || 'Unknown'"
          :description="event.description || 'No description available'" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        events: [],
        searchQuery: '',
        selectedSort: 'newest',
        selectedStatus: '',
        loading: true,
      };
    },
    async mounted() {
      window.scrollTo(0, 0);
      try {
        const response = await fetch("/api/events_table");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        this.events = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching events:", error);
        this.events = [];
      } finally {
        this.loading = false;
      }
    },
    computed: {
      filteredEvents() {
        let events = [...this.events];
        const now = new Date();
  
        if (this.searchQuery) {
          events = events.filter(event => 
            event.title?.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }
  
        if (this.selectedStatus === 'ongoing') {
          events = events.filter(event => new Date(event.date_start) <= now && new Date(event.date_end) >= now);
        } else if (this.selectedStatus === 'upcoming') {
          events = events.filter(event => new Date(event.date_start) > now);
        } else if (this.selectedStatus === 'finished') {
          events = events.filter(event => event.date_end && new Date(event.date_end) < now);
        }
  
        if (this.selectedSort === 'oldest') {
          events.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
        } else {
          events.sort((a, b) => new Date(b.date_start) - new Date(a.date_start));
        }
  
        return events;
      },
    },
    setup() {
      useHead({
        title: '🥥Coconut - Events',
        meta: [
          { name: 'description', content: 'Home page for Coconut Knowledge Hub' },
        ],
      });
    },
  };
  </script>
  
  <style scoped>
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
  .no-results img{
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
  