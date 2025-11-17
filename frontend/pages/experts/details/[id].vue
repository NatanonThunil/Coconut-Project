<template>
  <div class="expert-details-container">

    <div style="height: 8rem"></div>
   
    <Breadcrumb :last-label="(currentLocale == 'th')? (expert?.name || expert?.name_en) :  (expert?.name_en || expert?.name) "/>
    <div class="all-container">

      <div style="height: 1rem"></div>

      <!-- Loader -->
      <div v-if="!expert && !error" class="loading">
        <p>กำลังโหลดข้อมูลผู้เชี่ยวชาญ...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <!-- Expert Profile Section -->
      <div class="expert-container" v-if="expert">
        <div class="expert-content">
          <img :src="expert?.image || tlImage" class="expert-image" alt="Expert Image" draggable="false" />

          <div class="expert-details">
            <h1 class="expert-name">{{ (currentLocale == 'th')? (expert?.name || expert?.name_en) :  (expert?.name_en || expert?.name) }}</h1>
            <p class="expert-description">{{ (currentLocale == 'th')? (expert?.description || expert?.description_en) :  (expert?.description_en || expert?.description) }}</p>
            <div style="height: 5px ; width: 100%; background-color: #4e6d16; border-radius: 10px; margin: 1rem 0;">
            </div>
            <div class="info">
              <span class="info-header"><img src="/icon/email.png" alt="">
                <p>{{ $t("contact-info") }}</p>
              </span>
              <div class="info-prop-detail"> <img src="/icon/email.png" alt="">
                <p>{{ expert?.email }}</p>
              </div>
              <div class="info-prop-detail"> <img src="/icon/phonecall.png" alt="">
                <p>{{ expert?.phoneNumber }}</p>
              </div>
              <div class="info-prop-detail"> <img src="/icon/location-pin.png" alt="">
                <p>{{(currentLocale == 'th')? (expert?.address || expert?.address_en) :  (expert?.address_en || expert?.address)  }}</p>
              </div>
            </div>

            <div class="tags">
              <p><strong>{{ $t('tags') }} :</strong></p>
              <div v-if="expert?.tags && expert.tags.length">
                <span v-for="(tag, index) in expert.tags" :key="index" class="tag" @click="filterByTag(tag)">
                  {{ tag }}
                </span>
              </div>
              <p v-else>ไม่มีแท็ก</p>
            </div>

            <p class="description">


            </p>
          </div>
        </div>
 

        <div class="back-btn-container">
          <SeeAllButton :text="$t('seeanotherexperts')" link="/experts" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useHead } from "@vueuse/head";
import tlImage from "/img/tl.png";
import { useExperts } from '~/composables/useExperts';
import { useI18n } from 'vue-i18n';
const { getExpertById, getTagsByExpert } = useExperts();

export default {
   setup() {
        const { locale } = useI18n();
        const currentLocale = computed(() => locale.value);
        return { currentLocale };
    },
  data() {
    return {
      expert: null,
      error: null,
      tlImage,
    };
  },
  async mounted() {
    const rawId = this.$route.params.id;
    const id = Number(rawId);
    if (!Number.isFinite(id)) {
      this.error = "รหัสผู้เชี่ยวชาญไม่ถูกต้อง";
      return;
    }

    try {
      const data = await getExpertById(id);
      if (!data) {
        this.error = "ไม่พบข้อมูลผู้เชี่ยวชาญ กรุณาตรวจสอบหมายเลขอีกครั้ง";
        return;
      }


      if (data.status === 0 || data.status === false) {
        this.error = "หน้านี้ยังไม่พร้อมแสดง (ผู้เชี่ยวชาญยังไม่เผยแพร่)";
        return;
      }


      let tags = [];
      try {
        const apiTags = await getTagsByExpert(id);
        if (Array.isArray(apiTags) && apiTags.length) {
          tags = apiTags;
        }
      } catch (_) {

      }

      if (!tags.length) {
        tags = this.normalizeTags(data.tags);
      }


      const seen = new Set();
      tags = tags
        .map(t => String(t || '').trim())
        .filter(t => t && !seen.has(t.toLowerCase()) && (seen.add(t.toLowerCase()) || true));

      this.expert = { ...data, tags };
      this.updateHead();
    } catch (e) {
      console.error(e);
      this.error = "ไม่สามารถโหลดข้อมูลผู้เชี่ยวชาญได้ กรุณาลองใหม่อีกครั้ง";
    }
  },
  methods: {
    normalizeTags(raw) {
      if (Array.isArray(raw)) return raw.map(x => String(x || '').trim()).filter(Boolean);
      if (typeof raw === 'string') {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed.map(x => String(x || '').trim()).filter(Boolean);
        } catch (_) { }
        return String(raw).split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    },
    updateHead() {
      if (!this.expert) return;
      useHead({
        title: `🥥 Expert - ${this.expert.name}`,
        meta: [{ name: "description", content: `ข้อมูลเกี่ยวกับ ${this.expert.name || "ผู้เชี่ยวชาญ"}.` }],
      });
    },

    filterByTag(tag) {
      const value = String(tag || '').trim();
      if (!value) return;


      if (process.client) {
        try { localStorage.setItem('experts:prefill', value); } catch { }
      }


      this.$router.push({ path: "/experts", query: { q: value } });
    },
  },
};
</script>


<style scoped>
.info-prop-detail {
  padding-left:0.5rem ;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin: 0.5rem 0rem;
  opacity: 0.6;
   align-items: center;
}

.info-prop-detail img {
  height: 1.2rem;
  width: 1.2rem;
}

.info-header p {
  font-weight: bolder;
  align-items: center;
}

.info-header {
  display: flex;
  flex-direction: row;
  
   align-items: center;
  gap: 0.5rem;
  margin: 1rem 00rem;
}

.info-header img {
  height: 2rem;
  width: 2rem;
}

.expert-details-container {
  min-height: 100dvh;
}

.back-btn-container {
  max-width: 1000px;
  min-width: 350px;
  width: 100%;
}

.expert-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.expert-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  width: 40%;
  max-width: 600px;
  min-width: 350px;
}

.expert-image {
  width: 300px;
  border-radius: 10px;
  border: 2px solid #4e6d16;
  aspect-ratio: 1;
  object-fit: cover;
}

.expert-details {
  width: 100%;
  font-size: 1.2rem;
  color: #333;
}

.expert-details .expert-description {
    display: flex;
  justify-content: center;
  color: #4e6d16;
  font-weight: bold;
}

.expert-name {
  display: flex;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;


}

.tags {
  margin-top: 1rem;
}

.tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin: 0.3rem;
  border: 1px solid #4e6d16;
  border-radius: 20px;
  font-weight: bold;
  background-color: #e9f5dc;
  color: #4e6d16;
  cursor: pointer;
}

.description {
  
  margin-top: 1.5rem;
  font-size: 1.1rem;
}

.back-button {
  margin-top: 2rem;
  padding: 0.8rem 2rem;
  border: 2px solid #4e6d16;
  background: transparent;
  color: #4e6d16;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s ease;
}

.back-button:hover {
  background: #4e6d16;
  color: white;
}

</style>
