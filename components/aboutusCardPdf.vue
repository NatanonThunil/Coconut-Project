<template>
    <div class="card-content-container" @click="goToUrl">
      <div :class="ispdf ? 'pdf-image-container' : 'people-image-container'">
        <img :src="image" alt="">
      </div>
      <div class="people-details-container">
        <h3 class="coconut-green-text">{{ name }}</h3>
        <p>{{ description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      image: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      ispdf: {
        type: Boolean,
        required: false,
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
  .people-details-container {
    width: 100%;
    height: 25%;
    overflow: hidden;
    padding: 1rem;
  }
  
  .people-details-container h3,
  .people-details-container p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  
  .card-content-container {
    cursor: pointer;
    background-color: white;
    height: 23rem;
    width: 22rem;
    border-radius: 10px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.4);
    overflow: hidden;
  }
  
  .card-pdf-content-container {
    cursor: pointer;
    background-color: white;
    height: 23rem;
    width: 22rem;
    border-radius: 10px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.4);
    overflow: hidden;
  }
  
  .card-content-container .pdf-image-container {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 75%;
    background-color: rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  
  .card-content-container:hover .pdf-image-container img {
    transform: scale(1.05);
  }
  
  .card-content-container .pdf-image-container img {
    aspect-ratio: 1/1.414;
    height: 100%;
    transition: ease-in-out 0.3s;
    object-fit: cover;
  }
  
  .card-content-container .people-image-container {
    width: 100%;
    height: 75%;
    overflow: hidden;
  }
  
  .card-content-container:hover .people-image-container img {
    transform: scale(1.05);
  }
  
  .card-content-container .people-image-container img {
    width: 100%;
    height: 100%;
    transition: ease-in-out 0.3s;
    object-fit: cover;
  }
  </style>
  