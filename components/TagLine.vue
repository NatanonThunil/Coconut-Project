<template>
    <div class="hero-bar">
      <div class="overlay"></div>
      <h1>{{ taglinetext }}</h1>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      taglinetext: {
        type: String,
        required: true,
      },
      imageSrc: {
        type: String,
        default: "@/assets/img/tl.png",
      },
    },
  };
  </script>
  
  <style scoped>
  .hero-bar {
    position: relative;
    width: 100%;
    height: 40rem;
    background-image: url(@/assets/img/tl.png);
    background-size: cover;
   
    background-position: top center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    
  }
  
  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 1;
    background: black;
    animation:  fadeInOverlay 0.5s ease-in-out forwards; 
  }
  
  h1 {
    color: white;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
    font-size: 2.5em;
    text-align: center;
    opacity: 0;
    animation: fadeInText 1s ease-out 0.5s forwards;
    position: relative;
    z-index: 2;
  }
  
  @keyframes fadeInText {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeInOverlay {
    0% {
      opacity: 1;
      
    }
    100% {
      opacity: 0.4;
     
    }
  }
  @keyframes zoomOutBG {
    0% {
        transform: scale(1.2);
      
    }
    100% {
        transform: scale(1);
     
    }
  }
  </style>
  