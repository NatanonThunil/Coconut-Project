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
      <SeeAllButton text="ผลงานทั้งหมด" link=""/>
    </section>
  </div>
</template>

<style scoped>
.navcontainer {
  width: 100vw;
  height: 100px;
  border: green solid 2px;
}
.a {
  padding-top: 20px;
  border: 2px solid #000;
}
.headers h1 {
  text-align: center;
}
.box1 {
  border: 2px solid #ff0000;
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
  border: blue solid 3px;
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
.button{
  border: 2px solid #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5%;
  padding: 10px 400px ;
  font-size: 36px;
  border-radius: 20;
}
</style>
