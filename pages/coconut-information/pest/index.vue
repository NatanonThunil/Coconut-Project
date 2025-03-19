<template>
  <div style="height: calc(100dvh - 10rem);">
    <Navbar selecto="pest" />

    <h3 class="header-content">{{ $t("pest") }}</h3>
    <div class="header-container">
      <h1>{{ $t("Pest") }}</h1>
    </div>

    <!-- Search Bar (Centered) -->
    <div class="search-container">
      <label class="coconut-v-input">
        <img src="@/assets/icon/search.svg" alt="Search Icon" />
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ..."
          v-model="searchQuery"
        />
      </label>
    </div>

    <!-- Navigation Buttons -->
    <div class="nav-buttons">
      <button>{{ $t("All") }}</button>

      <button>{{ $t("Insect") }}</button>

      <button>{{ $t("Disease") }}</button>

      <button>{{ $t("Weed") }}</button>

      <button>{{ $t("Other enemies") }}</button>
    </div>

    <div style="height: 2rem"></div>

    <!-- Loading state -->
    <div class="event-card-section" v-if="isLoading">
      <div style="display: flex; gap: 2rem; flex-direction: row">
        <CardShimmer />
        <CardShimmer />
        <CardShimmer />
        <CardShimmer />
      </div>
    </div>

    <!-- Render pest data -->
    <div
      class="event-card-section"
      v-if="!isLoading && filteredPests.length > 0"
    >
      <NuxtLink
        v-for="(pest, index) in filteredPests"
        :key="index"
        class="event-card"
        :to="`/coconut-information/pest/details/${pest.id}`"
      >
        <div class="event-card-image">
          <img
            :src="pest.image || 'https://placehold.co/600x400'"
            alt="Pest Image"
            draggable="false"
          />
        </div>
        <div class="event-card-text">
          <p class="event-title">{{ pest.name }}</p>
          <div class="event-card-date">
            <img
              src="@/assets/icon/calenda.svg"
              alt="Calendar Icon"
              draggable="false"
            />
            <p class="event-date">{{ pest.sci_name }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- No data found -->
    <div class="no-events" v-if="!isLoading && filteredPests.length === 0">
      <p>No pests found.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pests: [],
      isLoading: true,
      searchQuery: "",
    };
  },
  computed: {
    filteredPests() {
      return this.pests.filter((pest) =>
        pest.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchPests() {
      try {
        this.isLoading = true;
        const response = await fetch("/api/pests", {
      headers: {
       "CKH": '541986Cocon',
       
      },
    });
        if (!response.ok) throw new Error("Failed to fetch pests");

        const data = await response.json();

        this.pests = data.filter((pest) => pest.status === 1);
      } catch (error) {
        console.error("Error fetching pests:", error);
        this.pests = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchPests();
  },
};
</script>

<style scoped>
/* Centering the search bar */
.search-container {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
}

/* Navigation Buttons */
.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  padding-bottom: 1rem;
}

.nav-buttons a {
  text-decoration: none;
}

.nav-buttons button {
  background-color: #4e6d16;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.3s ease-in-out;
  min-width: 120px;
  text-align: center;
}

.nav-buttons button:hover {
  background-color: #3a5111;
}

/* Search Bar */
label.coconut-v-input {
  transition: ease-in-out 0.5s;
  display: flex;
  justify-content: center;
  width: 60%;
  height: 3rem;
  outline: 3px solid #4e6d16;
  border-radius: 10px;
  overflow: hidden;
  cursor: text;
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

/* No Data Found */
.no-events {
  display: flex;
  justify-content: center;
  margin: 10rem;
}

/* Event Card Section */
.event-card-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  padding: 1rem;
}

/* Event Card */
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
</style>
