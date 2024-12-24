<template>
  <div>
    <ul class="homeeventfiltercontainer">
      <li class="filtli train" :class="{ selecto: selectedFilter === 'educate' }" @click="selectedFilter = 'educate'">
        อบรม
      </li>
      <li class="filtli conference" :class="{ selecto: selectedFilter === 'conference' }"
        @click="selectedFilter = 'conference'">
        ประชุมวิชาการ
      </li>
      <li class="filtli other" :class="{ selecto: selectedFilter === 'other' }" @click="selectedFilter = 'other'">
        อื่นๆ
      </li>
    </ul>

    <div  class="event-card-section" loading="lazy">
      <p v-if="filteredEvents.length === 0"><CardShimmer /><CardShimmer /><CardShimmer /><CardShimmer /></p>
      <div v-for="(event, index) in filteredEvents" :key="index"
        :class="['event-card', `${event.event_category}-card`]">
        <nuxt-link :to="`/event/detail/${event.id}`">
          <img :src="event.image" alt="" draggable="false" />
          <div class="event-card-text">
            <p class="event-title">{{ event.title }}</p>
            <div class="event-card-date">
              <img src="@/assets/icon/calenda.svg" alt="" draggable="false" />
              <p class="event-date">{{ formatDate(event.date_start) }}</p>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFilter: 'educate',
      events: [],
    };
  },
  computed: {
    filteredEvents() {
      if (!this.events || this.events.length === 0) return [];
      return this.events.filter(event => event.event_category === this.selectedFilter).slice(0, 4);
    },
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await fetch('/api/events_table');
        const data = await response.json();
        this.events = data;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    },
  },
};
</script>

<style scoped>
ul.homeeventfiltercontainer {
  margin: 2rem;
  list-style: none;
  display: flex;
  justify-self: center;
  justify-content: space-evenly;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
  outline: solid rgba(0, 0, 0, 0.2) 4px;
  background-color: transparent;
  height: 3.5rem;
  width: 50%;
  overflow: hidden;
  border-radius: 20px;
}

ul.homeeventfiltercontainer li.filtli {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  height: 100%;
  width: 33.33%;
  transition: all 0.3s ease;
  font-size: 25px;
}

ul.homeeventfiltercontainer li.filtli.selecto {
  font-weight: bolder;
  font-size: 28px;
  background-color: #c5d944;
  transform: scale(1.1);
}

.event-card-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  overflow: hidden;
  animation: fadeinbelow 1s;
}

.event-card {
  overflow: hidden;
  min-width: 16rem;
  flex: 1 1 calc(25% - 1rem);
  max-width: 22rem;
  height: 22rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  background-color: white;
  transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.event-card img {
  width: 100%;
  height: 12rem;
  object-fit: cover;
  transition: all 0.3s ease;
}

.event-card-text {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 50%;
}

.event-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.event-card-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-card-date img {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: cover;
}

.event-date {
  font-size: 0.875rem;
  color: #777;
}

@media screen and (max-width: 1024px) {
  .event-card {
    flex: 1 1 calc(50% - 1rem);
  }

  .event-card-text {
    height: 50%;
  }
}

@media screen and (max-width: 1123px) {
  .event-card-section {
    justify-self: center;
    width: 75%;
  }
}

@media screen and (max-width: 768px) {
  .event-card {
    flex: 1 1 calc(50% - 1rem);
  }

  .event-card-text {
    height: 50%;
  }
}

@media screen and (max-width: 480px) {
  .event-card {
    flex: 1 1 100%;
  }

  .event-card-text {
    height: 10%;
  }
}

@keyframes fadeinbelow {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
