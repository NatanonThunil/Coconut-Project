<template>
  <div>
    <Navbar selecto="home" />
    <TagLine taglinetext="This is Coconut KnowledgeHub TagLine" />

    <ContentHeader contexto="ข่าวสาร" />
    <news />
    <SeeAllButton text="ข่าวสารทั้งหมด" link="news" />
    <ContentHeader contexto="กิจกรรม" />
    <HomeEvent />
    <SeeAllButton text="กิจกรรมทั้งหมด" link="events" />
    <ContentHeader contexto="อื่นๆ" />
    <HomeFootBanner title="เกี่ยวกับเรา"
      text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, unde fuga laborum ipsum temporibus commodi neque excepturi facere tempore! Ipsum non eligendi cum, sapiente facere veniam fuga. Aperiam, culpa perspiciatis."
      picture="_nuxt/assets/img/AboutUs.png" url="/AboutUs" />

    <HomeFootBanner title="ข้อมูลมะพร้าว"
      text="มะพร้าว เป็นพืชยืนต้นชนิดหนึ่งอยู่ในวงศ์ปาล์ม (Arecaceae)และเป็นสปีชีส์เดียวของสกุล Cocos ที่ยังมีชีวิตอย มะพร้าว เป็นพืชซึ่งสามารถใช้ประโยชน์ได้ในหลากหลายด้าน "
      picture="_nuxt/assets/img/CoconutInformation.jpg" url="/coconut-varieties" />

    <HomeFootBanner title="ผู้เชี่ยวชาญ"
      text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, unde fuga laborum ipsum temporibus commodi neque excepturi facere tempore! Ipsum non eligendi cum, sapiente facere veniam fuga. Aperiam, culpa perspiciatis."
      picture="_nuxt/assets/img/Expert.png" url="/Expert" />

    <Footer />

  </div>
</template>

<script>
import { useHead } from '@vueuse/head';
export default {
  mounted() {
    window.scrollTo(0, 0);
  }, setup() {
    useHead({
      title: '🥥Coconut - Home',
      meta: [
        {
          name: 'description',
          content: 'Home page for Coconut Knowledge Hub',
        },
      ],
    },


    );
  }
}




</script>
<style scoped>
footer {
  margin-top: 2rem;
}
</style>
