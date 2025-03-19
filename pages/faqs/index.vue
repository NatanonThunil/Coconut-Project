<template>
    <Navbar selecto="faqs" />
    <div style="height: 8rem"></div>
    <div class="faqs-path">
        <NuxtLinkLocale to="/faqs">FAQs</NuxtLinkLocale>
    </div>
    <div style="height: 1rem"></div>
    <h1 class="context-header">FAQs</h1>
    <div style="height: 5rem"></div>
    <div style="height: 1rem"></div>
    <ContentHeader :contexto=" $t('Qs') " />
    <div style="height: 1rem"></div>
    <div class="faq-container">
        <Faqquestions v-for="faq in activeFaqs.slice(0, 5)" :key="faq.id"
            :question="currentLocale === 'th' ? faq.question : faq.question_en"
            :answer="currentLocale === 'th' ? faq.answer : faq.answer_en" />
        <SeeAllButton :text="$t('seeAllQs')" link="/faqs/question" />
    </div>

    <div style="height: 3rem"></div>
    <ContentHeader :contexto="$t('expertsadvice')" />
    <div style="height: 1rem"></div>
    <div class="faq-container">
        <Faqquestions v-for="faq in adviceFaqs.slice(0, 5)" :key="faq.id"
            :question="currentLocale === 'th' ? faq.question : faq.question_en"
            :answer="currentLocale === 'th' ? faq.answer : faq.answer_en" />
        <SeeAllButton :text="$t('seeAllEsA')" link="/faqs/advice" />
    </div>

    <div style="height: 5rem"></div>
</template>

<script setup>
import "@/pages/faqs/m-faqs.css"
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
const faqs = ref([]);
const currentLocale = computed(() => locale.value);

const fetchapi = async () => {
    try {
        const response = await fetch('/api/faqs', {
      headers: {
       "CKH": '541986Cocon',
       
      },
    });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.faqs) {
            faqs.value = data.faqs.map(item => ({
                id: item.id,
                question: item.question,
                question_en: item.question_en || item.question,
                answer: item.answer,
                answer_en: item.answer_en || item.answer,
                status: item.status,
                isadvice: item.isadvice
            }));
        } else {
            console.warn('No FAQs found in response:', data);
        }

        console.log(faqs.value);
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

onMounted(fetchapi);

const activeFaqs = computed(() =>
    faqs.value.filter(faq => faq.status && !faq.isadvice).sort((a, b) => b.id - a.id)
);
const adviceFaqs = computed(() =>
    faqs.value.filter(faq => faq.status && faq.isadvice).sort((a, b) => b.id - a.id)
);
</script>
