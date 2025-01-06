
<template>
    <Navbar selecto="events"/>
    <div style="height: 10rem;"></div>
    <h1 class="context-header">{{ $t('Events') }}</h1>
    <div style="height: 5rem;"></div>
    <SearchButton/>
    <div class="hot-news-section"></div>
    <ContentHeader :contexto="$t('Events')"/>
</template>

<style scoped>
h1.context-header {
    text-align: center;
   
}
</style>