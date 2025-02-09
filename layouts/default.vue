<template>
  <header>
   
    
 
  </header>
  <main>
    <slot />
  </main>
  <NewFooter />
</template>
<script>
export default {
  mounted() {
    window.scrollTo(0, 0);
  }
}</script>
