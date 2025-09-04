<template>
  <Navbar selecto="aboutus" />
  <div class="all-container">
    <div style="height: 8rem"></div>

    <div class="faqs-path">
      <NuxtLinkLocale to="/aboutus">{{ $t('AboutUs') }}</NuxtLinkLocale>/
      <NuxtLinkLocale to="/aboutus/benefitandservice">{{ $t('Benefit and service') }}</NuxtLinkLocale>/
      <!-- ✅ safe crumb: no 'this' in template + guard when benefit not loaded -->
      <NuxtLinkLocale :to="`/aboutus/benefitandservice/${$route.params.id}`">
        {{ crumbTitle }}
      </NuxtLinkLocale>
    </div>

    <div style="height: 1rem"></div>

    <!-- Loader -->
    <div v-if="loading && !error" class="loading">
      <p>กำลังโหลดข้อมูลของสิทธิประโยชน์และการบริการทั้งหมด...</p>
    </div>

    <!-- Error -->
    <div v-if="!loading && error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Benefit Profile Section -->
    <div class="benefit-container" v-if="!loading && benefit">
      <div class="benefit-content">
        <img :src="benefit.image || tlImage" class="benefit-image" alt="Benefit Image" draggable="false" />

        <div class="benefit-details">
          <h1 class="benefit-name">{{ displayTitle }}</h1>

          <!-- Optional info block: add fields later if needed -->

          <!-- Optional tags -->
          <div class="tags" v-if="Array.isArray(benefit_tags) && benefit_tags.length">
            <p><strong>แท็ก:</strong></p>
            <div>
              <span v-for="(tag, index) in benefit_tags" :key="index" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <p class="description" v-if="displayDescription">
            <strong>คำอธิบาย:</strong>
           <p v-html=" displayDescription "></p>
          </p>
        </div>
      </div>

      <div style="height: 5rem"></div>

      <div class="back-btn-container">
        <SeeAllButton text="ดูสิทธิประโยชน์และการบริการอื่นๆ" link="/aboutus/benefitandservice" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useServices } from '~/composables/useServices';
import { useHead } from '@vueuse/head';
import tlImage from '/img/tl.png';
import { useI18n } from 'vue-i18n';

const { getServiceById } = useServices();

export default {
  data() {
    return {
      benefit: null,
      benefit_tags: [],
      error: null,
      loading: true,
      tlImage,
    };
  },

  // ✅ use i18n inside setup and expose to template/computed via 'this.currentLocale'
  setup() {
    const { locale } = useI18n();
    const currentLocale = computed(() => locale.value);
    return { currentLocale };
  },

  computed: {
    // ✅ breadcrumb-safe title (guards while loading)
    crumbTitle() {
      if (!this.benefit) return '';
      const th = this.benefit.title || this.benefit.title_en || '';
      const en = this.benefit.title_en || this.benefit.title || '';
      return this.currentLocale === 'th' ? th : en;
    },

    // Prefer Thai first; fallback to English
    displayTitle() {
      return this.benefit?.title || this.benefit?.title_en || 'Benefit';
    },

    // Prefer Thai first; fallback to English
    displayDescription() {
      return this.benefit?.description || this.benefit?.description_en || '';
    },
  },

  async mounted() {
    window.scrollTo(0, 0);
    const cid = Number(this.$route.params.id);
    if (!cid) {
      this.error = 'รหัสไม่ถูกต้อง';
      this.loading = false;
      return;
    }

    try {
      const row = await getServiceById(cid); // returns one service
      if (!row || Number(row.status) !== 1) {
        this.error = 'ไม่พบข้อมูลสิทธิประโยชน์หรือยังไม่เปิดเผย';
        this.loading = false;
        return;
      }

      // Optional JSON tags
      if (typeof row.benefit_tags_id === 'string') {
        try {
          this.benefit_tags = JSON.parse(row.benefit_tags_id);
        } catch (e) {
          console.warn('Cannot parse benefit_tags_id:', e);
          this.benefit_tags = [];
        }
      }

      this.benefit = row;
      this.updateHead();
    } catch (e) {
      console.error(e);
      this.error = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
    } finally {
      this.loading = false;
    }
  },

  methods: {
    updateHead() {
      useHead({
        title: `🥥 Benefit - ${this.displayTitle}`,
        meta: [
          {
            name: 'description',
            content: this.displayDescription
              ? this.displayDescription.slice(0, 160)
              : `ข้อมูลเกี่ยวกับ ${this.displayTitle}`,
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
.back-btn-container { width: 30%; }
.benefit-container { display: flex; flex-direction: column; align-items: center; padding: 2rem; }
.benefit-content { display: flex; gap: 2rem; align-items: center; max-width: 900px; }
.benefit-image { width: 300px; border-radius: 10px; border: 2px solid #4e6d16; aspect-ratio: 2.5/3; object-fit: cover; }
.benefit-details { font-size: 1.2rem; color: #333; }
.benefit-name { font-size: 2rem; font-weight: bold; color: #4e6d16; }
.tags .tag { display: inline-block; background: #eef6e3; color: #4e6d16; padding: .2rem .5rem; border-radius: .4rem; margin-right: .4rem; margin-bottom: .4rem; }
.loading, .error { text-align: center; }
</style>
