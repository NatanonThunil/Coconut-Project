<template>
  <Navbar selecto="news" />
  <div style="height: 8rem"></div>
  <div class="faqs-path">
    
    <NuxtLinkLocale to="/news">{{ $t('News') }}</NuxtLinkLocale>
  </div>
  <h1 class="context-header">{{ $t("News") }}</h1>
  <div style="height: 5rem;"></div>

  <div class="hot-news-section">
    <section class="beeg-news">
      <HotBigAllNews
        :url="`/news/details/${hotNews.id}`"
        :image="hotNews.image || notfound"
        :title="hotNews.title || ''"
        :date="formatDate(hotNews.upload_date) || ''"
        v-if="hotNews"
      />
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
        v-for="news in newsItems.filter(news => (news.hot_new && news.id !== hotNews?.id) && news.status).slice(0, 2)"
        :key="news.id"
        :url="`/news/details/${news.id}`"
        :image="news.image || notfound"
        :title="news.title || ''"
        :date="formatDate(news.upload_date) || ''"
      />
    </section>
  </div>

  <ContentHeader contexto="ข่าวอื่นๆ" />

  <section class="news-etc-container">
    <section class="news-etc">
      <etcNews
        v-for="news in regularNews"
        :key="news.id"
        :url="`/news/details/${news.id}`"
        :image="news.image || notfound"
        :title="news.title || ''"
        :date="formatDate(news.upload_date) || ''"
        :isHotnews="news.hot_new"
      />
    </section>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import notfound from '/img/News404.png';

const newsItems = ref([]);
const hotNews = ref(null);
const loading = ref(true);
const regularNews = ref([]);

const fetchNews = async () => {
  try {
    const response = await $fetch('/api/news', {
      headers: {
        "CKH": '541986Cocon',
      },
    });
    // Sort news items by descending id (highest id first)
    newsItems.value = response.sort((a, b) => b.id - a.id);

    // Find the most recent hot news from the sorted list
    hotNews.value = newsItems.value.find(news => news.hot_new && news.status) || null;

    // For regular news, filter out hot news items and include only published news
    regularNews.value = newsItems.value.filter(news => news.status && !news.hot_new);
  } catch (error) {
    console.error('Error fetching news:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchNews);
</script>

<style scoped>
.news-etc-container {
  display: flex;
  width: 80%;
  justify-self: center;
  justify-content: center;
}
.news-etc {
  display: grid;
  justify-content: flex-start; /* Align items from left to right */
  align-items: center;
  margin-bottom: 1rem;
  width: fit-content;
  height: auto;
  grid-template-columns: repeat(5, auto);
  gap: 1.5rem;
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
