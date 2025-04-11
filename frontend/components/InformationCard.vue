<template>
  <NuxtLinkLocale class="information-card" :to="'/coconut-information/chain-value/' + id">
    <img :src="img" alt="Information Image" class="information-card-img" />
    <div class="information-card-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  </NuxtLinkLocale>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.information-card {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
}

.information-card:hover {
  transform: scale(1.05);
}

.information-card-img {
  width: 100%;
  aspect-ratio: 1/1;
  height: auto;
object-fit: cover;
}

.information-card-content {
  padding: 1rem;
  text-align: center;
}

.information-card-content h3 {
  margin: 0.5rem 0;
}

.information-card-content p {
  color: #666;
}
</style>
