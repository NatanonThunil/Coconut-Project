<template>
  <div class="news-container">
    <!-- Hot News Section -->
    <NuxtLinkLocale v-if="hotNews" class="hot-news-section" :to="`/announcements/news/details/${hotNews.id}`">
      <div class="hot-news-image">
        <img :src="hotNews.image" alt="Hot News Image" draggable="false" />
      </div>
      <div class="hot-news-text">
        <h2>{{ getLocalizedText(hotNews, 'title') }}</h2>
        <div class="spacer"></div>
        <p>{{ getLocalizedText(hotNews, 'summerize') }}</p>
        <div class="spacer"></div>
        <p class="date-text">{{ formatDate(hotNews.upload_date) }}</p>
      </div>
    </NuxtLinkLocale>

    <!-- Regular News Section -->
    <div class="news-rows" v-if="regularNews.length">
      <div class="news-item" v-for="news in regularNews" :key="news.id" @click="() => navigateToDetails(news.id)">
        <img :src="news.image" alt="News Image" draggable="false" />
        <div class="news-text-container">
          <h2>{{ getLocalizedText(news, 'title') }}</h2>
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
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNews } from '~/composables/useNews'
import { useRouter } from 'vue-router'

const { locale } = useI18n()
const currentLocale = computed(() => locale.value)
const router = useRouter()


const { getNews } = useNews()

const newsItems = ref([])
const hotNews = ref(null)
const regularNews = ref([])
const loading = ref(true)


const getLocalizedText = (newsItem, key) => {
  return currentLocale.value === 'th' ? newsItem[key] : newsItem[`${key}_en`]
}


// const formatDate = (dateStr) => {
//   return new Date(dateStr).toLocaleDateString(currentLocale.value)
// }


const navigateToDetails = (id) => {
  router.push(`/announcements/news/details/${id}`)
}

const fetchNews = async () => {
  loading.value = true
  try {
    const response = await getNews()

    if (Array.isArray(response)) {

      newsItems.value = response.sort((a, b) => b.id - a.id)

      hotNews.value = newsItems.value.find((item) => item.hot_new && item.status) || null
      regularNews.value = newsItems.value.filter((item) => !item.hot_new && item.status).slice(0, 2)
    } else {
      console.error('Unexpected response format:', response)
      newsItems.value = []
      hotNews.value = null
      regularNews.value = []
    }
  } catch (error) {
    console.error('Error fetching news:', error)
    newsItems.value = []
    hotNews.value = null
    regularNews.value = []
  } finally {
    loading.value = false
  }
}

// Re-fetch the news when the component mounts and whenever the current locale changes.
onMounted(fetchNews)
watch(currentLocale, fetchNews)
</script>

<style scoped>
.news-container {
  margin: 0 4%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.spacer {
  height: 1rem;
}

.date-text {
  display: flex;
  justify-content: flex-end;
}

/* Hot News Section Styles */
.hot-news-section {
  cursor: pointer;
  display: flex;
  max-height: 50rem;
  min-height: 15rem;
  flex-direction: row;
  align-items: center;
  background-color: #dff169;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.hot-news-section:hover {
  transform: scale(1.01);
  background-color: #abb94f;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.6);
}

.hot-news-image {
  height: 24.5rem;

  width: 50%;
  overflow: hidden;
  justify-content: flex-start;
  display: flex;
  align-items: center;
}

.hot-news-image img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  aspect-ratio: 16/9;
}

.hot-news-text {
  flex: 1;
  padding: 1.5rem;
  border-radius: 10px;
  color: black;
  text-align: justify;
  max-width: 50%;

}

.hot-news-text h2,
.hot-news-text p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;


}

/* Regular News Section Styles */
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
  background-color: #dff169;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.news-item:hover {
  transform: scale(1.01);
  background-color: #abb94f;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.6);
}

.news-text-container {
  width: 45%;
}

.news-text-container h2,
.news-text-container p {
   display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-item img {
  width: 55%;
  height: 100%;
  object-fit: cover;
}

.news-item h2 {
  margin: 1rem;
  text-align: left;
  line-height: 1.4;
  color: black;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
}

.news-item p {
  margin: 1rem;
  text-align: left;
  line-height: 1.4;
  color: black;
}

/* Shimmer Loading Styles */
.loading-shimmer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shimmer-item {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  height: 300px;
  border-radius: 10px;
  width: 100%;
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

@keyframes shimmer {
  100% {
    background-position: -200% 0;
  }
}

/* Responsive Styles */
@media screen and (max-width: 1250px) {
  .hot-news-section {
    width: 45%;
    flex-direction: column;
    align-items: center;
  }

  .hot-news-text h2 , .news-text-container h2{
    font-size: clamp(1rem, 0.8vw, 2rem);
  }

    .hot-news-text p , .news-text-container p{
    font-size: clamp(0.8rem, 0.8vw, 1.5rem);
  }


  .news-container {
  flex-direction: row;
  justify-content: center;
  }

  .hot-news-image {
    width: 100%;
    height: 100%;
    justify-content: center;
  }

  .hot-news-image img {
    height: 100%;
    width: 100%;
 
  }

  .hot-news-text {
    max-width: 100%;
    text-align: center;
  }

  .news-rows {
    width: 45%;
    flex-direction: column;
  }

 

  .news-item img {
    height: 100%;
    width: 55%;
  }
}

@media screen and (max-width: 480px) {
  .hot-news-text p{
    display: none;
  }
  .hot-news-image img {
    max-width: 90%;
  }

  .news-item img {
    max-height: 100px;
  }

  .news-item {
    flex-direction: column;
  }
}
</style>
