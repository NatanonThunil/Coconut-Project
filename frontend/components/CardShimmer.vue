<template>
  <div class="coconut-v-card shimmer" loading="lazy">
    <div class="coconut-v-img-frame">
      <div class="shimmer-box"></div>
    </div>
    <div class="coconut-v-card-text-container">
      <div class="shimmer-text"></div>
      <div class="shimmer-text" style="width: 60%;"></div>
    </div>
  </div>
</template>

<script></script>
<style scoped>
.coconut-v-card {
  cursor: default;
  height: 18rem;
  width: 15rem;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
  position: relative;
}

.coconut-v-card.shimmer {
  animation: shimmer-loading 1.5s infinite;
}

.coconut-v-card .coconut-v-img-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 13rem;
  width: 100%;
  background-color: #212e08;
  overflow: hidden;
}

.coconut-v-card .coconut-v-img-frame .shimmer-box {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer-effect 1.5s infinite;
}

.coconut-v-card .coconut-v-card-text-container {
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.coconut-v-card .coconut-v-card-text-container .shimmer-text {
  width: 80%;
  height: 1rem;
  margin-top: 0.8rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer-effect 1.5s infinite;
}


@keyframes shimmer-effect {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 590px) {
  .coconut-v-card .coconut-v-card-text-container .shimmer-text {
    display: none;
  }

  .coconut-v-card {
    width: 14.5rem;
  }
}
</style>