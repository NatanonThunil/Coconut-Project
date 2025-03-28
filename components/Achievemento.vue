<template>
    <div class="f-banner" :style="{ backgroundColor: inputColor }" @click="goToUrl">
      <div class="f-banner-image-container">
        <img :src="picture" alt="banner image" loading="lazy" draggable="false">
      </div>
      <div class="f-banner-text-container">
        <h1 class="f-banner-title">{{ title }}</h1>
        <p class="f-banner-text">{{ text }}</p>
        <p class="f-banner-text">by {{ author }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      text: {
        type: String,
        required: true
      },
      picture: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      color: {
        type: String
      },
      title: {
        type: String
      },
      titlesize: {
        type: Int32Array
      },
      author: {
        type: String
      }
    },
    computed: {
      inputColor() {
        return this.color || '#A6AB82';
      }
    },
    methods: {
      goToUrl() {
        window.location.href = this.url;
      }
    }
  }
  </script>
  
  <style scoped>
  .f-banner {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    height: 20rem;
    background-color: #A6AB82;
    width: 100%;
    transition: ease-in-out 0.3s;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
  }
  
  .f-banner:hover {
    transform: scale(1.01);
    outline: #4E6D16 solid 2px;
    border-radius: 10px;
    box-shadow: 0px 0px 8px rgba(58, 133, 43, 0.5);
  }
  
  .f-banner-image-container {
    display: flex;
    height: 20rem;
    aspect-ratio: 1/1.414;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 0.2rem;
    justify-content: center;
    align-items: center;
    transition: ease-in-out 0.3s;
  }
  
  .f-banner-image-container img {
    height: calc(100% - 0.4rem);
    aspect-ratio: 1/1.414;
    object-fit: cover;
    transition: all 0.3s;
  }
  
  .f-banner-text-container {
    display: flex;
    flex: 1 0;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    width: 50%;
    background-color: white;
  }
  
  .f-banner-image-container:hover {
    transform: scale(1.5);
  }
  </style>
  