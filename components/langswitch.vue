<template>
  <div :class="$attrs.class">
    <div class="locale-switcher">
      <label class="switch">
        <input type="checkbox" @change="changeLocale" :checked="locale === 'th'" />
        <span class="slider round">
          <span class="switch-text left">EN</span>
          <span class="switch-text right">TH</span>
        </span>
      </label>
    </div>

    <button v-show="Ismobile" class="mobile-language-change" @click="changeLocale">
      <div class="text-btn-container">
        <div :class="{ activeMobile: locale === 'th' }">TH</div>
        <div>/</div>
        <div :class="{ activeMobile: locale === 'en' }">EN</div>
      </div>
    </button>
  </div>
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

<script>
export default {
  name: 'Langswitch',
  inheritAttrs: false,
  props: {
    Ismobile: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 5rem;
  height: 3rem;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #4E6D16;
  transition: 0.4s;
  border-radius: 10px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 2.5rem;
  width: 50%;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 5px;
}

input:checked + .slider {
  background-color: #4E6D16;
}

input:checked + .slider:before {
  transform: translateX(32px);
}

.switch-text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #4E6D16;
  transition:  0.3s ease;
  pointer-events: none;
}

.left {
  left: 16px;
  opacity: 1;
}

.right {
  right: 12px;
  opacity: 1;
  color: white;
}

input:checked + .slider .left {
  opacity: 1;
  color: white;
  left: 12px;
}

input:checked + .slider .right {
  opacity: 1;
  color: #4E6D16;
  right: 16px;
}

.mobile-language-change {
  all: unset;
  display: flex;
  justify-content: center;
  padding: 0.45rem;
  height: 100%;
  width: 100%;
  transition: transform 0.3s ease;
}

.mobile-language-change:hover {
  transform: scale(1.05);
}

.mobile-language-change .text-btn-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  transition:  0.3 ease-in-out;
  
}

.mobile-language-change .text-btn-container div{
  transition:  0.3 ease-in-out;
  
}


.activeMobile {
  color: #4E6D16;
  font-weight: 700;
  transform: scale(1.5);
  
  
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1039px) {
  .locale-switcher {
    display: none;
  }
}
</style>
