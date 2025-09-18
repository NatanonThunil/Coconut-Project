<template>
  <div class="employee-details-container">
    <div style="height: 8rem"></div>

    <div class="faqs-path">
      <NuxtLinkLocale to="/">{{ $t('Home') }}</NuxtLinkLocale> /
      <!-- คงลิงก์ /employees ไว้เพื่อไม่ให้ route พัง แต่ UI/คลาสเปลี่ยนเป็น employee แล้ว -->
      <NuxtLinkLocale to="/employees">{{ $t('employee') }}</NuxtLinkLocale> /
      <NuxtLinkLocale :to="'/employees/details/' + $route.params.id">
        {{ (currentLocale == 'th') ? (employee?.name || employee?.name_en) : (employee?.name_en || employee?.name) }}
      </NuxtLinkLocale>
    </div>

    <div class="all-container">
      <div style="height: 1rem"></div>

      <!-- Loader -->
      <div v-if="!employee && !error" class="loading">
        <p>กำลังโหลดข้อมูลพนักงาน...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <!-- Employee Profile Section -->
      <div class="employee-container" v-if="employee">
        <div class="employee-content">
          <img :src="employee?.image || tlImage" class="employee-image" alt="Employee Image" draggable="false" />

          <div class="employee-details">
            <h1 class="employee-name">
              {{ (currentLocale == 'th') ? (employee?.name || employee?.name_en) : (employee?.name_en || employee?.name) }}
            </h1>

            <p class="employee-description">
              {{ (currentLocale == 'th') ? (employee?.description || employee?.description_en) : (employee?.description_en || employee?.description) }}
            </p>

            <div style="height: 5px; width: 100%; background-color: #4e6d16; border-radius: 10px; margin: 1rem 0;"></div>

            <div class="info">
              <span class="info-header">
                <img src="/icon/email.png" alt="">
                <p>{{ $t("contact-info") }}</p>
              </span>

              <div class="info-prop-detail">
                <img src="/icon/email.png" alt="">
                <p>{{ employee?.email }}</p>
              </div>

              <div class="info-prop-detail">
                <img src="/icon/phonecall.png" alt="">
                <p>{{ employee?.phoneNumber }}</p>
              </div>

              <div class="info-prop-detail">
                <img src="/icon/location-pin.png" alt="">
                <p>{{ (currentLocale == 'th') ? (employee?.address || employee?.address_en) : (employee?.address_en || employee?.address) }}</p>
              </div>
            </div>

            <!-- 🔥 ลบส่วนแท็กทิ้งทั้งหมดตามคำขอ -->
          </div>
        </div>

        <div class="back-btn-container">
          <!-- คงลิงก์ /employees เพื่อไม่ให้ route พัง (ถ้ามีเพจ /employees แล้ว ค่อยเปลี่ยนเป็น /employees ได้) -->
          <SeeAllButton :text="$t('seeanotheremployees')" link="/aboutus/employees" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useHead } from "@vueuse/head";
import tlImage from "/img/tl.png";
import { useEmployees } from '~/composables/useEmployees'; // ใช้แหล่งข้อมูลเดิม แต่ตัวแปรในหน้าเปลี่ยนเป็น employee
import { useI18n } from 'vue-i18n';

const { getEmployeeById } = useEmployees();

export default {
  setup() {
    const { locale } = useI18n();
    const currentLocale = computed(() => locale.value);
    return { currentLocale };
  },
  data() {
    return {
      employee: null,   // เดิม employee -> employee
      error: null,
      tlImage,
    };
  },
  async mounted() {
    const rawId = this.$route.params.id;
    const id = Number(rawId);
    if (!Number.isFinite(id)) {
      this.error = "รหัสพนักงานไม่ถูกต้อง";
      return;
    }

    try {
      const data = await getEmployeeById(id);
      if (!data) {
        this.error = "ไม่พบข้อมูลพนักงาน กรุณาตรวจสอบหมายเลขอีกครั้ง";
        return;
      }

      if (data.status === 0 || data.status === false) {
        this.error = "หน้านี้ยังไม่พร้อมแสดง (ยังไม่เผยแพร่)";
        return;
      }

      // 🔥 ลบทุกอย่างที่เกี่ยวกับ tags ออก (ไม่ดึง ไม่ normalize ไม่ render)
      this.employee = { ...data };
      this.updateHead();
    } catch (e) {
      console.error(e);
      this.error = "ไม่สามารถโหลดข้อมูลพนักงานได้ กรุณาลองใหม่อีกครั้ง";
    }
  },
  methods: {
    updateHead() {
      if (!this.employee) return;
      useHead({
        title: `👤 Employee - ${this.employee.name || this.employee.name_en || ''}`,
        meta: [{ name: "description", content: `ข้อมูลเกี่ยวกับ ${this.employee.name || "พนักงาน"}.` }],
      });
    },
  },
};
</script>

<style scoped>
.info-prop-detail {
  padding-left: 0.5rem;
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

.info-header p { font-weight: bolder; align-items: center; }

.info-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0rem;
}

.info-header img { height: 2rem; width: 2rem; }

.employee-details-container { min-height: 100dvh; }

.back-btn-container {
  max-width: 1000px;
  min-width: 350px;
  width: 100%;
}

.employee-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.employee-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  width: 40%;
  max-width: 600px;
  min-width: 350px;
}

.employee-image {
  width: 300px;
  border-radius: 10px;
  border: 2px solid #4e6d16;
  aspect-ratio: 1;
  object-fit: cover;
}

.employee-details {
  width: 100%;
  font-size: 1.2rem;
  color: #333;
}

.employee-details .employee-description {
  display: flex;
  justify-content: center;
  color: #4e6d16;
  font-weight: bold;
}

.employee-name {
  display: flex;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.description { margin-top: 1.5rem; font-size: 1.1rem; }

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

.back-button:hover { background: #4e6d16; color: white; }
</style>
