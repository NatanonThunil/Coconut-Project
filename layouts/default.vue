<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>
<script>
export default {
  mounted() {
    window.scrollTo(0, 0);
  }
}</script>