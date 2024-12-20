<template>
  <div class="news-container">
    <!-- Hot News Section -->
    <div v-if="hotNews" class="hot-news-section" @click="$router.push('/news/' + hotNews.id)">
      <div class="hot-news-image">
        <img :src="hotNews.image" alt="Hot News Image" />
      </div>
      <div class="hot-news-text">
        <h2>{{ hotNews.summerize }}</h2>
        <p>{{ formatDate(hotNews.upload_date) }}</p>
      </div>
    </div>

    <!-- Regular News Section -->
    <div class="news-rows" v-if="regularNews.length">
      <div
        class="news-item"
        v-for="news in regularNews"
        :key="news.id"
        @click="$router.push('/news/' + news.id)"
      >
        <img :src="news.image" alt="News Image" />
        <p>{{ news.title }}</p>
      </div>
    </div>

    <!-- Show loading message while news is being fetched -->
    <div v-else-if="loading">
      <p>Loading news...</p>
    </div>

    <!-- Fallback message if no news is available -->
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
    const response = await $fetch('/api/news_table');
    newsItems.value = response;

    // Find the hot news item
    hotNews.value = newsItems.value.find((news) => news.hot_new) || null;

    // Filter out regular news items, excluding the hot news
    regularNews.value = newsItems.value.filter((news) => !news.hot_new).slice(0, 2);
  } catch (error) {
    console.error('Error fetching news:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
};

onMounted(fetchNews);
</script>

<style scoped>
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
  max-height: 20rem;
  min-height: 15rem;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  background-color: #4e6d16;
  border-radius: 10px;
  overflow: hidden;
  transition: ease-in-out 0.2s;
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.hot-news-section:hover {
  transform: scale(1.01);
  background-color: #2c440f;
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
  padding: 1rem;
  border-radius: 10px;
  color: white;
  text-align: justify;
  line-height: 1.4;
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
  background-color: #4e6d16;
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
  background-color: #2c440f;
  box-shadow: rgba(0, 0, 0, 0.6) 4px 4px 4px;
}

.news-item img {
  align-self: center;
  width: 65%;
  max-height: 100%;
  object-fit: cover;
}

.news-item p {
  margin: 1rem;
  text-align: center;
  font-size: 1.2rem;
  line-height: 1.4;
  color: white;
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

/* Responsive styles */
@media screen and (max-width: 1250px) {
  .hot-news-image {
    width: 70%;
   
  }

  .news-item {
    flex-direction: column;
  }
}

@media screen and (max-width: 1024px) {
  .hot-news-section {
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
  }

  .hot-news-image {
    width: 100%;
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

@media screen and (max-width: 1250px) {
  .news-item img{
    width: 60%;
    height: 100%;
  }
  .news-item{
    flex-direction: row;
  }}


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
