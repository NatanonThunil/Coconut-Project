<template>
  <div class="employee-slider-container">
    <!-- Prev button -->
    <button @click="goPrev" class="btn-4-swiper"> &lt; </button>

    <!-- Loading shimmer -->
    <div class="employee-card-section" v-if="isLoading">
      <div style="display: flex; gap: 2rem; flex-direction: row;">
        <CardShimmer />
        <CardShimmer />
        <CardShimmer />
        <CardShimmer />
      </div>
    </div>

    <!-- Show Swiper if we have employees OR members -->
    <div v-if="!isLoading && allPeople.length > 0" class="swiper-container">
      <Swiper :slides-per-view="4" :space-between="10" :slides-per-group="4" @swiper="onSwiper" :breakpoints="{
        480: { slidesPerView: 1, spaceBetween: 10, slidesPerGroup: 1 },
        768: { slidesPerView: 2, spaceBetween: 10, slidesPerGroup: 2 },
        1024: { slidesPerView: 3, spaceBetween: 10, slidesPerGroup: 3 },
        1524: { slidesPerView: 4, spaceBetween: 10, slidesPerGroup: 4 }
      }">
        <SwiperSlide v-for="(person, index) in allPeople" :key="index">
          <AboutusCard :url="`/aboutus/${lurl}/details/${person.id}`" :image="getEmployeeImage(person.image)"
            :name="getTitle(person)" :description="person.description" />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Fallback when no data at all -->
    <div v-if="!isLoading && allPeople.length === 0" class="no-employees">
      No employees or members available at the moment.
    </div>

    <!-- Next button -->
    <button @click="goNext" class="btn-4-swiper"> &gt; </button>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import noimageHandle from "/img/no-image-handle.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import AboutusCard from "./aboutusCard.vue";
import CardShimmer from "./CardShimmer.vue";
import { useEmployees } from "~/composables/useEmployees";
import { useMembers } from "~/composables/useMembers";

const { getEmployees } = useEmployees();
const { getMembers } = useMembers();

export default {
  props: {
    apiEndPoint: { type: String, required: true },
    title: { type: String },
    lurl: { type: String },
  },
  components: {
    Swiper,
    SwiperSlide,
    AboutusCard,
    CardShimmer,
  },
  data() {
    return {
      employees: [],
      members: [],
      isLoading: true,
      swiperInstance: null,
    };
  },
  mounted() {
    this.fetchEmployees();
    this.fetchMembers();
  },
  methods: {
    getTitle(item) {
      return this.title && item[this.title] ? item[this.title] : item.name;
    },
    getEmployeeImage(image) {
      return image || noimageHandle;
    },
    goPrev() {
      if (this.swiperInstance) this.swiperInstance.slidePrev();
    },
    goNext() {
      if (this.swiperInstance) this.swiperInstance.slideNext();
    },
    onSwiper(swiper) {
      this.swiperInstance = swiper;
    },

    async fetchEmployees() {
      try {
        this.isLoading = true;
        const raw = await getEmployees();

        let employees = [];

        // Case 1: Direct array
        if (Array.isArray(raw)) {
          employees = raw;
        }
        // Case 2: API wraps data in { data: [...] }
        else if (raw && Array.isArray(raw.data)) {
          employees = raw.data;
        }
        // Case 3: API wraps in { employees: [...] }
        else if (raw && Array.isArray(raw.employees)) {
          employees = raw.employees;
        }
        // Case 4: Already single object (wrap into array)
        else if (raw && typeof raw === "object") {
          employees = [raw];
        }

        this.employees = employees
          .filter(emp => emp.status === 1)
          .sort((a, b) => b.id - a.id);

      } catch (error) {
        console.error("Error fetching employees:", error);
        this.employees = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMembers() {
      try {
        const raw = await getMembers();

        let members = [];
        if (Array.isArray(raw)) members = raw;
        else if (raw && Array.isArray(raw.data)) members = raw.data;
        else if (raw && Array.isArray(raw.members)) members = raw.members;
        else if (raw && typeof raw === "object") members = [raw];

        this.members = members
          .filter(mem => mem.status === 1)
          .sort((a, b) => b.id - a.id);

      } catch (error) {
        console.error("Error fetching members:", error);
        this.members = [];
      }
    },
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter(emp => emp.status === 1);
    },
    filteredMembers() {
      return this.members.filter(mem => mem.status === 1);
    },
    allPeople() {
      // Merge employees + members together
      return [...this.filteredEmployees, ...this.filteredMembers];
    }
  }
};
</script>

<style scoped>
.swiper {
  width: 100%;
}

.swiper-wrapper {
  justify-content: center !important;
}

.btn-4-swiper {
  all: unset;
  cursor: pointer;
  color: #4E6D16;
  text-align: center;
  width: 4rem;
  font-size: 3rem;
  text-shadow: white 0px 0px 8px;
  transition: 0.3s ease-in-out;
}

.btn-4-swiper:hover {
  border-radius: 10px;
  background-color: #e0e0e0;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
}

.employee-slider-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.swiper-container {
  display: flex;
  justify-self: center;
  padding: 1rem;
  background-color: #f5f5f5;
  width: 80%;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.swiper-slide:hover {
  transform: scale(1.02);
  transition: all 0.3s ease;
}

.no-employees {
  display: flex;
  justify-content: center;
  margin: 10rem;
}
</style>
