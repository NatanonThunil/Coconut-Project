<template>
  <Navbar selecto="news" />

  <div style="height: 10rem"></div>
  <h3 class="header-content">{{ $t("Achivement") }}</h3>
  <Cardachivement
    :image="'https://student-cms.prd.timeshighereducation.com/sites/default/files/styles/default/public/istock-151597880.jpg?itok=zv65Onys'"
  />
  <div style="height: 5rem"></div>
</template>

<style scoped>
.header-content {
  color: #aca8a8;
  margin-left: 2%;
  font-weight: 300;
}
</style>
