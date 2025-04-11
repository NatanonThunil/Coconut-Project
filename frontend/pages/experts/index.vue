<template>
  <div style="height: 10rem;"></div>
  <Navbar selecto="expert" />
  
  <h3 class="header-content">{{ $t('Expert') }}</h3>
  <div class="header-container">
    <h1>{{ $t('Experts') }}</h1>
  </div>

  <!-- Merged navbarexpert content -->
  <div>
    <!-- Filter options -->
    <ul class="homeeventfiltercontainer">
      <li
        class="filtli train"
        :class="{ selecto: selectedFilter === 'farmer' }"
        @click="selectedFilter = 'farmer'"
      >
        {{$t('Farmer')}}
      </li>
      <li
        class="filtli private"
        :class="{ selecto: selectedFilter === 'private' }"
        @click="selectedFilter = 'private'"
      >
        {{$t('Private')}}
      </li>
      <li
        class="filtli academic"
        :class="{ selecto: selectedFilter === 'academic' }"
        @click="selectedFilter = 'academic'"
      >
        {{$t('Academic')}}
      </li>
    </ul>

    <!-- Search bar -->
    <label class="coconut-v-input">
      <img src="@/assets/icon/search.svg" alt="Search Icon" />
      <input
        type="text"
        placeholder="ค้นหาด้วยชื่อ..."
        v-model="searchQuery"
        @input="filterByName"
      />
    </label>
    <div style="height: 2rem"></div>

    <!-- Loading state -->
    <div class="event-card-section" v-if="isLoading" loading="lazy">
      <div style="display: flex; gap: 2rem; flex-direction: row">
        <CardShimmer />
        <CardShimmer />
        <CardShimmer />
        <CardShimmer />
      </div>
    </div>

    <!-- Render expert data -->
    <div class="event-card-section" v-if="!isLoading && filteredExperts.length > 0">
      <NuxtLinkLocale
        v-for="(expert, index) in filteredExperts"
        :key="index"
        class="event-card"
        :to="`/experts/details/${expert.id}`"
      >
        <div class="event-card-image">
          <img :src="expert.image || 'https://placehold.co/600x400'" alt="Expert Image" draggable="false" />
        </div>
        <div class="event-card-text">
          <p class="event-title">{{ expert.name }}</p>
          <div class="event-card-date">
            <img src="@/assets/icon/calenda.svg" alt="Calendar Icon" draggable="false" />
            <p class="event-date">{{ expert.description }}</p>
          </div>
        </div>
      </NuxtLinkLocale>
    </div>

    <!-- No data found -->
    <div class="no-events" v-if="!isLoading && filteredExperts.length === 0">
      <p>No experts found for the selected criteria.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFilter: "farmer",
      experts: [],
      isLoading: true,
      searchQuery: "",
      selectedTag: this.$route.query.tag || null,
    };
  },
  computed: {
    filteredExperts() {
      const query = this.searchQuery.toLowerCase();
      return this.experts
        .filter((expert) =>
          expert.name.toLowerCase().includes(query) || 
          (expert.tags && expert.tags.some(tag => tag.toLowerCase().includes(query)))
        )
        .filter((expert) => expert.category === this.selectedFilter && expert.status)
        .filter((expert) => this.selectedTag ? expert.tags.includes(this.selectedTag) : true);
    },
  },
  watch: {
    '$route.query.tag'(newTag) {
      this.selectedTag = newTag;
    },
  },
  methods: {
    async fetchExperts() {
      try {
        this.isLoading = true;
        const response = await fetch("/api/experts");
        if (!response.ok) throw new Error("Failed to fetch experts");
        const data = await response.json();
        this.experts = data.map((expert) => ({
          ...expert,
          category: this.mapCategory(expert.type),
        }));
      } catch (error) {
        console.error("Error fetching experts:", error);
        this.experts = [];
      } finally {
        this.isLoading = false;
      }
    },
    filterByName() {
      this.filteredExperts;
    },
    mapCategory(type) {
      // Map expert_tags_id to category names
      const categories = {
        1: "farmer",
        2: "private",
        3: "academic",
      };
      return categories[type] || "unknown";
    },
  },
  mounted() {
    this.fetchExperts();
  },
};
</script>

<style scoped>
.navcontainer {
  width: 100%;
  height: 100px;
  border: rgb(255, 255, 255) solid 2px;
}
.header-container {
  border: rgb(255, 255, 255) solid 3px;
  text-align: center;
  margin-top: 0;
  padding-top: 20px;
  font-size: 2rem;
}
.header-content {
  color: #ffffff;
  margin-left: 2%;
  font-weight: 300;
}

/* Merged styles from navbarexpert.vue */
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
.no-events {
  display: flex;
  justify-content: center;
  margin: 10rem;
}

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
  margin: 0% 10%;
  gap: 1rem;
  justify-content: left;
  width: 80%;
  padding: 1rem;
  animation: fadeinbelow 1s;
}

.event-card-status {
  color: black;
  margin-top: 1rem;
  text-align: center;
  border-radius: 10px;
  outline: 2px solid black;
  width: 45%;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.event-card-status.ongoing {
  color: white;
  background-color: #4e6d16;
  margin-top: 1rem;
  text-align: center;
  border-radius: 10px;
  outline: 2px solid #4e6d16;
  width: 45%;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.event-card-status.upcoming {
  color: #6f5d55;
  margin-top: 1rem;
  text-align: center;
  border-radius: 10px;
  outline: 2px solid #6f5d55;
  width: 45%;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.event-card-status.finished {
  color: black;
  background-color: #cccccc;
  margin-top: 1rem;
  text-align: center;
  border-radius: 10px;
  outline: 2px solid black;
  width: 45%;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.event-card-status.error {
  color: red;

  margin-top: 1rem;
  text-align: center;
  border-radius: 10px;
  outline: 2px solid red;
  width: 45%;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.event-card {
  all: unset;
  cursor: pointer;
  overflow: hidden;
  min-width: 16rem;
  flex: 1 1 calc(25% - 1rem);
  max-width: 22rem;
  height: 22rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  background-color: white;
  transition: ease-in-out 0.4s;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  outline: #4e6d16 solid 3px;
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.event-card .event-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: ease-in-out 0.2s;
}

.event-card:hover .event-card-image {
  transform: scale(1.1);
}

.event-card-image {
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.5);
}

.event-card-text {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 40%;
}

.event-title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
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
  width: 1.2rem;
  height: 1.2rem;
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

  ul.homeeventfiltercontainer li.filtli {
    font-size: 20px;
  }

  ul.homeeventfiltercontainer li.filtli.selecto {
    font-size: 25px;
  }
}

@media screen and (max-width: 1123px) {
  .event-card-section {
    justify-self: center;
    width: 75%;
  }

  ul.homeeventfiltercontainer li.filtli {
    font-size: 15px;
  }

  ul.homeeventfiltercontainer li.filtli.selecto {
    font-size: 18px;
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
