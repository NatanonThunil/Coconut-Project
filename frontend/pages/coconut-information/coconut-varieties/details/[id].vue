<template>
  <Navbar selecto="coconutdata" />
  <div style="height: 8rem"></div>

  <div class="faqs-path">
    <NuxtLinkLocale to="/coconut-information/">{{ $t('CoconutInfo') }}</NuxtLinkLocale>/
    <NuxtLinkLocale to="/coconut-information/coconut-varieties">{{ $t('Coconut-varieties') }}</NuxtLinkLocale>/
    <NuxtLinkLocale  v-if="coconut" :to="'/coconut-information/coconut-varieties/details/' + route.params.id">
 <div>
      {{ currentLocale === 'th' ? (coconut?.name_th || '-') : (coconut?.name_eng || '-') }}
    </div>
</NuxtLinkLocale>


  </div>

  <div style="height: 1rem"></div>

  <div v-if="coconut" class="coconut-detail-container">
    <div class="row-top">
      <div class="coconut-detail-img">
        <img :src="coconut?.image || 'https://via.placeholder.com/1280x720'" alt="Coconut Image" />
      </div>
      <div class="coconut-detail-info">
        <h2>{{ coconut?.name_th || '-' }}</h2>
        <p><strong>ชื่ออังกฤษ :</strong> {{ coconut?.name_eng || '-' }}</p>
        <p><strong>ประเภท :</strong>
          {{ coconut?.youngold === 'Old' ? 'มะพร้าวแก่' : (coconut?.youngold === 'Young' ? 'มะพร้าวอ่อน' : '-') }}
        </p>
        <p><strong>ชื่อวิทยาศาสตร์ :</strong>
          {{ coconut?.sci_name_f || '-' }} {{ coconut?.sci_name_m || '-' }} {{ coconut?.sci_name_l || '-' }}
        </p>
        <p><strong>ถิ่นกำเนิด :</strong></p>
        <p class="origin-desc">{{ coconut?.origin || '-' }}</p>
      </div>
    </div>

    <div class="deta-below">
      <p><strong>ลักษณะเฉพาะ :</strong></p>
      <p class="origin-desc">{{ coconut?.characteristics || '-' }}</p>
    </div>

    <div style="height: 4px;background-color: #4e6d16;width: 80%;margin: 1rem auto;"></div>
    <SeeAllButton text="ดูพันธุ์อื่นๆ" link="/coconut-information/coconut-varieties" />
  </div>

  <div v-else class="loading-container">
    <p>กำลังโหลดข้อมูล...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCoconuts } from '~/composables/useCoconuts';
import { useHead } from '@vueuse/head';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const coconut = ref(null);
const error = ref(null);

const { locale } = useI18n();
const currentLocale = locale; // reactive

const route = useRoute();

onMounted(async () => {
  const cid = parseInt(route.params.id);
  try {
    const data = await useCoconuts().getCoconutById(cid);
    if (data && data.status === 1) {
      coconut.value = data;
      useHead({
        title: `🥥 Coconut - ${data.name_th || 'มะพร้าว'}`,
        meta: [{ name: 'description', content: `ข้อมูลเกี่ยวกับ ${data.name_th || 'มะพร้าว'}.` }]
      });
    } else {
      error.value = "ไม่พบข้อมูลมะพร้าว กรุณาตรวจสอบหมายเลขอีกครั้ง";
    }
  } catch (err) {
    error.value = "ไม่สามารถโหลดข้อมูลมะพร้าวได้ กรุณาลองใหม่อีกครั้ง";
    console.error(err);
  }
});
</script>



<style scoped>
.context-header {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}

.row-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.deta-below {
  padding: 0 15rem;
}

.deta-below p {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.coconut-detail-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  width: 80%;
  margin: auto;
}

.coconut-detail-img {
  background-color: black;
  width: 25rem;
  height: 25rem;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.coconut-detail-img img {
  height: 100%;
  object-fit: cover;
}

.coconut-detail-info {
  max-width: 1000px;
  font-size: 1rem;
  line-height: 1.5;
}

.coconut-detail-info h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.coconut-detail-info p {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

p.origin-desc {
  width: 100%;
  font-size: 1.2rem;
  max-height: 10rem;
  margin-bottom: 0.5rem;
  text-overflow: ellipsis;
  overflow: hidden;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.5rem;
}

@media (max-width: 900px) {
  .coconut-detail-container {
    width: 95%;
  }
}

@media (max-width: 762px) {
  .row-top {
    flex-direction: column;
    align-items: center;
  }

  .deta-below {
    padding: 0 2rem;
  }
}
</style>