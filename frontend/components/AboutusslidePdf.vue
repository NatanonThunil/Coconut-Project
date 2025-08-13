<template>
  <div class="employee-slider-container">
    <button @click="goPrev" class="btn-4-swiper"><</button>

        <!-- Shimmer Effect While Loading -->
        <div class="employee-card-section" v-if="isLoading">
          <div style="display: flex; gap: 2rem; flex-direction: row;">
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
          </div>
        </div>

        <!-- Employee Slider with PDF Rendering -->
        <div v-if="!isLoading && employees.length > 0" class="swiper-container">
          <Swiper :slides-per-view="4" :space-between="10" ref="mySwiper" :slides-per-group="4" :breakpoints="{
            480: { slidesPerView: 1, spaceBetween: 10, slidesPerGroup: 1 },
            768: { slidesPerView: 2, spaceBetween: 10, slidesPerGroup: 2 },
            1024: { slidesPerView: 3, spaceBetween: 10, slidesPerGroup: 3 },
            1524: { slidesPerView: 4, spaceBetween: 10, slidesPerGroup: 4 },
          }">
            <SwiperSlide v-for="(employee, index) in filteredEmployees" :key="index">
              <aboutusCardPdf :url="`/aboutus/${lurl}/details/${employee.id}`"
                :image="employee.pdfImage || noimageHandle" :name="getTitle(employee)"
                :description="employee.description" :ispdf="!!employee.pdf" />
            </SwiperSlide>
          </Swiper>
        </div>

        <!-- No Employees Message -->
        <div v-if="!isLoading && employees.length === 0" class="no-employees">
          No Achievements available at the moment.
        </div>

        <button @click="goNext" class="btn-4-swiper">></button>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import noimageHandle from '/img/no-image-handle.png';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import aboutusCardPdf from "./aboutusCardPdf.vue";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
/// import composables 'Achievements' ตรงนี้
import { useAchievements } from '~/composables/useAchievements';
const { getAchievements } = useAchievements();
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  props: {
    apiEndPoint: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    lurl: {
      type: String,
    },
  },
  components: {
    Swiper,
    SwiperSlide,
    aboutusCardPdf,
  },
  data() {
    return {
      employees: [],
      isLoading: true,
       noimageHandle,
    };
  },
  mounted() {
    this.fetchEmployees();
  },
  methods: {
    async renderPdfToImage(pdfUrl) {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        return canvas.toDataURL();
      } catch (error) {
        console.error("Error rendering PDF:", error);
        return null;
      }
    },

    async getPdfImage(employee) {
      if (employee.pdf) {
        return await this.renderPdfToImage(employee.pdf);
      }
      return null;
    },

   async fetchEmployees() {
  try {
    const raw = await getAchievements();
    
    if (Array.isArray(raw)) {
      this.employees = raw.filter(emp => emp.status === 1);
      this.employees.sort((a, b) => b.id - a.id);

      this.employees = await Promise.all(
        this.employees.map(async (employee) => {
          if (employee.pdf) {
            employee.pdfImage = await this.getPdfImage(employee);
          }
          return employee;
        })
      );
    } else {
      console.warn("Unexpected structure, got:", raw);
      throw new Error("Unexpected API response structure");
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    this.employees = [];
  } finally {
    this.isLoading = false;
  }
},



    getTitle(employee) {
      return this.title && employee[this.title] ? employee[this.title] : employee.name;
    },

    goPrev() {
      this.$refs.mySwiper.$el.swiper.slidePrev();
    },

    goNext() {
      this.$refs.mySwiper.$el.swiper.slideNext();
    },
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter(emp => emp.status === 1);
    }
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
