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

    <!-- Members Swiper -->
    <div v-if="!isLoading && filteredMembers.length > 0" class="swiper-container">
      <Swiper
        :slides-per-view="4"
        :space-between="10"
        :slides-per-group="4"
        @swiper="onSwiper"
        :breakpoints="{
          480: { slidesPerView: 1, spaceBetween: 10, slidesPerGroup: 1 },
          768: { slidesPerView: 2, spaceBetween: 10, slidesPerGroup: 2 },
          1024: { slidesPerView: 3, spaceBetween: 10, slidesPerGroup: 3 },
          1524: { slidesPerView: 4, spaceBetween: 10, slidesPerGroup: 4 }
        }"
      >
        <SwiperSlide v-for="(person, index) in filteredMembers" :key="index">
          <AboutusCard
            pp="members"
            :id="person.id"
            :image="getEmployeeImage(person.image)"
            :name="(currentLocale === 'th')? person.name : person.name_en"
            :description="(currentLocale === 'th')? person.description : person.description_en"
            :phone-number="person.phoneNumber"
            :email="person.email"
          />
        </SwiperSlide>
      </Swiper>
    </div>
    <div v-if="!isLoading && filteredMembers.length === 0">
      No members available at the moment.
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
import { useMembers } from "~/composables/useMembers";
import { useI18n } from 'vue-i18n';

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
  },setup() {
    const { locale } = useI18n();
    const currentLocale = computed(() => locale.value);
    return { currentLocale };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    getTitle(item) {
      return this.title && item[this.title] ? item[this.title] : item.name;
    },
    getDescription(item) {
      return this.description && item[this.description]
        ? item[this.description]
        : item.description || "No Position";
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

    async fetchData() {
      this.isLoading = true;
      try {
        const [memRaw] = await Promise.allSettled([
          getMembers(),
        ]);

        // Members
        if (memRaw.status === "fulfilled") {
          let members = [];
          const raw = memRaw.value;
          if (Array.isArray(raw)) members = raw;
          else if (raw && Array.isArray(raw.data)) members = raw.data;
          else if (raw && Array.isArray(raw.members)) members = raw.members;
          else if (raw && typeof raw === "object") members = [raw];

          this.members = members.filter(m => m.status === 1);
        }

      } catch (error) {
        console.error("Error fetching employees/members:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  computed: {
    filteredMembers() {
      return this.members.filter(m => m.status === 1);
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
