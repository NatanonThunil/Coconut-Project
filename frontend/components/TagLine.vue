<template>
  <div class="hero-bar">
    <div class="background" :style="{
      backgroundImage: `url(${heado.image})`,
      backgroundAttachment: 'fixed'


    }"></div>
    <div class="overlay"></div>

    <div v-if="heado.text" ref="taglineRef" :style="{
      top: `calc(${heado.y ?? 0}% - ${textHeight / 2}px)`,
      left: `calc(${heado.x ?? 0}% - ${textWidth / 2}px)`
    }" class="tagline-text" v-html="locale === 'th' ? heado.text : heado.text_en">
    </div>
    <h1 v-else>Loading tagline...</h1>
    <label class="scrollnav">
      <div>{{ $t('scroll_down') }}</div>
      <div class="tar">▲</div>
    </label>
  </div>



</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, watchEffect, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useHerobars } from '~/composables/useHerobars'

const { getHerobarById } = useHerobars()


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

const hidewhenstartscroll = () => {
  const scrollnav = document.querySelector('.scrollnav');
  if (!scrollnav) return;

  if (window.scrollY > 10) {
  
    let opacity = Math.max(1 - (window.scrollY - 10) / 100, 0);
    scrollnav.style.opacity = opacity.toString();
  } else {

    scrollnav.style.opacity = "0.7";
  }
};

window.addEventListener("scroll", hidewhenstartscroll);


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
  window.addEventListener('scroll', hidewhenstartscroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTextHW);
});

watchEffect(updateTextHW);
</script>


<style scoped>
.tar{
transform: rotate(180deg);
  

}
.scrollnav {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: clamp(0.5rem, 1.5vw, 1.5rem);
  text-align: center;
  opacity: 0.7;
  animation: bounce 2s infinite;
}

.hero-bar {
  position: relative;
  width: 100%;
  height: 100dvh;
  aspect-ratio: 8/3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.background {
  position: absolute;
  width: 100%;
  height: 100dvh;
  background-attachment: fixed;
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  z-index: -2;
  animation: fadeInBg 1s ease-out;


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

@keyframes bounce {

  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }

  50% {
    transform: translateX(-50%) translateY(-10px);
  }
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

@keyframes fadeInBg {
  from {
    filter: brightness(0);

  }

  to {

    filter: brightness(1);
  }
}

.background,
.bg-fixed {
  backface-visibility: hidden;
}

@media (max-width: 1024px) {
  .scrollnav {
    display: none;
  }

  .hero-bar {
    height: 30rem;

  }

  .background {

    height: 30rem;
    background-size: 80rem;


  }
}




@media (max-width: 768px) {
  .hero-bar {
    height: 60dvh;
  }

  .background {
    background-size: 90rem;
    height: 100%;
    background-position: center top;
  }
}

@media (max-width: 425px) {
  .hero-bar {

    height: 40dvh;
  }

  .background {
    height: 40dvh;
    background-size: 60rem;
  }
}
</style>
