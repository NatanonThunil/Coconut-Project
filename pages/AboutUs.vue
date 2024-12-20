<template>
  <div class="navcontainer">
    <Navbar selecto="aboutus" />
  </div>
  <h3 class="header-content">เกี่ยวกับเรา</h3>
  <div class="header-container">
    <h1>เกี่ยวกับเรา</h1>
  </div>

  <div class="a">
    <section>
      <div>
        <div class="headers"><h1></h1></div>
        <div class="box1">
          <div class="greenbox1">
            <div class="content1">ผลงาน</div>
            <div class="text">ข้อความ</div>
            <div class="image">
              <img
                src="https://static.cdntap.com/tap-assets-prod/wp-content/uploads/sites/25/2020/04/32-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%B9%E0%B8%99%E0%B9%80%E0%B8%94%E0%B9%87%E0%B8%8134.png"
                alt="picture"
              />
            </div>
          </div>
          <div class="greenbox2">
            <div class="content1">ผลงาน</div>
            <div class="text">ข้อความ</div>
            <div class="image">
              <img
                src="https://static.cdntap.com/tap-assets-prod/wp-content/uploads/sites/25/2020/04/32-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%B9%E0%B8%99%E0%B9%80%E0%B8%94%E0%B9%87%E0%B8%8134.png"
                alt="picture"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="work">
        <button class="button">ผลงานทั้งหมด</button>
      </div> -->
      <SeeAllButton text="ผลงานทั้งหมด" link="" />
    </section>
  </div>
  <ContentHeader class="ch" contexto="คณะทำงาน" />
  <div class="cards-container">
    <Card title="ชื่อ" image="https://pbs.twimg.com/media/EvMY9LqVkAMfW-9.jpg" description="ข้อความ"></Card>
    <Card title="ชื่อ" image="https://s359.kapook.com/r/600/auto/pagebuilder/19c270cb-85d2-4682-956a-8151861d0936.jpg" description="ข้อความ"></Card>
    
  </div>
  

  <ContentHeader class="ch" contexto="สิทธิประโยชน์และการบริการ" />

  <ContentHeader class="ch" contexto="สมาชิก" />
  <Footer/>
</template>

<style scoped>
.navcontainer {
  width: 100vw;
  height: 100px;

}
.a {
  padding-top: 20px;

}
.headers h1 {
  text-align: center;
}
.box1 {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.greenbox1 {
  margin-bottom: 53px;
  display: flex;
  justify-content: space-between;
  background-color: #c5d944;
}
.greenbox1,
.greenbox2 {
  width: 1450px;
  height: 347px;
  border: 2px solid #004010;
  background-color: #c5d944;
}
.image img {
  height: 347px;
}
.greenbox2 {
  display: flex;
  justify-content: space-between;
}
.header-container {

  text-align: center;
  margin-top: 0;
  padding-top: 20px;
  font-size: 2rem;
}
.header-content {
  color: #aca8a8;
  margin-left: 2%;
  font-weight: 300;
}
.content1 {
  color: #000;
  margin-left: 3%;
  margin-top: 2%;
  font-weight: 700;
  font-size: 40px;
}
.text {
  margin-left: -45%;
  margin-top: 8%;
  font-size: 36px;
  font-weight: 400;
}
.work {
  border: 2px solid #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.button {
  border: 2px solid #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5%;
  padding: 10px 400px;
  font-size: 36px;
  border-radius: 20;
}
.ch {
  margin-left: 10px;
}
.card-image img {
  display: block; /* เปลี่ยนเป็น block ให้รูปครอบคลุมเต็ม */
  width: 400px; /* ปรับขนาดรูปให้เต็มการ์ด */
  height: 400px; /* กำหนดความสูง */
  object-fit: cover; /* ให้รูปภาพครอบคลุม */
  border-radius: 10px 10px 0 0; /* มุมโค้งด้านบน */
  flex-direction: row;
  
}

.card-text {
  padding: 20px; /* เพิ่ม padding เพื่อให้ข้อความดูชัดเจน */
  color: #000000;
  text-align: left;
}

.ct {
  font-size: 20px;
  margin: 0 0 10px;
}

.ct1 {
  font-size: 16px;
  line-height: 1.5;
}

.cards {
  width: 400px;
  height: 512px;
  background-color: #ffffff;
  /* margin-left: 250px; */
  border-radius: 10px; /* มุมโค้งทุกด้าน */
  border: 2px solid #000000; /* กำหนดเส้นขอบ */
  overflow: hidden; /* ซ่อนส่วนเกิน */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
}

.cards-container {
  justify-self: center;
  display: flex;
  flex-direction: row; /* Stack cards vertically */
  gap: 20px; /* Adds spacing between the cards */
  justify-content: flex-start; /* Centers cards vertically in their container */
  align-items: center; /* Centers cards horizontally in their container */
  margin-top: 20px;
  flex-wrap: wrap;/* การ์ดจะลงแถวใหม่ถ้าพื้นที่ไม่พอ */
}
.footer {
  margin-top: 2rem;
}
</style>