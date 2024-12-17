<template>
  <div>
    <Navbar selecto="home" />
    <TagLine taglinetext="bruh, dis is Coconut Knowledge Hub" />

    <ContentHeader contexto="ข่าวสาร" />
    <NewsItem />
    <SeeAllButton text="ข่าวสารทั้งหมด" link="news"/>
    <ContentHeader contexto="กิจกรรม" />
    <HomeEvent />
    <SeeAllButton text="กิจกรรมทั้งหมด" />
    <ContentHeader contexto="อื่นๆ" />
    <HomeFootBanner
      text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, unde fuga laborum ipsum temporibus commodi neque excepturi facere tempore! Ipsum non eligendi cum, sapiente facere veniam fuga. Aperiam, culpa perspiciatis."
      picture="https://via.placeholder.com/1280x720" url="https://www.youtube.com/watch?v=NnfdNHUWgqs" />
 
    <HomeFootBanner
      text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, unde fuga laborum ipsum temporibus commodi neque excepturi facere tempore! Ipsum non eligendi cum, sapiente facere veniam fuga. Aperiam, culpa perspiciatis."
      picture="https://via.placeholder.com/1280x720" url="https://www.youtube.com/watch?v=NnfdNHUWgqs" />
  
    <HomeFootBanner
      text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, unde fuga laborum ipsum temporibus commodi neque excepturi facere tempore! Ipsum non eligendi cum, sapiente facere veniam fuga. Aperiam, culpa perspiciatis."
      picture="https://via.placeholder.com/1280x720" url="https://www.youtube.com/watch?v=NnfdNHUWgqs" />

    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import TagLine from '@/components/TagLine.vue';
import ContentHeader from '@/components/ContentHeader.vue';
import NewsItem from '@/components/news.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Navbar,
    TagLine,
    ContentHeader,
    NewsItem,
    Footer,
  },
};
</script>

<style scoped>
footer {
  margin-top: 2rem;
}
</style>
