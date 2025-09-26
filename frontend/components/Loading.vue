<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner">
      <NuxtImg src="/CoconutIcon.ico" alt="Loading Icon" class="coconut-icon" preload/>
    </div>
    <div class="loading-text bobbing-text">
      {{ LoadingText }}
      <span class="bobbing-dots">
        <span> . </span>
        <span>.</span>
        <span> . </span>
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isLoading: { type: Boolean, default: false },
  LoadingText: { type: String, default: 'Loading' }
});
</script>

<style scoped>
.loading-container {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: rgba(0,0,0,0.8);
  animation: fadeIn 0.3s ease-in-out;
}

.loading-spinner {
  display: flex; align-items: center; justify-content: center;
  width: 150px; height: 150px; border-radius: 50%;
  border: 8px solid #f3f3f3; border-top-color: #79ffe6;
  animation: spin 2s linear infinite;
}

.coconut-icon {
  width: 100px; height: 100px; display: block;
  transform-origin: center;
  animation: spin-reverse 1.5s linear infinite;
}

.loading-text {
  margin-top: 16px; color: #fff; font-weight: 500;
  font-size: clamp(1rem, 2.5vw, 2rem);
  display: flex; align-items: center; gap: 4px;
}

.bobbing-text {
  animation: bob 1.5s ease-in-out infinite;
}

.bobbing-dots span {
  animation: blink 1.5s infinite;
  opacity: 0;
}

.bobbing-dots span:nth-child(1) { animation-delay: 0s; }
.bobbing-dots span:nth-child(2) { animation-delay: 0.3s; }
.bobbing-dots span:nth-child(3) { animation-delay: 0.6s; }

/* keyframes */
@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
@keyframes spin-reverse { from { transform: rotate(360deg);} to { transform: rotate(0deg);} }
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes blink {
  0%, 20% { opacity: 0; }
  30%, 80% { opacity: 1; }
  100% { opacity: 0; }
}

</style>
