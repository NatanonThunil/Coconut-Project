<template>
  <div style="height: 8rem"></div>

  <!-- Breadcrumb -->
  <div class="faqs-path">
    <NuxtLinkLocale to="/">{{ $t('Home') }}</NuxtLinkLocale> /
    <NuxtLinkLocale to="/aboutus">{{ $t('AboutUs') }}</NuxtLinkLocale> /
    <NuxtLinkLocale to="/aboutus/benefitandservice">{{ $t('Benefit and service') }}</NuxtLinkLocale> /
    <NuxtLinkLocale :to="`/aboutus/benefitandservice/${$route.params.id}`">
      {{ crumbTitle || '...' }}
    </NuxtLinkLocale>
  </div>

  <div class="benefit-container">
    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <CardShimmer v-for="i in 1" :key="i" />
      <div class="back-button shimmer"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Content -->
    <div v-else class="details-card">
      <div class="chainvalue-container">
        <div v-if="loading" class="loading-container">
          <CardShimmer v-for="index in 1" :key="index" />
          <div class="back-button shimmer"></div>
        </div>
        <img class="news-image-banner" :src="benefit.image || 'https://placehold.co/800x400'" alt="News Image"
          v-else="benefit.image" />

        <h1>{{ (currentLocale == 'th') ? (benefit?.title || 'No Title') : (benefit?.title_en || 'No Title') }}
        </h1>
        <div class="chain_value-content" v-html=" (currentLocale == 'th') ? (benefit?.description || 'No Title') : (benefit?.description_en || 'No Title') ">
         
        </div>
        <SeeAllButton :text="$t('Benefit and service')" link="/aboutus/benefitandservice" />
      </div>

    </div>
  </div>
</template>

<script>
import { useHead } from '@vueuse/head'
import CardShimmer from '@/components/CardShimmer.vue'
import { useServices } from '~/composables/useServices'
import { useI18n } from 'vue-i18n'

const { getServiceById } = useServices()

export default {
  components: { CardShimmer },

  data() {
    return {
      benefit: null,
      error: null,
      loading: true,
      defaultImage: 'https://placehold.co/800x600',
    }
  },

  setup() {
    const { locale } = useI18n()
    return { currentLocale: locale }
  },

  computed: {
    crumbTitle() {
      if (!this.benefit) return ''
      const th = this.benefit.title || this.benefit.title_en || ''
      const en = this.benefit.title_en || this.benefit.title || ''
      return this.currentLocale === 'th' ? th : en
    },
  },

  async mounted() {
    const cid = Number(this.$route.params.id)
    if (!cid) {
      this.error = 'รหัสไม่ถูกต้อง'
      this.loading = false
      return
    }

    try {
      const row = await getServiceById(cid)
      if (!row || Number(row.status) !== 1) {
        this.error = 'ไม่พบข้อมูลสิทธิประโยชน์หรือยังไม่เปิดเผย'
        this.loading = false
        return
      }

      this.benefit = row

      useHead({
        title: `🥥 Benefit - ${this.crumbTitle}`,
        meta: [
          {
            name: 'description',
            content:
              this.benefit.description?.slice(0, 160) ||
              this.benefit.description_en?.slice(0, 160) ||
              `ข้อมูลเกี่ยวกับ ${this.crumbTitle}`,
          },
        ],
      })
    } catch (e) {
      console.error(e)
      this.error = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
    } finally {
      this.loading = false
    }
  },
}
</script>

<style scoped>
/* ✅ Reuse EXACT CSS from Value Chain page */
.benefit-content {
  font-size: 1.5rem;
  max-width: 100dvw;
  overflow: visible;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-word;
}

.benefit-container {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
}

.news-image-banner {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 10px;
}

.details-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.details-card {
  background: #fff;
  border-radius: 20px;
  
  overflow: hidden;
  max-width: 1100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

.image-container {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-width: 300px;
}

.chain-value-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
}

.details-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.summary-container {
  background-color: #f4f8ef;
  padding: 1.2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.summary-container h2 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #2d3a22;
}

.summary-container p {
  font-size: 1rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
  white-space: normal;
}

.title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2d3a22;
}

.meta {
  margin-bottom: 1.5rem;
}

.badge {
  display: inline-block;
  background: #4e6d16;
  color: #fff;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.badge-outline {
  background: transparent;
  border: 1px solid #4e6d16;
  color: #4e6d16;
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.8rem 2rem;
  border: 2px solid #4e6d16;
  background: #fff;
  color: #4e6d16;
  font-size: 1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
}

.back-button:hover {
  background: #4e6d16;
  color: #fff;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .details-card {
    flex-direction: column;
    padding: 1rem;
  }

  .image-container {
    width: 100%;
  }

  .chain-value-image {
    width: 100%;
    max-height: none;
    /* allow taller image */
  }
}
</style>
