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

    <!-- Services Swiper -->
    <div v-if="!isLoading && filteredServices.length > 0" class="swiper-container">
      <Swiper :slides-per-view="4" :space-between="10" :slides-per-group="4" @swiper="onSwiper" :breakpoints="{
        480: { slidesPerView: 1, spaceBetween: 10, slidesPerGroup: 1 },
        768: { slidesPerView: 2, spaceBetween: 10, slidesPerGroup: 2 },
        1024: { slidesPerView: 3, spaceBetween: 10, slidesPerGroup: 3 },
        1524: { slidesPerView: 4, spaceBetween: 10, slidesPerGroup: 4 }
      }">
        <SwiperSlide v-for="(service, index) in filteredServices" :key="index">
          <AboutusCard :url="`/aboutus/${lurl}/details/${service.id}`" :image="getServiceImage(service.image)"
            :name="getTitle(service)" :description="service.description" />
        </SwiperSlide>
      </Swiper>
    </div>

    <div v-if="!isLoading && filteredServices.length === 0">
      No services available at the moment.
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
import { useServices } from "~/composables/useServices";

const { getServices } = useServices(); // ✅ fixed function name

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
      services: [],
      isLoading: true,
      swiperInstance: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    getTitle(item) {
      return this.title && item[this.title] ? item[this.title] : item.name;
    },
    getServiceImage(image) {
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

    async fetchData() {
      this.isLoading = true;
      try {
        const [svcRaw] = await Promise.allSettled([getServices()]);

        if (svcRaw.status === "fulfilled") {
          let services = [];
          const raw = svcRaw.value;

          if (Array.isArray(raw)) services = raw;
          else if (raw && Array.isArray(raw.data)) services = raw.data;
          else if (raw && Array.isArray(raw.services)) services = raw.services;
          else if (raw && typeof raw === "object") services = [raw];

          this.services = services.filter(s => s.status === 1);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  computed: {
    filteredServices() {
      return this.services.filter(s => s.status === 1);
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
</style>
