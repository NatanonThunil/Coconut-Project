<template>
  <div class="hero-bar" 
    :style="{ 
      backgroundImage: `url(${heado.image || Taglineimg})`, 
      backgroundAttachment: isFixed ? 'fixed' : 'scroll' 
    }">
    
    <div class="overlay"></div>

    <div 
      v-if="heado.text" 
      ref="taglineRef"
      :style="{ 
        top: `${heado.y ?? 0}%`, 
        left: `calc(${heado.x ?? 0}% - ${textWidth / 2}px)` 
      }"
      class="tagline-text"
      v-html="locale === 'th' ? heado.text : heado.text_en">
    </div>

    <h1 v-else>Loading tagline...</h1>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import Taglineimg from "@/assets/img/tl.png"
export default {
  props: {
    isFixed: {
      type: Boolean,
      default: false, 
    }
  },
  setup(props) {
    const taglineRef = ref(null);
    const textWidth = ref(0);
    const textHeight = ref(0);
    const { locale } = useI18n();
    
    const heado = ref({
      text: "Loading...",
      text_en: "",
      x: 50, 
      y: 50, 
      image: "@/assets/img/tl.png",
    });


    const updateTextWidth = () => {
      if (taglineRef.value) {
        textWidth.value = taglineRef.value.getBoundingClientRect().width;
      }
    };

  
    const fetchTagline = async () => {
      try {
        const response = await fetch("/api/headline");
        if (!response.ok) throw new Error(`Failed to fetch data, Status: ${response.status}`);

        const data = await response.json();
        console.log("API Response:", data);

        if (data.headline) {
          heado.value = {
            ...data.headline,
            text: data.headline.text || "No tagline available.",
            text_en: data.headline.text_en || "No tagline available.",
            x: data.headline.x ?? 50, 
            y: data.headline.y ?? 50, 
            image: data.headline.image || "_nuxt/assets/img/tl.png",
          };

          
          await nextTick();
          updateTextWidth();
        } else {
          console.warn("Headline not found:", data.message);
          heado.value.text = "No tagline available.";
        }
      } catch (error) {
        console.error("Error fetching headline:", error);
        heado.value.text = "Failed to load tagline.";
      }
    };

    onMounted(fetchTagline);

 
    watchEffect(() => {
      updateTextWidth();
    });

    return { heado, locale, isFixed: props.isFixed, taglineRef, textWidth };
  },
};
</script>

<style scoped>
.hero-bar {
  position: relative;
  width: 100%;
  height: 80vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: FadeInImage 0.3s ease-in-out forwards;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); 
}


.tagline-text {
  position: absolute;
  color: white;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
  text-align: center;
  transform: translateY(-50%);
  opacity: 0;
  animation: fadeInText 1s ease-out 0.5s forwards;
  max-width: 600px;
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
</style>
