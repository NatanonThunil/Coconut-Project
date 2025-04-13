<template>
    <div ref="cardContainer">
      <!-- Render the cards only when visible -->
      <div v-if="isVisible" class="card-icon-footer-container">
        <NuxtLinkLocale class="footer-icon-card" to="/aboutus">
          <img src="/icon/people.svg" alt="">
          <h1>{{ $t('AboutUs') }}</h1>
          <div style="height: 0.5rem;"></div>
          <p>{{ $t('abs_desc') }}</p>
        </NuxtLinkLocale>
        <NuxtLinkLocale class="footer-icon-card" to="/coconut-information">
          <img src="/icon/icons8-info.svg" alt="">
          <h1>{{ $t('CoconutInfo') }}</h1>
          <div style="height: 0.5rem;"></div>
          <p>{{ $t('ccnif_desc') }}</p>
        </NuxtLinkLocale>
        <NuxtLinkLocale class="footer-icon-card" to="/experts">
          <img src="/icon/expert.svg" alt="">
          <h1>{{ $t('Experts') }}</h1>
          <div style="height: 0.5rem;"></div>
          <p>{{ $t('ep_desc') }}</p>
        </NuxtLinkLocale>
      </div>
      <!-- Placeholder to reserve space -->
      <div v-else style="height: 350px;"></div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isVisible: false
      }
    },
    mounted() {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.isVisible = true;
              observer.unobserve(this.$refs.cardContainer);
            }
          });
        },
        {
          // Adjust the margin to trigger loading before the card is fully visible
          rootMargin: '100px'
        }
      );
      observer.observe(this.$refs.cardContainer);
    }
  }
  </script>
  
  <style scoped>
  .footer-icon-card p {
      color: #5e5e5e;
      text-align: center;
      margin: 0;
      padding: 0;
      width: 80%;
      font-weight: 400;
  }
  
  .card-icon-footer-container {
      display: flex;
      gap: 30px;
      padding-left: 10%;
      padding-right: 10%;
  }
  

  .footer-icon-card:nth-child(1) {
  animation-delay: 0.3s;
}

.footer-icon-card:nth-child(2) {
  animation-delay: 0.5s;
}

.footer-icon-card:nth-child(3) {
  animation-delay: 0.7s;
}

  .footer-icon-card {
    opacity: 0;
    transform: translateY(20px); 
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      outline: 2px solid #73923a;
      border-radius: 10px;
      padding: 20px;
      flex: 1 1;
      aspect-ratio: 1/0.8;
      gap: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease-in-out;
      animation: fadeIn 0.5s ease-in-out forwards;
  }
  
  .footer-icon-card:hover {
    transform: translateY(0) scale(1.02);
      box-shadow: 0px 0px 12px rgba(27, 129, 40, 0.8);
  }
  
  .footer-icon-card img {
      object-fit: contain;
      width: 120px;
      height: 120px;
  }
  
  @media (max-width: 1130px) {
      .card-icon-footer-container {
          gap: 20px;
      }
      .footer-icon-card img {
          width: 90px;
          height: 90px;
      }
  }
  
  @media (max-width: 950px) {
      .card-icon-footer-container {
          display: flex;
          flex-direction: column;
          padding-left: 0%;
          padding: 0%;
          width: 80%;
      }
      .footer-icon-card {
          height: 250px;
          aspect-ratio: 0;
      }
      .footer-icon-card h1 {
          font-weight: 400;
      }
      .footer-icon-card p {
          display: none;
      }
      .footer-icon-card img {
          width: 80px;
          height: 80px;
      }
  }
  
  @keyframes fadeIn {
      0% {
          transform: translateY(20px);
          opacity: 0;
      }
      100% {
          transform: translateY(0);
          opacity: 1;
      }
  }
  </style>
  