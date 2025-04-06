<template>
  <div class="card-content-container" @click="goToUrl">
    <div :class="ispdf ? 'pdf-image-container' : 'people-image-container'">
      <img :src="image" alt="Card Image" />
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
    },
  },
  methods: {
    goToUrl() {
      if (this.url) {
        window.location.href = this.url;
      }
    },
  },
};
</script>

<style scoped>
.card-content-container {
  cursor: pointer;
  background-color: white;
  height: 23rem;
  width: 22rem;
  border-radius: 10px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pdf-image-container,
.people-image-container {
  width: 100%;
  height: 75%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
}

.pdf-image-container img,
.people-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

.card-content-container:hover img {
  transform: scale(1.05);
}

.people-details-container {
  width: 100%;
  height: 25%;
  padding: 1rem;
  overflow: hidden;
}

.people-details-container h3,
.people-details-container p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
