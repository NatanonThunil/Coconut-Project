<template>
  <label class="search-v-input">
    <img src="/icon/search.svg" />
    <input
      type="text"
      :placeholder="placeholder"
      v-model="searchText"
      @input="emitSearch"
    />
  </label>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import scopeico from '/icon/search.svg';

const props = defineProps({
  placeholder: {
    type: String,
    default: "Search...",
  }
});

const searchText = ref('');

const emit = defineEmits(["update:search"]);

const emitSearch = () => {
  emit("update:search", searchText.value);
};
</script>

<style scoped>
label.search-v-input {
  transition: ease-in-out 0.5s;
  display: flex;
  justify-self: center;
  width: 60%;
  height: 3rem;
  outline: 3px solid #4e6d16;
  border-radius: 10px;
  overflow: hidden;
  cursor: text;
  animation: btnexpand 0.5s ease-in-out forwards;
}

label.search-v-input:hover {
  outline: 4px solid #4e6d16;
}

label.search-v-input img {
  display: flex;
  align-self: center;
  padding-left: 0.5rem;
  width: 10%;
  height: 2rem;
}

label.search-v-input input {
  all: unset;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow: hidden;
  width: 90%;
}
@keyframes btnexpand {
  0% {
    opacity: 0;
    width: 20%;
  }
  100% {
    opacity: 1;
    width: 60%;
  }
}
</style>


