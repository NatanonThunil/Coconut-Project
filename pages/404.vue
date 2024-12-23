<template>
    <div class="not-found">
      <h1>Oops! Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <NuxtLink to="/">Go back to Home</NuxtLink>
    </div>
  </template>
  
  <script setup>
    // You can add custom logic or fetch data if needed here
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: 50px;
  }
  .not-found h1 {
    font-size: 3rem;
    color: #ff6347;
  }
  .not-found p {
    font-size: 1.5rem;
    color: #555;
  }
  </style>
  