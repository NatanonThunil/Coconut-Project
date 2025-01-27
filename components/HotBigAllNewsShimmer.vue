<template>
    <NuxtLinkLocale :to="url" class="Big-card">
      <div class="big-hot-news-image-container">
        <img :src="image" v-if="!loading" />
        <div v-else class="shimmer shimmer-image"></div>
      </div>
      <div class="big-hot-news-details-container">
        <h2 v-if="!loading">{{ title }}</h2>
        <div v-else class="shimmer shimmer-text"></div>
        <div class="date-n-readmore">
          <div v-if="!loading">{{ date }}</div>
          <div v-else class="shimmer shimmer-date"></div>
          <div class="f-btn" v-if="!loading">อ่านเพิ่มเติม</div>
          <div class="f-btn shimmer" v-else></div>
        </div>
      </div>
    </NuxtLinkLocale>
  </template>
  

  <script>
  export default {
    props: {
      url: {
        type: String,
      },
      image: {
        type: String,
      },
      title: {
        type: String,
      },
      date: {
        type: String,
      },
    },
    data() {
      return {
        loading: true, // Set to false once data is fetched
      };
    },
  
  };
  </script>
  

  <style scoped>

  
  a {
    color: black;
  }
  
  .f-btn {
    
    padding: 0.1rem 0.8rem;
    width:7rem;
    border-radius: 10px;
    color: #4e6d16;
    transition: 0.3s ease-in-out;
  }
  
  .date-n-readmore {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    padding-right: 1rem;
  }
  
  .Big-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: white;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    border-radius: 10px;
    transition: 0.3s ease-in-out;
  }
  

  
  .Big-card img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: 0.3s ease-in-out;
  }
  
  .Big-card:hover img {
    transform: scale(1.08);
  }
  
  .big-hot-news-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80%;
    overflow: hidden;
  }
  
  .big-hot-news-details-container {
    padding: 1rem;
  }
  
  .big-hot-news-details-container h2 {
    font-size: larger;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
  }
  
  /* Shimmer effect */
  .shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
  }
  
  .shimmer-image {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  
  .shimmer-text {
    width: 80%;
    height: 20px;
    margin-bottom: 10px;
  }
  
  .shimmer-date {
    width: 25%;
    height: 15px;
    margin-bottom: 10px;
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  </style>
  