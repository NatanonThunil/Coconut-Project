<template>
  <div>
    <Navbar selecto="home" />
    <TagLine taglinetext="bruh, dis is Coconut Knowledge Hub" />
    
    <ContentHeader contexto="ข่าวสาร" />
    <NewsItem />
    <SeeAllButton text="ข่าวสารทั้งหมด"link="news"/>
    <ContentHeader contexto="กิจกรรม" />
    <HomeEvent />
    <SeeAllButton text="กิจกรรมทั้งหมด"link="events"/>
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
