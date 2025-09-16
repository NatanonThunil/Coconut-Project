<template :key="pageKey">

    <div style="height: 8rem"></div>
    <div class="faqs-path">
        <NuxtLinkLocale to="/">{{ $t('Home') }}</NuxtLinkLocale>/
        <NuxtLinkLocale to="/aboutus">{{ $t("AboutUs") }}</NuxtLinkLocale>/
        <NuxtLinkLocale to="/aboutus/achievements">{{ $t("Achievements") }}</NuxtLinkLocale>/
        <NuxtLinkLocale :to="'/aboutus/achievements/details/' + $route.params.id">
            {{ (currentLocale === "th") ? (achievement?.title || 'ไม่มีหัวข้อ') : (achievement?.title_en || 'No title')
            }}
        </NuxtLinkLocale>
    </div>
    <div style="height: 2rem"></div>
    <div class="achievement-content-container" v-if="achievement">
        <section class="achievements-pdf-container">
  <div class="pdf-container" v-if="showPdf && achievement?.pdf">
    <vue-pdf-embed
      :source="achievement.pdf"
      annotation-layer
      text-layer
      :page="currentPage"
      @loaded="handleDocumentLoad"
      @rendering-failed="handleDocumentError"
    />
    <div class="overlay-btn" v-show="showPdf && achievement?.pdf">
      <button class="view-btn" @click="previousPage" :disabled="currentPage <= 1">{{ $t("Previous") }}</button>
      {{ currentPage }}/{{ totalPages }}
      <button class="view-btn" @click="nextPage" :disabled="currentPage >= totalPages">{{ $t("Next") }}</button>
      <NuxtLinkLocale class="view-full-btn" :to="'https://coconut-kukps.com' + achievement.pdf" target="_blank" rel="noopener">
        {{ $t("ViewFull") || "View full" }}
      </NuxtLinkLocale>
    </div>
  </div>
  <img v-else :src="noimageHandle" alt="" draggable="false" />
</section>

        <section class="achievements-text-container">
            <div class="achievements-text-details-container">
                <h1>{{ (currentLocale === "th") ? (achievement?.title || 'ไม่มีหัวข้อ') : (achievement?.title_en ||'Notitle') }}</h1>
                <label>
                    <p>{{ $t("upload") }} {{ formatDate(achievement?.uploadDate) }}</p>
                    <p>{{ $t("By") }} {{ achievement?.author }}</p>
                </label>
                <div style="height: 1rem"></div>
                <h3>{{ $t("Description") }}</h3>
                <p class="details-container">{{ (currentLocale === "th") ? (achievement?.description ||  'ไม่มีคำอธิบาย') : (achievement?.description_en || 'ไม่มีคำอธิบาย') }}</p>
            </div>
            <SeeAllButton :text="$t('SeeAllAchievements')" link="/aboutus/achievements/" />
        </section>
    </div>
    <div v-else class="loading-container">Loading...</div>
    <div style="height: 2rem"></div>
</template>

<script setup>
import noimageHandle from '/img/no-image-handle.png';
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';
import VuePdfEmbed from 'vue-pdf-embed';
import 'vue-pdf-embed/dist/styles/annotationLayer.css';
import 'vue-pdf-embed/dist/styles/textLayer.css';
const { locale } = useI18n();
const currentLocale = computed(() => locale.value);
const route = useRoute();
import { useAchievements } from '~/composables/useAchievements';
const { getAchievementById } = useAchievements();
const achievement = ref(null);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(0);
const isLoadingPDF = ref(true);
const pdfError = ref(false);
const showPdf = ref(false);



const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const handleDocumentLoad = ({ numPages }) => {
    totalPages.value = numPages;
    isLoadingPDF.value = false;
};

const handleDocumentError = (error) => {
    console.error('Error loading PDF:', error);
    isLoadingPDF.value = false;
    pdfError.value = true;
};

const fetchAchievement = async () => {
    const cid = route.params.id;
    isLoadingPDF.value = true;
    achievement.value = null;
    showPdf.value = false;
    error.value = null;
    try {
        const data = await getAchievementById(cid);
        if (data) {
            achievement.value = data;

            // Wait for DOM update then enable PDF
            await nextTick();
            showPdf.value = true;

            if (!achievement.value.pdf) {
                isLoadingPDF.value = false;
            }
        } else {
            throw new Error('Achievement not found');
        }
    } catch (err) {
        console.error('Error fetching achievement details:', err);
        error.value = 'Failed to load achievement data. Please try again later.';
        isLoadingPDF.value = false;
    }
};

