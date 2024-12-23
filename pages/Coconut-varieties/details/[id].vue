<template>
  <Navbar selecto="coconutdata" />
  <div style="height: 10rem;"></div>
  <h1 class="context-header">รายละเอียดพันธุ์มะพร้าว</h1>
  <div style="height: 2rem;"></div>

  <div v-if="coconut">
    <div class="coconut-detail-container">
      <div class="coconut-detail-img">
        <img :src="coconut.image || 'https://via.placeholder.com/1280x720'" alt="Coconut Image" />
      </div>
      <div class="coconut-detail-info">
        <h2>{{ coconut.name_th || 'ชื่อไทย' }}</h2>
        <p><strong>ชื่อวิทยาศาสตร์:</strong> {{ coconut.sci_name_f || 'วิทย์ 1' }} <br> {{ coconut.sci_name_m || 'วิทย์2' }} <br> {{ coconut.sci_name_l || 'วิทย์ 3' }}</p>
        <p><strong>คำอธิบาย:</strong> {{ coconut.description || 'ไม่มีคำอธิบาย' }}</p>
        <p><strong>แหล่งที่มา:</strong> {{ coconut.origin || 'ไม่มีข้อมูล' }}</p>
        <p><strong>ลักษณะเฉพาะ:</strong> {{ coconut.characteristics || 'ไม่มีข้อมูล' }}</p>
        <p><strong>ประเภท (อายุ):</strong> {{ coconut.youngold || 'ข้อมูลไม่ระบุ' }}</p>

      </div>
    </div>
  </div>

  <div v-else>
    <p>กำลังโหลดข้อมูล...</p>
  </div>

  <Footer />
</template>

<script>
export default {
  data() {
    return {
      coconut: null,
    };
  },
  async mounted() {
    const cid = this.$route.params.id;

    try {
      const response = await fetch(`/api/coconut`);
      if (!response.ok) throw new Error('Failed to fetch coconut details');
      const data = await response.json();
      this.coconut = data.find(coconut => coconut.id === parseInt(cid)) || null;
    } catch (error) {
      console.error('Error fetching coconut details:', error);
    }
  },
};
</script>

<style scoped>
.context-header {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}

.coconut-detail-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.coconut-detail-img img {
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
}

.coconut-detail-info {
  max-width: 600px;
  font-size: 1rem;
  line-height: 1.5;
}

.coconut-detail-info h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.coconut-detail-info p {
  margin-bottom: 0.5rem;
}

.coconut-detail-info strong {
  font-weight: bold;
}
</style>
