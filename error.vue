<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})


</script>

<template>
  <Navbar selecto="" />
  <div class="error-page">
    <div class="error-container">
      <h1 class="error-code">{{ error.statusCode || 404 }}</h1>
      <p class="error-message">
        Oops! The page you're looking for doesn't exist or something went wrong.
      </p>
      <SeeAllButton class="yai" text="Go Back Home" link="/" />


    </div>
  </div>

</template>

<style scoped>

.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #4E6D16;
  font-family: 'Arial', sans-serif;

}

.error-container {
  text-align: center;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 30rem;
  background-color: white;
  animation: fadein ease-in-out 0.8s;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #4E6D16;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 2rem;
}

@keyframes fadein {
  0% {
    opacity: 0;
  filter: blur(20px);
    transform: translateY(20%);
  }

  100% {
    opacity: 1;
    filter: blur(0px);
    transform: translateY(0);
  }
}
</style>
