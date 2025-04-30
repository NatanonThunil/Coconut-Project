<template>
    <footer class="footer">
        <section class="footer-nav">
            <NuxtLinkLocale v-for="(item, index) in links" :key="index" :to="item.to">
                {{ $t(item.label) }}
            </NuxtLinkLocale>
        </section>
        <section style="width: 60%; height: 2px; background-color: white; margin: 1rem;"></section>
        <section class="ft-contract-us">
            <h1>{{ $t("ContactUs") }}</h1>
            <div class="ft-contract">{{ (currentLocale === 'th' )? footer.text : footer.text_en}}</div>
        </section>
        <section class="cpr">
            <div>{{ (currentLocale === 'th' )? footer.credit : footer.credit_en}}</div>
        </section>

    </footer>
</template>

<script setup>
import { useFooters } from '~/composables/useFooters'
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
const { getFooters, getFooterById } = useFooters(); // Ensure getFooterById is imported
// Locale
const { locale } = useI18n();
const currentLocale = computed(() => locale.value);

// Links for footer nav
const links = [
  { to: "/", label: "Home" },
  { to: "/AboutUs", label: "AboutUs" },
  { to: "/News", label: "News" },
  { to: "/Events", label: "Events" },
  { to: "/coconut-information", label: "CoconutInfo" },
  { to: "/Experts", label: "Experts" },
  { to: "/FAQs", label: "FAQs" }
];

// Footer content
const footer = ref({
    text: '',
    text_en: '',
    credit: 'Copyright © Coconut Knowledge Hub สำนักวิชาเทคโนโลยีสารสนเทศ มหาวิทยาลัยแม่ฟ้าหลวง',
    credit_en: 'Copyright © Coconut Knowledge Hub Faculty of Information Technology, Mae Fah Luang University',
  });
// Fetch footer data
const fetchData = async () => {
    try {
        const data = await getFooterById(1);

        
        footer.value.text = data?.text || '';
        footer.value.text_en = data?.text_en || '';
        footer.value.credit = data?.credit || footer.value.credit;
        footer.value.credit_en = data?.credit_en || footer.value.credit_en;
    } catch (error) {
        console.error('Error fetching footer:', error);
    }
};

onMounted(fetchData);
</script>



<style scoped>
.ft-contract-us {
    display: flex;
    flex-direction: column;
    color: white;
    align-items: center;
}

.ft-contract-us a {
    color: white;
}

.ft-contract-us a:hover {

    color: white;
}

.footer {
    flex-direction: column;
    height: inherit;
    background-image: linear-gradient(#4E6D16, #2f3f10);
    display: flex;
    align-items: center;
    justify-content: center;

}

.footer-nav {

    padding-top: 1rem;
    display: flex;
    gap: 2rem;

}



.footer-nav a {
    color: white;
    transition: ease-in-out 0.3s;
}

.footer-nav a:hover {
    font-weight: 800;
    text-decoration-line: underline;
}

.cpr {
    border-radius: 1px;

    width: 100%;

    padding: 0.5rem;
    color: white;
}

.cpr div {
    display: flex;
    justify-content: center;
}
</style>