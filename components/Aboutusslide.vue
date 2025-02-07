<template>
  <div class="employee-slider-container">
    <button @click="goPrev" class="btn-4-swiper"><</button>

    <!-- Loading State -->
    <div class="employee-card-section" v-if="isLoading">
      <div style="display: flex; gap: 2rem; flex-direction: row;">
        <CardShimmer />
        <CardShimmer />
        <CardShimmer />
        <CardShimmer />
      </div>
    </div>

    <div v-if="!isLoading && employees.length > 0" class="swiper-container">
      <Swiper
        :slides-per-view="4"
        :space-between="10"
        ref="mySwiper"
        :slides-per-group="4"
        :pagination="true"
        :breakpoints="{
          480: { slidesPerView: 1, spaceBetween: 10, slidesPerGroup: 1 },
          768: { slidesPerView: 2, spaceBetween: 10, slidesPerGroup: 2 },
          1024: { slidesPerView: 3, spaceBetween: 10, slidesPerGroup: 3 },
          1524: { slidesPerView: 4, spaceBetween: 10, slidesPerGroup: 4 },
        }"
      >
        <SwiperSlide v-for="(employee, index) in employees" :key="index">
          <NuxtLinkLocale :to="`/employees/details/${employee.id}`" class="employee-card">
            <div class="employee-card-image">
              <img :src="employee.image || 'https://placehold.co/600x400'" alt="Employee Image" draggable="false" />
            </div>
            <div class="employee-card-text">
              <p class="employee-title">{{ employee.name }}</p>
              <div class="employee-card-date">
                <img src="@/assets/icon/calenda.svg" alt="Calendar Icon" draggable="false" />
                <p class="employee-date">{{ formatDate(employee.hire_date) }}</p>
              </div>
              <div :class="['employee-card-status', getStatusClass(employee)]">
                <span v-if="getStatusText(employee) === 'Active'">{{ $t("Active") }}</span>
                <span v-else-if="getStatusText(employee) === 'Upcoming'">{{ $t("Upcoming") }}</span>
                <span v-else-if="getStatusText(employee) === 'Retired'">{{ $t("Retired") }}</span>
                <span v-else>{{ $t("Error") }}</span>
              </div>
            </div>
          </NuxtLinkLocale>
        </SwiperSlide>
      </Swiper>
    </div>

    <div v-if="!isLoading && employees.length === 0" class="no-employees">
      No employees available at the moment.
    </div>

    <button @click="goNext" class="btn-4-swiper">></button>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default {
  props:{
    apiEndPoint:{
      type:String,
      required:true,

    },
    
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      employees: [],
      isLoading: true,
    };
  },
  mounted() {
    this.fetchEmployees();
  },
  methods: {
    goPrev() {
      this.$refs.mySwiper.$el.swiper.slidePrev();
    },
    goNext() {
      this.$refs.mySwiper.$el.swiper.slideNext();
    },
    async fetchEmployees() {
      try {
        const response = await fetch(this.apiEndPoint);
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        this.employees = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching employees:", error);
        this.employees = [];
      } finally {
        this.isLoading = false;
      }
    },
    getStatusText(employee) {
      const currentDate = new Date();
      const hireDate = new Date(employee.hire_date);
      const retireDate = new Date(employee.retire_date);

      if (hireDate <= currentDate && retireDate >= currentDate) return "Active";
      if (hireDate > currentDate) return "Upcoming";
      if (retireDate < currentDate) return "Retired";
      return "Error";
    },
    getStatusClass(employee) {
      const currentDate = new Date();
      const hireDate = new Date(employee.hire_date);
      const retireDate = new Date(employee.retire_date);

      if (hireDate <= currentDate && retireDate >= currentDate) return "active";
      if (hireDate > currentDate) return "upcoming";
      if (retireDate < currentDate) return "retired";
      return "error";
    },
  },
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

.employee-card {
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

.employee-card:hover {
  outline: #4E6D16 solid 3px;
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: 1024px) {
  .employee-card {
    flex: 1 1 calc(50% - 1rem);
  }
}
</style>
