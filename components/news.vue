<template>
    <div class="news-container">
      <!-- Check if newsItems are available -->
      <div v-if="newsItems.length">
        <div v-for="news in newsItems" :key="news.news_id" class="news-item">
          <img :src="news.image" alt="News Image" />
          <div class="news-text">
            <h3>{{ news.summerize }}</h3>
            <p>{{ news.description }}</p>
            <p>By: {{ news.author }}</p>
            <p>{{ formatDate(news.upload_date) }}</p>
          </div>
        </div>
      </div>
  
      <!-- Show loading message while news is being fetched -->
      <div v-else>
        <p>Loading news...</p>
      </div>
  
      <!-- Link to all news page -->
      <nuxt-link to="/news">
        <button class="news-button">ข่าวสารทั้งหมด</button>
      </nuxt-link>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const newsItems = ref([]);
  const loading = ref(true);
  
  const fetchNews = async () => {
    try {
      const response = await $fetch('/api/news_table');
      newsItems.value = response;
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
  
  .news-item {
    display: flex;
    background-color: #4e6d16;
    border-radius: 10px;
    color: white;
    padding: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
  }
  
  .news-item img {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
  }
  
  .news-text {
    padding-left: 1rem;
  }
  
  .news-text h3 {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .news-text p {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .news-button {
    margin: 2rem;
    width: 80%;
    background-color: transparent;
    color: #4e6d16;
    padding: 10px 20px;
    font-size: 26px;
    font-weight: bold;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    border: #4e6d16 solid 3px;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  .news-button:hover {
    background-color: #4e6d16;
    color: white;
    transform: scale(1.01);
  }
  
  .news-button:focus {
    outline: none;
  }
  
  .news-button:active {
    background-color: #2c440f;
  }
  </style>
  