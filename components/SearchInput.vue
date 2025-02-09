<template>
  <label class="searchbar">
    <img :src="scopeico" alt="Search" />
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
import scopeico from '/assets/icon/search.svg';

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
/* Search Bar Container */
.searchbar {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  transition: border-color 0.3s ease-in-out;
}

/* Search Icon */
.searchbar img {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

/* Input Field */
.searchbar input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 6px;
  color: #333;
  background: transparent;
}

/* Search Bar Focus */
.searchbar:focus-within {
  border-color: #4E6D16;
  box-shadow: 0 0 4px rgba(78, 109, 22, 0.5);
}

/* Hover Effect */
.searchbar:hover {
  border-color: #4E6D16;
}
</style>
