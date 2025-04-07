<template>
    <div ref="container">
      <!-- Render slot content only when visible -->
      <div v-if="isVisible">
        <slot></slot>
      </div>
      <!-- Placeholder to preserve layout (adjust height as needed) -->
      <div v-else :style="{ height: placeholderHeight }"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: "LazyLoadCard",
    props: {
      // Allow passing a placeholder height to ensure layout consistency
      placeholderHeight: {
        type: String,
        default: "300px"
      }
    },
    data() {
      return {
        isVisible: false
      };
    },
    mounted() {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.isVisible = true;
              obs.disconnect();
            }
          });
        },
        {
       
          rootMargin: "100px"
        }
      );
      observer.observe(this.$refs.container);
    }
  };
  </script>
  