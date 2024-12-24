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
    <HomeFootBanner
      text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, unde fuga laborum ipsum temporibus commodi neque excepturi facere tempore! Ipsum non eligendi cum, sapiente facere veniam fuga. Aperiam, culpa perspiciatis."
      picture="https://via.placeholder.com/1280x720" url="รอลิงค์" />

    <HomeFootBanner
      text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, unde fuga laborum ipsum temporibus commodi neque excepturi facere tempore! Ipsum non eligendi cum, sapiente facere veniam fuga. Aperiam, culpa perspiciatis."
      picture="https://via.placeholder.com/2280x120" url="รอลิงค์" />

    <HomeFootBanner
      text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, unde fuga laborum ipsum temporibus commodi neque excepturi facere tempore! Ipsum non eligendi cum, sapiente facere veniam fuga. Aperiam, culpa perspiciatis."
      picture="https://via.placeholder.com/1280x720" url="รอลิงค์" />

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
