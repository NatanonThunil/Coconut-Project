<template>
  <div>
    <Navbar selecto="coconutdata" />
    <div class="all-container">
      <div style="height: 8rem"></div>
      <!-- Breadcrumb -->
      <div class="coconutdata-path">
        <NuxtLinkLocale to="/Coconut-varieties">{{ $t('Coconut-varieties') }}</NuxtLinkLocale> /
        <NuxtLinkLocale :to="'/coconut/details/' + $route.params.id">
          {{
            currentLocale === "th"
              ? coconutdata?.name_th || "No Name"
              : coconutdata?.name_eng || "No Name"
          }}
        </NuxtLinkLocale>
      </div>

      <!-- Loader -->
      <div v-if="!coconutdata && !error" class="loading">
        <p>กำลังโหลดข้อมูลมะพร้าว...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <!-- Coconutdata Profile Card -->
      <div class="coconutdata-container" v-if="coconutdata">
        <div class="coconutdata-card">
          <img :src="coconutdata?.image || tlImage" class="coconutdata-image" alt="Coconut Image" draggable="false">
          <div class="coconutdata-details">
            <h1 class="coconutdata-name">{{ coconutdata?.name_th }}</h1>
            <div class="info">
              <p><strong>ชื่ออังกฤษ:</strong> {{ coconutdata?.name_eng || 'N/A' }}</p>
              <p><strong>ชื่อวิทยาศาสตร์:</strong> {{ coconutdata?.sci_name_f || 'N/A' }}</p>
              <p><strong>ลักษณะเฉพาะ:</strong> {{ coconutdata?.characteristics || 'N/A' }}</p>
            </div>
          </div>
        </div>
        <div style="height: 5rem;"></div>
        <div class="back-btn-container">
          <SeeAllButton text="ดูมะพร้าวอื่น ๆ" link="/coconutdata" />
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
      coconutdata: null,
      error: null,
      tlImage,
    };
  },
  async mounted() {
    const cid = this.$route.params.id; // Get the coconutdata ID from the URL
    try {
      const response = await fetch(`/api/coconut/`, {
        headers: {
          "CKH": '541986Cocon',
        },
      });
      if (!response.ok)
        throw new Error(`Failed to fetch coconutdata details: ${response.statusText}`);
      const data = await response.json();
      this.coconutdata =
        data.find((coconutdata) => coconutdata.id === parseInt(cid) && coconutdata.status === 1) || null;

      if (this.coconutdata) {
        this.updateHead();
      } else {
        this.error = "ไม่พบข้อมูลมะพร้าว กรุณาตรวจสอบหมายเลขอีกครั้ง";
      }
    } catch (error) {
      this.error = "ไม่สามารถโหลดข้อมูลมะพร้าวได้ กรุณาลองใหม่อีกครั้ง";
    }
  },
  methods: {
    updateHead() {
      if (this.coconutdata) {
        useHead({
          title: `🥥 Coconutdata - ${this.coconutdata.name}`,
          meta: [
            {
              name: "description",
              content: `ข้อมูลเกี่ยวกับ ${this.coconutdata.name || "มะพร้าว"}.`,
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
.coconutdata-path {
  display: flex;
  align-items: center;
  padding-left: 1rem;
  margin: 1rem 0;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #424141;
}
.coconutdata-path a {
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

/* Coconutdata card container */
.coconutdata-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
}

/* Coconutdata card layout */
.coconutdata-card {
  display: flex;
  gap: 2rem; /* Space between image and text */
  max-width: 100%;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Image styling */
.coconutdata-image {
  width: 350px; /* Increased image size */
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  aspect-ratio: 1/1.14;
}

/* Coconutdata details layout */
.coconutdata-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align text to top */
  width: calc(100% - 300px); /* Adjust width to fit next to image */
}

/* Coconutdata name styling */
.coconutdata-name {
  font-size: 2rem;
  font-weight: bold;
  color: #4E6D16;
  margin-bottom: 1rem;
}

/* Info styling */
.info p {
  margin: 0.5rem 0;
}

/* Back button container */
.back-btn-container {
  width: 30%;
  text-align: center;
}
</style>
