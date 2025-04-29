<template>
  <div>
    <Navbar selecto="expert" />
    <div style="height: 8rem"></div>
    <div class="faqs-path">
     
        <NuxtLinkLocale to="/experts">{{ $t('Expert') }}</NuxtLinkLocale> /
        <NuxtLinkLocale :to="'/experts/details/'+this.$route.params.id">{{ expert?.name || 'No Name'}}</NuxtLinkLocale>
    </div>
    <div class="all-container">
      <div style="height: 10rem"></div>

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
          <img
            :src="expert?.image || tlImage"
            class="expert-image"
            alt="Expert Image"
            draggable="false"
          />

          <div class="expert-details">
            <h1 class="expert-name">{{ expert?.name }}</h1>

            <div class="info">
              <p><strong>ที่อยู่:</strong> {{ expert?.address || "N/A" }}</p>
              <p><strong>ติดต่อ:</strong> {{ expert?.gmail || "N/A" }}</p>
              <p>Facebook | Twitter</p>
            </div>

            <div class="tags">
              <p><strong>แท็ก:</strong></p>
              <div v-if="expert?.tags && expert.tags.length">
                <span
                  v-for="(tag, index) in expert.tags"
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
              {{ expert?.description || "ไม่มีคำอธิบาย" }}
            </p>
          </div>
        </div>
        <div style="height: 5rem"></div>

        <div class="back-btn-container">
          <SeeAllButton text="ดูผู้เชี่ยวชาญคนอื่น" link="/experts" />
        </div>
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
      expert: null,
      error: null,
      tlImage,
    };
  },
  async mounted() {
    const cid = this.$route.params.id;
    try {
      const response = await fetch(`/api/experts`, {
      headers: {
       "CKH": '541986Cocon',
       
      },
    });
      if (!response.ok)
        throw new Error(
          `Failed to fetch expert details: ${response.statusText}`
        );
      const data = await response.json();
      this.expert =
        data.find((expert) => expert.id === parseInt(cid) && expert.status) ||
        null;

      // Ensure expert tags are properly formatted
      if (this.expert && typeof this.expert.tags === "string") {
        try {
          this.expert.tags = JSON.parse(this.expert.tags);
        } catch (error) {
          console.error("Error parsing tags in frontend:", error);
          this.expert.tags = [];
        }
      }

      if (this.expert) {
        this.updateHead();
      } else {
        this.error = "ไม่พบข้อมูลผู้เชี่ยวชาญ กรุณาตรวจสอบหมายเลขอีกครั้ง";
      }
    } catch (error) {
      this.error = "ไม่สามารถโหลดข้อมูลผู้เชี่ยวชาญได้ กรุณาลองใหม่อีกครั้ง";
    }
  },
  methods: {
    updateHead() {
      if (this.expert) {
        useHead({
          title: `🥥 Expert - ${this.expert.name}`,
          meta: [
            {
              name: "description",
              content: `ข้อมูลเกี่ยวกับ ${this.expert.name || "ผู้เชี่ยวชาญ"}.`,
            },
          ],
        });
      }
    },
    filterByTag(tag) {
      this.$router.push({ path: "/experts", query: { tag } });
    },
  },
};
</script>

<style scoped>
.back-btn-container {
  width: 30%;
}

.expert-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.expert-content {
  display: flex;
  gap: 2rem;
  align-items: center;
  max-width: 900px;
}

.expert-image {
  width: 300px;
  border-radius: 10px;
  border: 2px solid #4e6d16;
  aspect-ratio: 2.5/3;
  object-fit: cover;
}

.expert-details {
  font-size: 1.2rem;
  color: #333;
}

.expert-name {
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
