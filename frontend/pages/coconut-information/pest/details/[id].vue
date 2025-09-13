<template>
  <div>

    <div class="all-container">
      <div style="height: 8rem"></div>
      <!-- Breadcrumb -->
      <div class="pest-path">
        <NuxtLinkLocale to="/">Home</NuxtLinkLocale>/
        <NuxtLinkLocale to="/coconut-information/">{{ $t('CoconutInfo') }}</NuxtLinkLocale>/
        <NuxtLinkLocale to="/pest">{{ $t("Pest") }}</NuxtLinkLocale> /
        <NuxtLinkLocale :to="'/pest/details/' + $route.params.id">
          {{
            currentLocale === "th"
              ? pest?.name || "No Name"
              : pest?.name_en || "No Name"
          }}
        </NuxtLinkLocale>
      </div>

      <!-- Loader -->
      <div v-if="!pest && !error" class="loading">
        <p>กำลังโหลดข้อมูลศัตรูพืช...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <!-- Pest Profile Card -->
      <div class="pest-container" v-if="pest">
        <div class="pest-card">
          <img
            :src="pest?.image || tlImage"
            class="pest-image"
            alt="Pest Image"
            draggable="false"
          />
          <div class="pest-details">
            <h1 class="pest-name">{{ pest?.name }}</h1>
            <div class="info">
              <p><strong>ชื่ออังกฤษ:</strong> {{ pest?.name_en || "N/A" }}</p>
              <p>
                <strong>ชื่อวิทยาศาสตร์:</strong> {{ pest?.sci_name || "N/A" }}
              </p>
              <p>
                <strong>ลักษณะและวงจรชีวิต:</strong>
                {{ pest?.lifecycle || "N/A" }}
              </p>
              <SeeAllButton text="ดูศัตรูพืชอื่น ๆ" link="/coconut-information/pest" />
            </div>
          </div>
        </div>
       
 
       
      </div>
    </div>
  </div>
</template>

<script>
import { useHead } from "@vueuse/head";
import tlImage from "/img/tl.png";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { usePests } from "@/composables/usePests";
const { getPestById } = usePests();
export default {
  setup() {
    const { locale } = useI18n();
    const currentLocale = computed(() => locale.value);
    return {
      currentLocale,
    };
  },
  data() {
    return {
      pest: null,
      error: null,
      tlImage,
    };
  },
  async mounted() {
    const cid = this.$route.params.id; 
    try {
        const data = await getPestById(cid); 
        this.pest = data && data.status === 1 ? data : null; 
        if (this.pest) {
            this.updateHead();
        } else {
            this.error = "ไม่พบข้อมูลศัตรูพืช กรุณาตรวจสอบหมายเลขอีกครั้ง";
        }
    } catch (error) {
        this.error = "ไม่สามารถโหลดข้อมูลศัตรูพืชได้ กรุณาลองใหม่อีกครั้ง";
    }
  },
  methods: {
    updateHead() {
      if (this.pest) {
        useHead({
          title: `🥥 Pest - ${this.pest.name}`,
          meta: [
            {
              name: "description",
              content: `ข้อมูลเกี่ยวกับ ${this.pest.name || "ศัตรูพืช"}.`,
            },
          ],
        });
      }
    },
  },
};
</script>

<style scoped>
.all-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Breadcrumb styling */
.pest-path {
  display: flex;
  align-items: center;
  padding-left: 1rem;
  margin: 1rem 0;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #424141;
}
.pest-path a {
  color: #424141;
  text-decoration: none;
  margin-left: 0.5rem;
}

/* Loader and Error styling */
.loading,
.error {
  text-align: center;
  font-size: 1.2rem;
  color: gray;
  padding: 1rem;
}

/* Pest card container */
.pest-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
}

/* Pest card layout */
.pest-card {
  display: flex;
  gap: 2rem; /* Space between image and text */
  max-width: 100%;
  padding: 1.5rem; /* Increased padding for more space */
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Image styling */
.pest-image {
  width: 350px; /* Increased image size */
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  aspect-ratio: 1/1.14;
}

/* Pest details layout */
.pest-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align text to top */
  width: calc(100% - 350px); /* Adjust width to fit next to image */
}

/* Pest name styling */
.pest-name {
  font-size: 2.2rem; /* Increased font size for the name */
  font-weight: bold;
  color: #4e6d16;
  margin-bottom: 1.5rem; /* Increased margin */
}

/* Info styling */
.info p {
  margin: 1rem 0; /* Increased margin between lines */
}

/* Back button container */
.back-btn-container {
  width: 30%;
  text-align: center;
  margin-top: 3rem; /* Added more spacing */
}
</style>