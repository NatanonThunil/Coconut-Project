<template>
    <Navbar selecto="aboutus" />
    <div style="height: 8rem"></div>
    <div class="faqs-path">
        <NuxtLinkLocale to="/aboutus">{{ $t("AboutUs") }}</NuxtLinkLocale>/ 
        <NuxtLinkLocale to="/aboutus/achievements">{{ $t("Achievements") }}</NuxtLinkLocale>/ 
        <NuxtLinkLocale :to="'/aboutus/achievements/details/'+this.$route.params.id">{{ achievement?.title || 'ไม่มีหัวข้อ' }}</NuxtLinkLocale>
    </div>
    <div style="height: 2rem"></div>
    <div class="achievement-content-container">
        <section class="achievements-pdf-container">
            <img v-if="achievement?.thumbnail" :src="achievement?.thumbnail" alt="" draggable="false" />
            <img v-else :src="'https://placehold.co/600x400'" alt="" draggable="false" />
            <button @click="previousPage" :disabled="currentPage <= 1">previous</button>
            {{ currentPage }}/{{ totalPages }}
            <button @click="nextPage" :disabled="currentPage >= totalPages">next</button>
        </section>
        <section class="achievements-text-container">
            <div class="achievements-text-details-container">
                <h1>{{ achievement?.title }}</h1>
                <label>
                    <p>อัพโหลดเมื่อ {{ formatDate(achievement?.uploadDate) }}</p>
                    <p>โดย {{ achievement?.author }}</p>
                </label>
                <div style="height: 1rem"></div>
                <h3>คำอธิบาย</h3>
                <p class="details-container">{{ achievement?.description }}</p>
            </div>
            <SeeAllButton text="ดูผลงานอื่น" link="/aboutus/achievements/" />
        </section>
    </div>
    <div style="height: 2rem"></div>
</template>

<script>
import { ref } from 'vue';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Set the worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

export default {
    data() {
        return {
            achievement: null,
            error: null,
            pdfInstance: null,
            currentPage: 1,
            totalPages: 0,
        };
    },
    async mounted() {
        const cid = this.$route.params.id;
        try {
            const response = await fetch(`/api/achievements/${cid}`, {
                headers: { "CKH": '541986Cocon' }
            });

            if (!response.ok) throw new Error('Failed to fetch achievement details');

            const data = await response.json();
            if (data.achievement) {
                this.achievement = data.achievement;
                if (this.achievement.pdf) {
                    await this.loadPdf(this.achievement.pdf);
                }
            } else {
                throw new Error('Achievement not found');
            }

        } catch (error) {
            console.error('Error fetching achievement details:', error);
            this.error = 'Failed to load achievement data. Please try again later.';
        }
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
        async loadPdf(pdfUrl) {
            try {
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                this.pdfInstance = await loadingTask.promise;
                this.totalPages = this.pdfInstance.numPages;
                await this.renderPage(this.currentPage);
            } catch (error) {
                console.error('Error loading PDF:', error);
            }
        },
        async renderPage(pageNumber) {
            try {
                const page = await this.pdfInstance.getPage(pageNumber);
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const renderContext = { canvasContext: context, viewport };
                await page.render(renderContext).promise;

                this.achievement.thumbnail = canvas.toDataURL();
            } catch (error) {
                console.error('Error rendering page:', error);
            }
        },
        async previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                await this.renderPage(this.currentPage);
            }
        },
        async nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                await this.renderPage(this.currentPage);
            }
        },
    }
};
</script>

<style scoped>
.details-container {
    padding: 0.5rem;
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
.achievements-text-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.achievements-pdf-container img {
    aspect-ratio: 1/1.414;
    object-fit: cover;
    height: 70dvh;
}
.achievements-pdf-container {
    padding: 0.5rem;
    background-color: rgb(1, 1, 1, 0.2);
    border-radius: 10px;
}
.achievement-content-container {
    display: flex;
    flex-direction: row;
    background-color: rgb(241, 241, 241);
    box-shadow: 0px 0px 16px rgb(0, 0, 0, 0.3);
    padding: 1rem;
    width: 80%;
    margin: 0 auto;
    border-radius: 10px;
}
</style>
