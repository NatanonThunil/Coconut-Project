<template>
  <Navbar selecto="aboutus" />
  <div class="all-container">
    <div style="height: 10rem"></div>

    <!-- Loader -->
    <div v-if="!member && !error" class="loading">
      <p>กำลังโหลดข้อมูลของสมาชิกทั้งหมด...</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Member Profile Section -->
    <div class="member-container" v-if="member">
      <div class="member-content">
        <img
          :src="member?.image || tlImage"
          class="member-image"
          alt="Member Image"
          draggable="false"
        />

        <div class="member-details">
          <h1 class="member-name">{{ member?.name }}</h1>

          <div class="info">
            <p><strong>ที่อยู่:</strong> {{ member?.address || "N/A" }}</p>
            <p><strong>ติดต่อ:</strong> {{ member?.gmail || "N/A" }}</p>
            <p>Facebook | Twitter</p>
          </div>

          <div class="tags">
            <p><strong>แท็ก:</strong></p>
            <div v-if="member?.member_tags_id && member.member_tags_id.length">
              <span
                v-for="(tag, index) in member.member_tags_id"
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
            {{ member?.description || "ไม่มีคำอธิบาย" }}
          </p>
        </div>
      </div>
      <div style="height: 5rem"></div>

      <div class="back-btn-container">
        <SeeAllButton text="ดูสมาชิกทั้งหมด" link="/aboutus/members" />
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
      member: null,
      error: null,
      tlImage,
    };
  },
  async mounted() {
    const cid = this.$route.params.id;
    try {
      const response = await fetch(`/api/members_table`, {
      headers: {
       "CKH": '541986Cocon',
       
      },
    });
      if (!response.ok)
        throw new Error(
          `Failed to fetch member details: ${response.statusText}`
        );
      const data = await response.json();
      this.member =
        data.find((member) => member.id === parseInt(cid) && member.status) ||
        null;

      // Ensure member tags are properly formatted
      if (this.member && typeof this.member.member_tags_id === "string") {
        try {
          this.member.member_tags_id = JSON.parse(this.member.member_tags_id);
        } catch (error) {
          console.error("Error parsing member_tags_id in frontend:", error);
          this.member.member_tags_id = [];
        }
      }

      if (this.member) {
        this.updateHead();
      } else {
        this.error = "ไม่พบข้อมูลสมาชิก กรุณาตรวจสอบหมายเลขอีกครั้ง";
      }
    } catch (error) {
      this.error = "ไม่สามารถโหลดข้อมูลสมาชิกได้ กรุณาลองใหม่อีกครั้ง";
    }
  },
  methods: {
    updateHead() {
      if (this.member) {
        useHead({
          title: `🥥 Member - ${this.member.name}`,
          meta: [
            {
              name: "description",
              content: `ข้อมูลเกี่ยวกับ ${this.member.name || "สมาชิก"}.`,
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

.member-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.member-content {
  display: flex;
  gap: 2rem;
  align-items: center;
  max-width: 900px;
}

.member-image {
  width: 300px;
  border-radius: 10px;
  border: 2px solid #4e6d16;
  aspect-ratio: 2.5/3;
  object-fit: cover;
}

.member-details {
  font-size: 1.2rem;
  color: #333;
}

.member-name {
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
