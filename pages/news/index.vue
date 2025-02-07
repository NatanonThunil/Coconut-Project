<template>
  <Navbar selecto="news" />

  <div style="height: 10rem;"></div>
  <h3 class="header-content">{{ $t("News") }}</h3>
  <h1 class="context-header">{{ $t("News") }}</h1>
  <div style="height: 5rem;"></div>


  <div class="hot-news-section">
    <section class="beeg-news">
      <HotBigAllNews :url="`/news/details/${hotNews.id}`"
        :image="hotNews.image || 'https://via.placeholder.com/600x400'" :title="hotNews.title || ''"
        :date="formatDate(hotNews.upload_date) || ''" v-if="hotNews" />
      <div v-else style="height:100%">
        <HotBigAllNewsShimmer />
      </div>
    </section>

    <section class="smol-news" v-if="loading">
      <HotSmallAllNewsShimmer />
      <HotSmallAllNewsShimmer />
    </section>
    <section class="smol-news" v-else>
      <HotSmallAllNews
        v-for="news in newsItems.filter((news) => (news.hot_new && news.id !== hotNews?.id) && news.status).slice(0, 2)"
        :key="news.id" :url="`/news/details/${news.id}`" :image="news.image || 'https://via.placeholder.com/1280x720'"
        :title="news.title || ''" :date="formatDate(news.upload_date) || ''" />
    </section>



  </div>



  <ContentHeader contexto="ข่าวอื่นๆ" />

  <section class="news-etc">
    <etcNews v-for="news in regularNews" :key="news.id" :url="`/news/details/${news.id}`"
      :image="news.image || 'https://via.placeholder.com/1280x720'" :title="news.title || ''"
      :date="formatDate(news.upload_date) || ''" :isHotnews="news.hot_new" />
  </section>
</template>


<script setup>
import { ref, onMounted } from 'vue';

const newsItems = ref([]);
const hotNews = ref(null);
const loading = ref(true);
const regularNews = ref([]);

const fetchNews = async () => {
  try {
    const response = await $fetch('/api/news_table');
    newsItems.value = response;

    // Find the most recent hot news
    hotNews.value = newsItems.value.find((news) => news.hot_new && news.status) || null;

    // Sort by `upload_date` DESC (newest first)
    regularNews.value = newsItems.value
      .filter((news) => news.status) // Only include published news
      .filter((news, index, array) => {
        // Keep first 3 hot news separate; the rest go into regular news
        return !news.hot_new || array.filter(n => n.hot_new && n.status).indexOf(news) >= 3;
      })
      .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date)); // Sort by upload_date

  } catch (error) {
    console.error('Error fetching news:', error);
  } finally {
    loading.value = false;
  }
};



onMounted(fetchNews);
</script>


<style scoped>
.news-etc {
  display: flex;
  justify-self: center;
  justify-content: center;
  margin-bottom: 1rem;
  width: 80%;
  height: auto;
  grid-template-columns: repeat(3, 1fr);
  padding: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.hot-news-section .beeg-news {
  padding: 1rem;
  height: 100%;
  width: 70%;
}

.hot-news-section .smol-news {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  height: 100%;
  width: 28%;
  gap: 1rem;

}

.hot-news-section {
  display: flex;
  flex-direction: row;
  justify-self: center;
  background-color: #A6AB82;
  height: 40rem;
  width: 80%;
  border-radius: 10px;
}

h1.context-header {
  text-align: center;

}

.header-content {
  color: #aca8a8;
  margin-left: 2%;
  font-weight: 300;
}
</style>