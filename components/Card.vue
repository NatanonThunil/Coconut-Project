<template>
  <NuxtLinkLocale :to="url" class="cards">
    <div class="card-image">
      <img :src="image" alt="Card Image" draggable="false"/>
      <div class="card-text">
        <h2 class="ct">{{ title }}</h2>
        <p class="ct1">{{ description }}</p>
      </div>
    </div>
  </NuxtLinkLocale>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  url: {
    type:String,
    required:true,
  }
});
</script>

<style scoped>
.cards {
  overflow: hidden;
  height: 512px;
  width: 400px;
  background-color: #ffffff;
  border-style: solid;
  border-width: 2px;
  border-color: #1a1a1a;
  border-radius: 2cap;
}

.card-image img {
  height: 400px;
  width: 400px;
  border-radius: 1cap 1cap 0cap 0cap;
}

.card-text {
  text-align: left;
  margin-left: 20px;
}

.ct1 {
  margin-top: 2px;
}
</style>