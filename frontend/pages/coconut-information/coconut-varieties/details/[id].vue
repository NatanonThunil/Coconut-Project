<template>
  <Navbar selecto="pest" />
  <div class="all-container">
    <div style="height: 10rem;"></div>

    <div v-if="!pest && !error" class="loading">
      <p>กำลังโหลดข้อมูลศัตรูพืช...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div class="pest-container" v-if="pest">
      <div class="pest-content">
        <img :src="pest?.image || tlImage" class="pest-image" alt="Pest Image" draggable="false">

        <div class="pest-details">
          <h1 class="pest-name">{{ pest?.name }}</h1>

          <div class="info">
            <p><strong>ที่อยู่:</strong> {{ pest?.address || 'N/A' }}</p>
            <p><strong>ติดต่อ:</strong> {{ pest?.gmail || 'N/A' }}</p>
            <p>Facebook | Twitter</p>
          </div>

          <p class="description">
            <strong>คำอธิบาย:</strong> {{ pest?.description || 'ไม่มีคำอธิบาย' }}
          </p>
        </div>
      </div>
      <div style="height: 5rem;"></div>

      <div class="back-btn-container">
        <SeeAllButton text="ดูศัตรูพืชอื่น ๆ" link="/pest" />
      </div>
    </div>
  </div>
</template>

<script>
import { useHead } from "@vueuse/head";
import tlImage from "/img/tl.png";

export default {
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
      const response = await fetch(`/api/pests/`, {
        headers: {
          CKH: '541986Cocon',
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch pest details: ${response.statusText}`);
      const data = await response.json();
      this.pest = data.find((pest) => pest.id === parseInt(cid) && pest.status === 1) || null;

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
.back-btn-container {
  width: 30%;
}

.pest-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.pest-content {
  display: flex;
  gap: 2rem;
  align-items: center;
  max-width: 900px;
}

.pest-image {
  width: 300px;
  border-radius: 10px;
  border: 2px solid #4E6D16;
  aspect-ratio: 2.5/3;
  object-fit: cover;
}

.pest-details {
  font-size: 1.2rem;
  color: #333;
}

.pest-name {
  font-size: 2rem;
  font-weight: bold;
  color: #4E6D16;
}

.tags {
  margin-top: 1rem;
}

.tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin: 0.3rem;
  border: 1px solid #4E6D16;
  border-radius: 20px;
  font-weight: bold;
  background-color: #E9F5DC;
  color: #4E6D16;
}

.description {
  margin-top: 1.5rem;
  font-size: 1.1rem;
}

.back-button {
  margin-top: 2rem;
  padding: 0.8rem 2rem;
  border: 2px solid #4E6D16;
  background: transparent;
  color: #4E6D16;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s ease;
}

.back-button:hover {
  background: #4E6D16;
  color: white;
}
</style>