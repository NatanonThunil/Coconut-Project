<template>
  <div v-show="!Ismobile" class="locale-switcher">
    <button class="toggle-button" @click="changeLocale">
      <span :class="{ active: locale === 'en' }">EN</span>
      <span :class="{ active: locale === 'th' }">TH</span>
    </button>
  </div>

  <button v-show="Ismobile" class="mobile-language-change" @click="changeLocale">
    <div class="text-btn-container">
      <div :class="{ activeMobile: locale === 'th' }">TH</div>
      <div>/</div>
      <div :class="{ activeMobile: locale === 'en' }">EN</div>
    </div>
  </button>
</template>


<script setup>
import { useI18n } from 'vue-i18n';
const { locale, setLocale } = useI18n();

defineProps({
  Ismobile: {
    type: Boolean,
    required: true,
  },
});



const changeLocale = () => {
  const lang = locale.value === 'th' ? 'en' : 'th';
  setLocale(lang);
};


</script>

<style scoped>
.locale-switcher {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 60%;
  font-family: 'Arial', sans-serif;
}

.toggle-button {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 5rem;
  height: 100%;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  overflow: hidden;
  border: #4E6D16 3px solid;
}

.toggle-button span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  font-size: 0.85rem;
  font-weight: bold;
  color: rgb(0, 0, 0);
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.toggle-button span.active {
  background-color: #4E6D16;
  color: white;

  opacity: 1;
}

.locale-label {
  font-size: 1rem;
  color: #000000;
}

.mobile-language-change {
  all: unset;
  display: flex;
  justify-content: center;
  padding: 0.45rem;
  height: 100%;
  width: 100%;
 

}
.mobile-language-change .text-btn-container {
gap: 0.5rem;
  display: flex;
  

}


.activeMobile {
  color: #4E6D16;
  font-weight: 700;
}

@media (max-width: 1039px) {
  .locale-switcher {

    display: none;
  }


}
</style>
