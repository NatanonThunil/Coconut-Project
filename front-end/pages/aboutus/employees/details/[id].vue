<template>
    <Navbar selecto="aboutus" />
    <div class="all-container">
      <div style="height: 10rem"></div>
  
      <!-- Loader -->
      <div v-if="!employees && !error" class="loading">
        <p>กำลังโหลดข้อมูลของคณะทำงานทั้งหมด...</p>
      </div>
  
      <!-- Error -->
      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>
  
      <!-- Employee Profile Section -->
      <div class="employees-container" v-if="employees">
        <div class="employees-content">
          <img
            :src="employees?.image || tlImage"
            class="employees-image"
            alt="Employee Image"
            draggable="false"
          />
  
          <div class="employees-details">
            <h1 class="employees-name">{{ employees?.name }}</h1>
  
            <div class="info">
              <p><strong>ที่อยู่:</strong> {{ employees?.address || "N/A" }}</p>
              <p><strong>ติดต่อ:</strong> {{ employees?.phoneNumber || "N/A" }}</p>
              
            </div>
  
            <div class="tags">
              <p><strong>แท็ก:</strong></p>
              <div v-if="employees?.tags && employees.tags.length">
                <span
                  v-for="(tag, index) in employees.tags"
                  :key="index"
                  class="tag"
                  @click="filterByTag(tag)"
                >
                  {{ tag }}
                </span>
              </div>
              <p v-else>ไม่มีแท็ก</p>
            </div>
  
            <p class="description">
              <strong>คำอธิบาย:</strong>
              {{ employees?.description || "ไม่มีคำอธิบาย" }}
            </p>
          </div>
        </div>
        <div style="height: 5rem"></div>
  
        <div class="back-btn-container">
          <SeeAllButton text="ดูคณะทำงานคนอื่น" link="/employees" />
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
        employees: null,
        error: null,
        tlImage,
      };
    },
    async mounted() {
      const cid = this.$route.params.id;
      try {
        const response = await fetch(`/api/employees/${cid}`);
        if (!response.ok)
          throw new Error(
            `Failed to fetch employee details: ${response.statusText}`
          );
        const data = await response.json();
        this.employees = data || null;
  
        if (this.employees) {
          this.updateHead();
        } else {
          this.error = "ไม่พบข้อมูลพนักงาน กรุณาตรวจสอบหมายเลขอีกครั้ง";
        }
      } catch (error) {
        this.error = "ไม่สามารถโหลดข้อมูลพนักงานได้ กรุณาลองใหม่อีกครั้ง";
      }
    },
    methods: {
      updateHead() {
        if (this.employees) {
          useHead({
            title: `🥥 Employee - ${this.employees.name}`,
            meta: [
              {
                name: "description",
                content: `ข้อมูลเกี่ยวกับ ${this.employees.name || "พนักงาน"}.`,
              },
            ],
          });
        }
      },
      filterByTag(tag) {
        this.$router.push({ path: '/aboutus/employees', query: { tag } });
      },
    },
  };
  </script>
  
  <style scoped>
  .back-btn-container {
    width: 30%;
  }
  
  .employees-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }
  
  .employees-content {
    display: flex;
    gap: 2rem;
    align-items: center;
    max-width: 900px;
  }
  
  .employees-image {
    width: 300px;
    border-radius: 10px;
    border: 2px solid #4e6d16;
    aspect-ratio: 2.5/3;
    object-fit: cover;
  }
  
  .employees-details {
    font-size: 1.2rem;
    color: #333;
  }
  
  .employees-name {
    font-size: 2rem;
    font-weight: bold;
    color: #4e6d16;
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
