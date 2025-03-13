<template>
  <div style="height: 10rem;"></div>
    <Navbar selecto="expert" />
  
  <h3 class="header-content">{{ $t('Expert') }}</h3>
  <div class="header-container">
    <h1>{{ $t('Experts') }}</h1>
  </div>

  <navbarexpert />
</template>

<style scoped>
.navcontainer {
  width: 100%;
  height: 100px;
  border: rgb(255, 255, 255) solid 2px;
}
.header-container {
  border: rgb(255, 255, 255) solid 3px;
  text-align: center;
  margin-top: 0;
  padding-top: 20px;
  font-size: 2rem;
}
.header-content {
  color: #ffffff;
  margin-left: 2%;
  font-weight: 300;
}
</style>
