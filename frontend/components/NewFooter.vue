<template>
    <footer class="footer">
        <!-- nav -->
        <section class="footer-nav">
            <NuxtLinkLocale v-for="(item, index) in links" :key="index" :to="item.to">
                {{ $t(item.label) }}
            </NuxtLinkLocale>
        </section>

        <section style="width: 60%; height: 2px; background-color: white; margin: 1rem;"></section>

        <!-- sponsors -->
        <section class="footers-sponsors"
            style="display:flex; align-items:center; justify-content:center; flex-wrap:wrap;">
            <!-- loading skeletons -->
            <template v-if="loading">
                <div v-for="n in 4" :key="'sk-' + n"
                    style="width:120px; height:60px; margin:0 1rem; background:rgba(255,255,255,.2); border-radius:12px; animation:pulse 1.2s infinite;">
                </div>
            </template>

            <!-- sponsors (padded to >= 4) -->
            <template v-else>
                <a v-for="sp in sponsorsPadded" :key="sp.id" :href="sp.url || '#'" :target="sp.url ? '_blank' : null"
                    rel="noopener" style="display:inline-flex; align-items:center;">
                    <img :src="sp.logo" :alt="sp.alt || 'Sponsor'"
                        style="max-height:60px; margin:0 1rem; object-fit:contain;" />
                </a>
            </template>
        </section>

        <!-- contact -->
        <section class="ft-contract-us">
            <h1>{{ $t('ContactUs') }}</h1>
            <div class="ft-contract">{{ (currentLocale === 'th') ? footer.text : footer.text_en }}</div>
        </section>

        <!-- credit -->
        <section class="cpr">
            <div>{{ (currentLocale === 'th') ? footer.credit : footer.credit_en }}</div>
        </section>
    </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// composables
import { useFooters } from '~/composables/useFooters'
import { useSponsors } from '~/composables/useSponsors'

const FOOTER_ID = 1
const MIN_SPONSORS = 4

// i18n
const { locale } = useI18n()
const currentLocale = computed(() => locale.value)

// footer text
const { getFooterById } = useFooters()
const footer = ref({
    text: '',
    text_en: '',
    credit: 'Copyright © Coconut Knowledge Hub สำนักวิชาเทคโนโลยีสารสนเทศ มหาวิทยาลัยแม่ฟ้าหลวง',
    credit_en: 'Copyright © Coconut Knowledge Hub Faculty of Information Technology, Mae Fah Luang University',
})

// sponsors CRUD/state
const {
    sponsors, loading, error,
    fetchSponsorsToState,
} = useSponsors()

// links
const links = [
    { to: '/', label: 'Home' },
    { to: '/AboutUs', label: 'AboutUs' },
    { to: '/News', label: 'News' },
    { to: '/Events', label: 'Events' },
    { to: '/coconut-information', label: 'CoconutInfo' },
    { to: '/Experts', label: 'Experts' },
    { to: '/FAQs', label: 'FAQs' }
]

// computed: list by footer
const sponsorList = computed(() => (sponsors.value?.[FOOTER_ID] || []))

// ถ้าน้อยกว่า 4 ให้เติม placeholder ให้ครบ 4
const sponsorsPadded = computed(() => {
    const list = sponsorList.value
    if (list.length >= MIN_SPONSORS) return list
    const missing = MIN_SPONSORS - list.length
    const placeholders = Array.from({ length: missing }).map((_, i) => ({
        id: -(i + 1),            // key ไม่ชนกับของจริง
        footer_id: FOOTER_ID,
        logo: '/img/placeholder-sponsor.png', // วางไฟล์นี้ใน public/ หรือแก้ path ตามโปรเจกต์
        url: '',
        alt: 'Your logo here'
    }))
    return [...list, ...placeholders]
})


const fetchData = async () => {
    try {
        const data = await getFooterById(FOOTER_ID)
        footer.value.text = data?.text || ''
        footer.value.text_en = data?.text_en || ''
        footer.value.credit = data?.credit || footer.value.credit
        footer.value.credit_en = data?.credit_en || footer.value.credit_en
    } catch (e) {
        console.error('Error fetching footer:', e)
    }

    try {
        await fetchSponsorsToState(FOOTER_ID)
    } catch (e) {
        console.error('Error fetching sponsors:', e)
    }
}

onMounted(fetchData)
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
@keyframes pulse {
  0% { opacity: .5; }
  50% { opacity: .9; }
  100% { opacity: .5; }
}
</style>