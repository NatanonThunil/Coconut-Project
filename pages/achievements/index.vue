<template>
  <Navbar selecto="news" />

  <div style="height: 10rem"></div>
  <h3 class="header-content">{{ $t("Achievement") }}</h3>
  <div class="card-achivments-container">
    <Cardachivement v-for="achievement in Achievements" :key="achievement.id" :image="achievement.image"
      :title="achievement.title" :details="achievement.description" :url="'/achievements/details/'+achievement.id"/>
  </div>
  <div style="height: 5rem"></div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
const Achievements = ref([]);

const fetchAchievements = async () => {
  try {
    const response = await $fetch('/api/achievements_table');
    Achievements.value = response.map((achievement) => ({
      ...achievement,
    }));
  } catch (e) {
    console.error(e);
  }
};
onMounted(fetchAchievements); 
</script>


<style scoped>
.header-content {
  color: #aca8a8;
  margin-left: 2%;
  font-weight: 300;
}
</style>
