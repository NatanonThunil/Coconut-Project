<template>
  <div>

    <div v-if="isLoading" class="loading-container">
      <DotLottieVue 
        v-if="lottieLoaded" 
        style="height: 300px; width: 300px" 
        autoplay 
        loop 
        :src="loadingAnimation"
      />
      <p v-else style="font-size: 2.5rem;">กรุณารอสักครู่...</p>
    </div>


    <div v-else>
      <header></header>
      <main>
        <slot /> 
      </main>
      <NewFooter />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, defineAsyncComponent } from "vue";


const DotLottieVue = defineAsyncComponent(() =>
  import("@lottiefiles/dotlottie-vue").then(m => m.DotLottieVue)
);

export default {
  components: {
    DotLottieVue, 
  },
  setup() {

    const loading_time = useRuntimeConfig().public.LoadingTimeMock ; 
    const isLoading = ref(true);
    const lottieLoaded = ref(false);
    const loadingAnimation = ref("");

    const preloadLottie = async () => {
      try {
        const lottieUrl = new URL("@/assets/load/loading.lottie", import.meta.url).href;
        loadingAnimation.value = lottieUrl; 
        lottieLoaded.value = true;
      } catch (error) {
        console.error("Lottie preload error:", error);
      }
    };

    onMounted(async () => {
      window.scrollTo(0, 0);
      await preloadLottie(); 
      setTimeout(() => {
        isLoading.value = false;
      }, loading_time); // Use the updated variable
    });

    return { isLoading, lottieLoaded, loadingAnimation };
  },
};
</script>
<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8f8f8;
}

.loading-container p {
  font-size: 1.5rem;
  color: #555;
  animation: bounce 1s infinite ease-in-out;
}

/* Bouncing animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}
</style>
