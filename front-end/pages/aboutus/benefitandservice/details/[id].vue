<template>
    <Navbar selecto="aboutus" />
    <div class="all-container">
      <div style="height: 10rem"></div>
  
      <!-- Loader -->
      <div v-if="!benefit && !error" class="loading">
        <p>กำลังโหลดข้อมูลของสิทธิประโยชน์และการบริการทั้งหมด...</p>
      </div>
  
      <!-- Error -->
      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>
  
      <!-- Benefit Profile Section -->
      <div class="benefit-container" v-if="benefit">
        <div class="benefit-content">
          <img
            :src="benefit?.image || tlImage"
            class="benefit-image"
            alt="Benefit Image"
            draggable="false"
          />
  
          <div class="benefit-details">
            <h1 class="benefit-name">{{ benefit?.name }}</h1>
  
            <div class="info">
              <p><strong>ที่อยู่:</strong> {{ benefit?.address || "N/A" }}</p>
              <p><strong>ติดต่อ:</strong> {{ benefit?.gmail || "N/A" }}</p>
              <p>Facebook | Twitter</p>
            </div>
  
            <div class="tags">
              <p><strong>แท็ก:</strong></p>
              <div v-if="benefit?.benefit_tags_id && benefit.benefit_tags_id.length">
                <span
                  v-for="(tag, index) in benefit.benefit_tags_id"
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
              <p v-else>ไม่มีแท็ก</p>
            </div>
  
            <p class="description">
              <strong>คำอธิบาย:</strong>
              {{ benefit?.description || "ไม่มีคำอธิบาย" }}
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
  import { useHead } from "@vueuse/head";
  import tlImage from "@/assets/img/tl.png";
  
  export default {
    data() {
      return {
        benefit: null,
        error: null,
        tlImage,
      };
    },
    async mounted() {
      const cid = this.$route.params.id;
      try {
        const response = await fetch(`/api/benefits_table`);
        if (!response.ok)
          throw new Error(
            `Failed to fetch benefit details: ${response.statusText}`
          );
        const data = await response.json();
        this.benefit =
          data.find((benefit) => benefit.id === parseInt(cid) && benefit.status) ||
          null;
  
        // Ensure benefit tags are properly formatted
        if (this.benefit && typeof this.benefit.benefit_tags_id === "string") {
          try {
            this.benefit.benefit_tags_id = JSON.parse(this.benefit.benefit_tags_id);
          } catch (error) {
            console.error("Error parsing benefit_tags_id in frontend:", error);
            this.benefit.benefit_tags_id = [];
          }
        }
  
        if (this.benefit) {
          this.updateHead();
        } else {
          this.error = "ไม่พบข้อมูลคณะทำงาน กรุณาตรวจสอบหมายเลขอีกครั้ง";
        }
      } catch (error) {
        this.error = "ไม่สามารถโหลดข้อมูลคณะทำงานได้ กรุณาลองใหม่อีกครั้ง";
      }
    },
    methods: {
      updateHead() {
        if (this.benefit) {
          useHead({
            title: `🥥 Benefit - ${this.benefit.name}`,
            meta: [
              {
                name: "description",
                content: `ข้อมูลเกี่ยวกับ ${this.benefit.name || "คณะทำงาน"}.`,
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
  
  .benefit-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }
  
  .benefit-content {
    display: flex;
    gap: 2rem;
    align-items: center;
    max-width: 900px;
  }
  
  .benefit-image {
    width: 300px;
    border-radius: 10px;
    border: 2px solid #4e6d16;
    aspect-ratio: 2.5/3;
    object-fit: cover;
  }
  
  .benefit-details {
    font-size: 1.2rem;
    color: #333;
  }
  
  .benefit-name {
    font-size: 2rem;
    font-weight: bold;
    color: #4e6d16;
  }
  </style>
