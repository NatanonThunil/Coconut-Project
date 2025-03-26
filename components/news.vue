<template>
  <div class="news-container">
    <!-- Hot News Section -->
    <NuxtLinkLocale v-if="hotNews" class="hot-news-section" :to="'/news/details/' + hotNews.id">
      <div class="hot-news-image">
        <img :src="hotNews.image" alt="Hot News Image" draggable="false" />
      </div>
      <div class="hot-news-text">
        <h2>{{ hotNews.title }}</h2>
        <div style="height: 1rem;"></div>
        <p>{{ hotNews.summerize }}</p>
        <div style="height: 1rem;"></div>
        <p style="display: flex; justify-content: flex-end;">{{ formatDate(hotNews.upload_date) }}</p>
      </div>
    </NuxtLinkLocale>

    <!-- Regular News Section -->
    <div class="news-rows" v-if="regularNews.length">
      <div class="news-item" v-for="news in regularNews" :key="news.id"
        @click="$router.push('/news/details/' + news.id)">
        <img :src="news.image" alt="News Image" draggable="false" />
        <div class="news-text-container">
          <h2>{{ news.title }}</h2>
          <p>{{ formatDate(news.upload_date) }}</p>
        </div>
      </div>
    </div>


    <div v-else-if="loading" class="loading-shimmer">
      <div class="shimmer-item"></div>
      <div class="shimmer-item"></div>
      <div class="shimmer-item"></div>
    </div>


    <div v-else>
      <p>No news available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

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
    newsItems.value = response;


    hotNews.value = newsItems.value.find((news) => news.hot_new &&news.status) || null;


    regularNews.value = newsItems.value.filter((news) => !news.hot_new&&news.status).slice(0, 2);
  } catch (error) {
    console.error('Error fetching news:', error);
  } finally {
    loading.value = false;
  }
};


onMounted(fetchNews);
</script>

<style scoped>
.hot-news-text p {
  text-align: left;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  text-overflow: ellipsis;
}

.hot-news-text h1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
}


.news-container {
  margin-left: 4%;
  margin-right: 4%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hot-news-section {
  cursor: pointer;
  display: flex;
  max-height: 50rem;
  min-height: 15rem;
  flex-direction: row;
  align-items: center;
  background-color: #DFF169;
  border-radius: 10px;
  overflow: hidden;
  transition: ease-in-out 0.2s;
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.hot-news-section:hover {
  transform: scale(1.01);
  background-color: #abb94f;
  box-shadow: rgba(0, 0, 0, 0.6) 4px 4px 4px;
}

.hot-news-image {
  max-height: 300px;
  width: 50%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.hot-news-image img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.hot-news-text {
  flex: 1;
  padding: 1.5rem;
  border-radius: 10px;
  color: black;
  text-align: justify;
  /* line-height: 1.4; */
  height: 100%;
  max-width: 50%;
}

.news-rows {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: space-between;
}

.news-item {
  cursor: pointer;
  height: 15rem;
  flex: 1;
  background-color: #DFF169;
  border-radius: 10px;
  color: white;
  display: flex;
  min-height: 180px;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  transition: ease-in-out 0.2s;
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.news-item:hover {
  transform: scale(1.01);
  background-color: #abb94f;
  box-shadow: rgba(0, 0, 0, 0.6) 4px 4px 4px;
}

.news-text-container {
  width: 45%;
}

.news-item img {
  align-self: center;
  width: 55%;
  height: 100%;
  object-fit: cover;
}

.news-item h2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  margin: 1rem;
  text-align: left;
  line-height: 1.4;
  color: black;
}

.news-item p {
  margin: 1rem;
  text-align: left;
  line-height: 1.4;
  color: black;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.news-item:nth-child(1) {
  animation-delay: 0.2s;
}

.news-item:nth-child(2) {
  animation-delay: 0.4s;
}


.loading-shimmer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shimmer-item {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  max-height: 50rem;
  height: 300px;
  border-radius: 10px;
  width: 100%;

}

@keyframes shimmer {
  100% {
    background-position: -200% 0;
  }
}



@media screen and (max-width: 1250px) {
  .hot-news-section {

    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;

  }

  .hot-news-image {
    width: 100%;
    height: 50rem;
  }

  .hot-news-image img {
    width: 100%;
  }

  .hot-news-text {
    max-width: 100%;
    text-align: center;
  }

  .news-rows {
    display: none;
    flex-direction: column;
  }

  .news-item {
    margin-bottom: 1rem;
    max-width: 100%;
    display: flex;
  }

  .news-item img {
    max-height: 120px;
  }
}

@media screen and (max-width: 480px) {
  .hot-news-image img {
    max-width: 90%;
  }

  .news-item img {
    max-height: 100px;
  }

  .news-item {
    display: none;
    flex-direction: column;
  }
}
</style>
