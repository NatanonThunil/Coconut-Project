<template>
  <Navbar selecto="aboutus" />
  
  <div style="height: 10rem"></div>
  <h3 class="header-content">{{ $t("Achievement") }}</h3>
  
  <div class="card-achivments-container">
    <Achievemento 
      v-for="achievement in Achievements" 
      :key="achievement.id" 
      :picture="achievement.thumbnail || 'https://placehold.co/600x400'"
      :title="achievement.title" 
      :text="achievement.description" 
      :url="`/aboutus/achievements/details/${achievement.id}`" 
      color="white"
      :author="achievement.author"
    />
  </div>
  
  <div style="height: 5rem"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/build/pdf.worker';

const Achievements = ref([]);

const fetchAchievements = async () => {
  try {
    const response = await fetch('/api/achievements');
    const { achievements } = await response.json();
    
    const filteredAchievements = achievements.filter(achievement => achievement.status === 1);
    
    // Generate thumbnails asynchronously
    await Promise.all(filteredAchievements.map(async (achievement) => {
      if (achievement.pdf && isValidPdfUrl(achievement.pdf)) {
        achievement.thumbnail = await generateThumbnail(achievement.pdf);
      }
    }));

    Achievements.value = filteredAchievements;
  } catch (e) {
    console.error('Error fetching achievements:', e);
  }
};

const isValidPdfUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const generateThumbnail = async (pdfUrl) => {
  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    if (!pdf.numPages) throw new Error('Invalid PDF structure');
    const page = await pdf.getPage(1);
    
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = { canvasContext: context, viewport };
    await page.render(renderContext).promise;
    
    return canvas.toDataURL();
  } catch (e) {
    console.error(`Error generating thumbnail for PDF: ${pdfUrl}`, e.message);
    return 'https://placehold.co/600x400';
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

.card-achivments-container {
  display: flex;
  flex-direction: column;
 width: 80%;
  justify-content: center;
  gap: 1rem;
  margin: 0% 10%;
}
</style>
