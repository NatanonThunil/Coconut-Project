<template>
  <Navbar selecto="coconutdata" />
  <div style="height: 10rem;"></div>


  <div v-if="coconut">
    <div class="coconut-detail-container">
      <div class="row-top">
        <div class="coconut-detail-img">
          <img :src="coconut.image || 'https://via.placeholder.com/1280x720'" alt="Coconut Image" />
        </div>
        <div class="coconut-detail-info">
          <h2>{{ coconut.name_th || 'ชื่อไทย' }}</h2>
          <p><strong>ชื่ออังกฤษ :</strong> {{ coconut.name_eng }}</p>
          <p><strong>ชื่อวิทยาศาสตร์ :</strong> {{ coconut.sci_name_f }} {{ coconut.sci_name_m }} {{ coconut.sci_name_l
            }}</p>
          <p><strong>คำอธิบาย :</strong> {{ coconut.description || 'ไม่มีคำอธิบาย' }}</p>
          <p><strong>ถิ่นกำเนิด :</strong> <br>
          <p class="origin-desc">{{ coconut.origin || 'ไม่มีข้อมูล' }}</p>
          </p>
        </div>


      </div>
      <div class="deta-below">
        <p><strong>ลักษณะเฉพาะ :</strong> <br>
        <p class="origin-desc">{{ coconut.characteristics || 'ไม่มีข้อมูล' }}</p>
        </p>
        <p><strong>ประเภท :</strong>
          {{ coconut.youngold === 'Old' ? 'มะพร้าวแก่' : (coconut.youngold === 'Young' ? 'มะพร้าวอ่อน' :
          'ข้อมูลไม่ระบุ') }}
        </p>
      </div>
    </div>
    <div style="height: 4px;background-color: #4e6d16;width: 80%; display: flex;justify-self: center; margin: 1rem;"></div>
  <SeeAllButton text="ดูพันธุ์อื่นๆ" link="/coconut-varieties"/>
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

.row-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem
}

.deta-below {
  gap: 2rem;
  padding-left: 5rem;
  padding-right: 5rem;
}

.deta-below p {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}




.coconut-detail-container {
  display: flex;
  justify-self: center;
  width: 80%;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
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

.coconut-detail-info strong {
  font-weight: bold;
}

@media (max-width: 900px) {
  .coconut-detail-container {
    width: 95%;
  }
}

@media (max-width: 762px) {
  .coconut-detail-info {
    justify-content: center;
  }
}
</style>
