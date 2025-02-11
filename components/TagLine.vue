<template>
  <div class="hero-bar" :style="{ backgroundImage: `url(${heado.image})` }">
    <div class="overlay"></div>

    <h1 
      v-if="heado.text" 
      :style="{ top: `${heado.y}px`, left: `${heado.x}px` }"
    >
      {{ locale === "th" ? heado.text : heado.text_en }}
    </h1>
    <h1 v-else>Loading tagline...</h1>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { locale } = useI18n();
    const heado = ref({
      text: "Loading...",
      text_en: "",
      x: 0, 
      y: 0, 
      image: "/img/tl.png",
    });

    const fetchTagline = async () => {
      try {
        const response = await fetch("/api/headline");
        if (!response.ok) throw new Error(`Failed to fetch data, Status: ${response.status}`);

        const data = await response.json();
        console.log("API Response:", data);

        if (data.success && data.headline) {
          heado.value = {
            ...data.headline,
            text: data.headline.text || "No tagline available.",
            text_en: data.headline.text_en || "No tagline available.",
            x: data.headline.x || 50,
            y: data.headline.y || 50,
            image: data.headline.image || "/img/tl.png",
          };
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

    return { heado, locale };
  },
};
</script>

<style scoped>
.hero-bar {
  position: relative;
  width: 100%;
  height: 70dvh;
  background-size: cover;
  background-position: top center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 1;
  background: black;
  animation: fadeInOverlay 0.5s ease-in-out forwards;
}

h1 {
  position: absolute;
  color: white;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
  font-size: 2.5em;
  text-align: center;
  opacity: 0;
  animation: fadeInText 1s ease-out 0.5s forwards;
  z-index: 2;
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

@keyframes fadeInOverlay {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}
</style>
