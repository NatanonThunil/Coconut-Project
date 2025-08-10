<template>
  <div class="hero-bar">
    <div class="background" :style="{
      backgroundImage: `url(${heado.image})`,
      backgroundAttachment: isFixed ? 'fixed' : 'scroll'
    }"></div>
    <div class="overlay"></div>

    <div v-if="heado.text" ref="taglineRef" :style="{
      top: `calc(${heado.y ?? 0}% - ${textHeight / 2}px)`,
      left: `calc(${heado.x ?? 0}% - ${textWidth / 2}px)`
    }" class="tagline-text" v-html="locale === 'th' ? heado.text : heado.text_en">
    </div>
    <h1 v-else>Loading tagline...</h1>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, watchEffect, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useHerobars } from '~/composables/useHerobars'

const { getHerobarById } = useHerobars()

defineProps({
  isFixed: {
    type: Boolean,
    default: false,
  }
});

const apibase = useRuntimeConfig().public.apiBase;
const taglineRef = ref(null);
const textHeight = ref(0);
const textWidth = ref(0);
const { locale } = useI18n();

const heado = ref({
  text: "Loading...",
  text_en: "",
  x: 50,
  y: 50,
  image: "/img/tl.png",
});

const updateTextHW = () => {
  if (taglineRef.value) {
    const rect = taglineRef.value.getBoundingClientRect();
    textWidth.value = rect.width;
    textHeight.value = rect.height;
  }
};


const fetchTagline = async () => {
  try {
    const data = await getHerobarById(1);
    heado.value = {
      text: data.text || "No tagline available.",
      text_en: data.text_en || "No tagline available.",
      x: data.x ?? 50,
      y: data.y ?? 50,
      image: data.image || "/img/tl.png",
    };

    await nextTick();
    updateTextHW();
  } catch (error) {
    console.error("Error fetching headline:", error);
    heado.value.text = "Failed to load tagline.";
  }
};


watch(locale, async () => {
  await nextTick();
  updateTextHW();
});

onMounted(() => {
  fetchTagline();
  window.addEventListener('resize', updateTextHW);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTextHW);
});

watchEffect(updateTextHW);
</script>


<style scoped>
.hero-bar {
  position: relative;
  width: 100%;
  aspect-ratio: 8/3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; 
}

.background {
  position: absolute;
  width: 100%;
  height: 100%; 
  background-size: contain; 
  background-position: top center;
  background-repeat: no-repeat;
  z-index: -2;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: -1;
}
.tagline-text {
  position: absolute;
  color: white;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
  text-align: center;
  transform: translateY(-50%);
  opacity: 0;
  animation: fadeInText 1s ease-out 0.5s forwards;
  font-size: clamp(0.5rem, 1.1vw, 2rem);

  width: auto;
  white-space: nowrap;
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

@keyframes fadeInImage {
  0% {

    transform: scale(1.1);
  }

  100% {

    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .hero-bar {
    height: 60dvh;
  }
  .background {
    background-size: cover; 
    height: 100%;
    background-position: center top;
  }
}
</style>
