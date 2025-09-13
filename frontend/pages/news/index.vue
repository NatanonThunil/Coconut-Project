<template>

  <div style="height: 8rem"></div>
  <div class="faqs-path">
    <NuxtLinkLocale to="/">{{ $t('Home') }}</NuxtLinkLocale>/
    <NuxtLinkLocale to="/news">{{ $t('News') }}</NuxtLinkLocale>
  </div>
  <h1 class="context-header">{{ $t("News") }}</h1>
  <div style="height: 5rem;"></div>

  <div class="hot-news-section">
    <section class="beeg-news">
      <HotBigAllNews :url="`/news/details/${hotNews.id}`" :image="hotNews.image || notfound"
        :title="hotNews.title || ''" :date="formatDate(hotNews.upload_date) || ''" v-if="hotNews" />
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
        :key="news.id" :url="`/news/details/${news.id}`" :image="news.image || notfound" :title="news.title || ''"
        :date="formatDate(news.upload_date) || ''" />
    </section>
  </div>

  <ContentHeader contexto="ข่าวอื่นๆ" />

  <section class="news-etc-container">
    <section class="news-etc">
      <etcNews v-for="news in regularNews" :key="news.id" :url="`/news/details/${news.id}`"
        :image="news.image || notfound" :title="news.title || ''" :date="formatDate(news.upload_date) || ''"
        :isHotnews="news.hot_new" />
    </section>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import notfound from '/img/News404.png';
const { getNews } = useNews();
const newsItems = ref([]);
const hotNews = ref(null);
const loading = ref(true);
const regularNews = ref([]);

const fetchNews = async () => {
  loading.value = true
  try {
    const response = await getNews();

    const items = [...(response ?? [])]
      .filter(Boolean)
      .sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());

    newsItems.value = items;

    const published = items.filter(n => n?.status === 1 || n?.status === true);


    const hotTop3 = published.filter(n => !!n?.hot_new).slice(0, 3);

    hotNews.value = hotTop3[0] || null;

    const hotIds = new Set(hotTop3.map(h => h.id));
    regularNews.value = published.filter(n => !hotIds.has(n.id));

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
  justify-content: flex-start;
  
  grid-template-columns: 1fr;
justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
  height: auto;
  grid-template-columns: repeat(5, auto);
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
