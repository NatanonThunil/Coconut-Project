<template>
  <header>
  </header>
  <main>
    <div class="admin-content">
      <section class="admin-content-l">
        <Adminsidebar />
      </section>
      <section class="admin-content-r">
        <slot />
      </section>
    </div>
  </main>

</template>
<script>
export default {
  mounted() {
    window.scrollTo(0, 0);
  }
  
}
</script>

<style scoped>
.admin-content {
  display: flex;
  height: 100dvh;

}

.admin-content-l {
  display: flex;

}

.admin-content-r {

  margin-left: 250px;
  width: calc(100% - 250px);


}
</style>