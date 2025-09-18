<template>
 


    <div style="height: 8rem"></div>
    <div class="faqs-path">
        <NuxtLinkLocale to="/">{{ $t('Home') }}</NuxtLinkLocale>/
        <NuxtLinkLocale to="/aboutus">{{ $t('AboutUs') }}</NuxtLinkLocale>
    </div>
  <h1 class="context-header">{{ $t('AboutUs') }}</h1>
  <div style="height: 2rem;"></div>

  <p class="kumnum">นี่คือคำอธิบายเกี่ยวกับ Coconut Knowledge Hub เว็ปที่รวบรวม ข้อมูลเกี่ยวกับพันธุ์มะพร้าวทั่วทั้งประเทศ รวมไปถึงขั้นตอนการแปลรูป และส่งออก</p>
  <div class="a">
    <ContentHeader :contexto="$t('Achievements')" />
    <section>
      <AboutusslidePdf apiEndPoint="/coconut-api/achievements" title="title" lurl="achievements"/>

      <SeeAllButton text="ผลงานทั้งหมด" link="/aboutus/achievements" />
    </section>
  </div>

  <ContentHeader contexto="คณะทำงาน" />


  <Aboutusslide apiEndPoint="/coconut-api/employees" lurl="employees"/>
  <SeeAllButton text="คณะทำงานทั้งหมด" link="/aboutus/employees" />
  <ContentHeader contexto="สิทธิประโยชน์และการบริการ" />
  <AboutusslideServices apiEndPoint="/coconut-api/employees" lurl="benefitandservice"/>
  <SeeAllButton text="สิทธิประโยชน์และการบริการทั้งหมด" link="/aboutus/benefitandservice" />
  <ContentHeader contexto="สมาชิก" />
  <AboutusslideMember apiEndPoint="/coconut-api/members" lurl="members"/>
  <SeeAllButton text="สมาชิกทั้งหมด" link="/aboutus/members" />
  <div style="height: 3rem;"></div>
</template>

<script>
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Cardemployees from "~/components/Aboutusslide.vue";
import Aboutusslide from "~/components/Aboutusslide.vue";
import AboutusslideMember from "~/components/AboutusslideMember.vue";
import AboutusslideServices from "~/components/AboutusslideServices.vue";


export default {
  components: {
    Swiper,
    SwiperSlide,
    Cardemployees,
  },
  props: {
    employees: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      members: [], // Stores the fetched member data
      employees: [], // Stores the fetched employee data
      achievements: [], // Stores the fetched achievement data
      services: [], // Stores the fetched service data
    };
  },

};
</script>

<style scoped>
.kumnum{
 
  display: flex;
 
  text-align: center;
  justify-self: center;
  justify-content: center;
  font-size: clamp(1rem, 1vw, 1.5rem); 
 
  width: clamp(1rem, 70%, 1000px);
  height: auto;
}
.navcontainer {
  width: 100%;
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

.greenbox1,
.greenbox2 {
  margin-bottom: 53px;
  display: flex;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
  margin: 1rem;
  justify-content: center;
  background-color: #c5d944;
  width: 100%;
  max-width: 1450px;
  height: 347px;
}

.textcontent {
  flex: 0 0 40%;
}

.image {
  flex: 0 0 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image img {
  height: 347px;
  object-fit: cover;
  width: 100%;
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
  margin-left: 10%;
  margin-top: 10px;
  font-weight: 700;
  font-size: 40px;
}

.text {
  margin-left: 15%;
  margin-top: 7px;
  font-size: 36px;
  font-weight: 400;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  max-width: 300px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card img {
  max-width: 100%;
  height: auto;
  margin-bottom: 18px;
}

.card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #333;
}

.card p {
  font-size: 14px;
  color: #d4d3d3;
}

/* Achievement Section Styles */
.achievement-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  padding: 0 16px;
}

.achievement-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #c5d944;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.achievement-text {
  flex: 1;
  padding-right: 20px;
}

.achievement-text h2 {
  font-size: 25px;
  margin-bottom: 10px;
  color: #333;
}

.achievement-text p {
  font-size: 19px;
  color: #ffffff;
}

.achievement-image {
  flex: 0 0 200px;
  text-align: center;
}

.achievement-image img {
  max-width: 100%;
  height: 150px;
  /* Ensures uniform height */
  object-fit: cover;
  /* Maintains aspect ratio */
  border-radius: 8px;
}
</style>
