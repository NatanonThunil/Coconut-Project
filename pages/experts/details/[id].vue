<template>
    <Navbar selecto="experts" />
  
    <!-- Loader -->
    <div v-if="!expert && !error" class="loading">
      <p>Loading expert data...</p>
    </div>
  
    <!-- Error -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  
    <!-- Expert Image -->
    <div class="image-container" v-if="expert">
      <div class="blur-background" :style="{ backgroundImage: `url(${expert?.image || tlImage})` }"></div>
      <img :src="expert?.image || tlImage" class="img" alt="Expert Image" draggable="false">
    </div>
  
    <!-- Expert Details -->
    <h1 class="text-center" v-if="expert">{{ expert?.name }}</h1>
  
    <div class="brief-details" v-if="expert">
      <div class="toline">
        <div class="expert-head">ที่อยู่</div>: <div class="expert-main-detail">{{ expert?.address || 'N/A' }}</div>
      </div>
      <div class="toline">
        <div class="expert-head">เบอร์โทรศัพท์</div>: <div class="expert-main-detail">{{ expert?.phoneNumber || 'N/A' }}</div>
      </div>
      <div class="toline">
        <div class="expert-head">แท็ก</div>: 
        <div class="expert-main-detail">
          {{ Array.isArray(expert?.expert_tags_id)
            ? expert.expert_tags_id.join(", ")
            : expert?.expert_tags_id || "N/A" }}
        </div>
      </div>
    </div>
  
    <div class="divider" v-if="expert"></div>
    <h2 class="w-3/5 mx-auto mb-4" v-if="expert">คำอธิบาย</h2>
    <p class="w-3/5 mx-auto mb-4" v-if="expert">{{ expert?.description || 'ไม่มีคำอธิบาย' }}</p>
    
    <SeeAllButton text="ดูผู้เชี่ยวชาญอื่นๆ" link="/experts" v-if="expert" />
  </template>
  
  <script>
  import { useHead } from "@vueuse/head";
  import tlImage from "@/assets/img/tl.png";
  
  export default {
    data() {
      return {
        expert: null,
        error: null,
        tlImage,
      };
    },
    async mounted() {
      const cid = this.$route.params.id;
      console.log("Fetching expert details for ID:", cid);
  
      try {
        const response = await fetch(`/api/expert`);
        if (!response.ok) throw new Error(`Failed to fetch expert details: ${response.statusText}`);
        const data = await response.json();
        console.log("API Response:", data);
  
        this.expert = data.find((expert) => expert.id === parseInt(cid)) || null;
        console.log("Selected Expert:", this.expert);
  
        if (this.expert) {
          this.updateHead();
        } else {
          this.error = "Expert not found. Please check the ID.";
        }
      } catch (error) {
        console.error("Error fetching expert details:", error);
        this.error = "Failed to load expert data. Please try again later.";
      }
    },
    methods: {
      updateHead() {
        if (this.expert) {
          useHead({
            title: `🥥 Coconut - ${this.expert.name}`,
            meta: [
              {
                name: "description",
                content: `Detailed information about ${this.expert.name || "expert"}.`,
              },
            ],
          });
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .loading,
  .error {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #777;
  }
  
  .brief-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: inherit;
  }
  
  .toline {
    display: flex;
    gap: 1rem;
  }
  
  .toline .expert-head {
    font-weight: 700;
    width: 8rem;
  }
  
  .image-container {
    position: relative;
    width: 100%;
    height: 32rem;
    background-color: #4E6D16;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .image-container .blur-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    filter: blur(10px);
    z-index: 0;
  }
  
  .image-container img {
    z-index: 1;
    height: 100%;
    object-fit: cover;
  }
  
  .divider {
    height: 3px;
    width: 60%;
    background-color: #4E6D16;
    margin: 1rem auto;
    border-radius: 1px;
  }
  </style>
  