onMounted(fetchAchievement);

// Watch for route changes and refetch data
watch(() => route.params.id, fetchAchievement);
</script>

<style scoped>
.view-btn:hover {

    color: white;
    background-color: #4E6D16;
    text-align: center;
    outline: #4E6D16 solid 2px;
    border-radius: 10px;
    padding: 0.2rem 0.5rem;
    transform: scale(1.1);

}
.view-full-btn {
  all: unset;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  outline: #4E6D16 solid 2px;
  color: #4E6D16;
  background: white;
}

.view-btn:disabled {
    all: unset;

    color: #cfcfcf;
    background-color: white;
    text-align: center;
    outline: #cfcfcf solid 2px;
    border-radius: 10px;
    padding: 0.2rem 0.5rem;
}

.view-btn {
    all: unset;
    cursor: pointer;
    color: #4E6D16;
    background-color: white;
    text-align: center;
    outline: #4E6D16 solid 2px;
    border-radius: 10px;
    padding: 0.2rem 0.5rem;
    transition: 0.3s ease-in-out;
}

.overlay-btn:hover {
    opacity: 1;


}

.overlay-btn {
  position: absolute;
  left: 50%;
  bottom: 0.5rem;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  z-index: 10;
  opacity: 0.2;
  transition: opacity 0.3s ease-in-out;
  background: rgba(255,255,255,0.6); /* optional readability */
}

.pdf-container {
  position: relative;
  width: 100%;
  overflow: hidden;           /* keep everything inside */
  border-radius: 10px;
}

.details-container {
    padding: 0.5rem;
}

:deep(.vue-pdf-embed) {
  width: 100%;
  display: block;
}

/* Constrain the canvas the component renders */
:deep(.vue-pdf-embed canvas) {
  width: 100% !important;     /* scale to container */
  height: auto !important;    /* keep aspect ratio */
  max-width: 100%;
}

/* If you keep a fixed height viewport, allow internal scroll instead of overflow */
:deep(.vue-pdf-embed) {
  max-height: 500px;          /* matches your intended height */
  overflow: auto;             /* scroll inside, no spill outside */
}

.achievements-text-details-container label {
    display: flex;
    justify-content: space-between;
    background-color: rgb(230, 228, 228);
    padding: 1rem;
    border-radius: 10px;
}

.achievements-text-details-container h1 {
    font-size: 2.5rem;
}

.achievements-text-details-container {
    display: flex;
    flex-direction: column;
    width: 85%;
    margin: 0 auto;

}

.achievements-text-details-container p {
    font-size: clamp(0.8rem, 1vw, 1rem);


}


.achievements-text-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-wrap: break-word;
}

.achievements-pdf-container {
    max-width: 50%;
    padding: 0.5rem;
    background-color: rgb(1, 1, 1, 0.2);
    border-radius: 10px;
    flex: 0 1 60%;
    width: 90%;
    display: flex;
    justify-content: center;
}

.achievements-pdf-container img {

    width: 100%;

    object-fit: cover;

}

.pdf-container:hover .overlay-btn { opacity: 1; }
.loading-container {
    text-align: center;
    font-size: 1.2rem;
    color: gray;
    padding: 1rem;
}

.achievement-content-container {
  display: flex;

  flex-direction: row;
  gap: 1rem;
  background-color: rgb(241, 241, 241);
  box-shadow: 0 0 16px rgba(0,0,0,0.3);
  padding: 1rem;
  width: 80%;
  margin: 0 auto;
  border-radius: 10px;
  align-items: flex-start;
}
.achievements-pdf-container,
.achievements-text-container {

      
  flex: 1 1 50%;
  max-width: 50%;
}

/* Image fallback should never overflow */
.achievements-pdf-container img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Mobile: stack and go full width */
@media (max-width: 1000px) {
  .achievement-content-container { flex-direction: column; }
  .achievements-pdf-container,
  .achievements-text-container {
    max-width: 100%;
    flex-basis: 100%;
  }
}

@media (max-width: 1000px) {
    .achievement-content-container {
        flex-direction: column;

    }
    .achievements-pdf-container{
        display: flex;
        justify-self: center;
    }
}
</style>
