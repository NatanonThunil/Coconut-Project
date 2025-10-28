<template>
    <footer class="footer">
        <div class="footer-inner">
            <!-- nav -->
            <nav class="footer-nav" aria-label="Footer navigation">
                <NuxtLinkLocale v-for="(item, index) in links" :key="index" :to="item.to" class="footer-link">
                    {{ $t(item.label) }}
                </NuxtLinkLocale>
            </nav>

            <hr class="footer-divider" />
            <div style="display: flex; justify-self: center">
                <h2 class="ft-title">{{ $t('sponsor') }}</h2>
            </div>

            <!-- sponsors -->
            <!-- แสดง skeleton ขณะโหลด -->
            <section v-if="loading" class="footers-sponsors" aria-label="Sponsors">
                <div v-for="n in 4" :key="'sk-' + n" class="skeleton-logo"></div>
            </section>

            <!-- sponsors -->
            <section v-else-if="sponsorsPadded.length" class="footers-sponsors" aria-label="Sponsors">
                <a v-for="sp in sponsorsPadded" :key="sp.id" :href="sp.url || '#'" :target="sp.url ? '_blank' : null"
                    :rel="sp.url ? 'noopener noreferrer' : null" class="sponsor-item" :aria-label="sp.alt || 'Sponsor'">
                    <img :src="sp.logo" :alt="sp.alt || 'Sponsor'" loading="lazy" decoding="async" class="sponsor-logo"
                        @error="(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-sponsor.svg' }" />

                    <p v-if="sp.alt">{{ sp.alt }}</p>
                </a>
            </section>

            <!-- else: ไม่แสดง section ถ้าน้อยกว่า 4 -->

            <hr class="footer-divider" />

            <!-- contact -->
            <section class="ft-contract-us">
                <h2 class="ft-title">{{ $t('ContactUs') }}</h2>
                <p class="ft-contract">
                    {{ (currentLocale === 'th') ? footer.text : footer.text_en }}
                </p>
            </section>

            <!-- credit -->
            <section class="cpr">
                <div class="cpr-text">
                    {{ (currentLocale === 'th') ? footer.credit : footer.credit_en }}
                </div>
            </section>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFooters } from '~/composables/useFooters'
import { useSponsors } from '~/composables/useSponsors'

const FOOTER_ID = 1

const { locale } = useI18n()
const currentLocale = computed(() => locale.value)

const { getFooterById } = useFooters()
const footer = ref({
    text: '',
    text_en: '',
    credit:
        'Copyright © Coconut Knowledge Hub สำนักวิชาเทคโนโลยีสารสนเทศ มหาวิทยาลัยแม่ฟ้าหลวง',
    credit_en:
        'Copyright © Coconut Knowledge Hub Faculty of Information Technology, Mae Fah Luang University'
})

const { sponsors, loading, fetchSponsorsToState } = useSponsors()

const links = [
    { to: '/', label: 'Home' },
    { to: '/AboutUs', label: 'AboutUs' },
    { to: '/announcements/news', label: 'News' },
    { to: '/announcements/events', label: 'Events' },
    { to: '/coconut-information', label: 'CoconutInfo' },
    { to: '/Experts', label: 'Experts' },
    { to: '/FAQs', label: 'FAQs' }
]

// กันชนให้เป็น Array เสมอ เพื่อไม่ให้ .filter พัง
const sponsorList = computed(() => {
    const raw = sponsors.value?.[FOOTER_ID]
    return Array.isArray(raw) ? raw : []
})

const sponsorsPadded = computed(() => {
    const cleaned: any[] = []
    for (const s of sponsorList.value) {
        if (!s || !s.id || !s.logo) continue
        if (!cleaned.find(x => x.id === s.id)) cleaned.push(s)
    }
    cleaned.sort((a: any, b: any) => {
        const pa = Number.isFinite(a.position) ? a.position : a.id
        const pb = Number.isFinite(b.position) ? b.position : b.id
        return pa - pb
    })
    return cleaned // ไม่ slice ทิ้ง
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
/* ===== Layout / Theme (no :root) ===== */
.footer {
    background-color: #4E6D16;
    color: #ffffff;
    width: 100%;
}

.footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(16px, 3vw, 18px) clamp(16px, 4vw, 40px);
    display: grid;
    gap: clamp(0.5rem, 0.8vw, 2rem);
}

/* ===== Nav ===== */
.footer-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
    justify-content: center;
}

.footer-link {
    color: #ffffff;
    opacity: .9;
    text-decoration: none;
    padding: 6px 8px;
    border-radius: 8px;
    transition: all ease-in-out .06s;
    outline-offset: 2px;
}

.footer-link:hover {
    background: rgba(255, 255, 255, .12);
    transform: scale(1.05);
    opacity: 1;

}

.footer-link:focus-visible {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, .7);
}

/* Divider */
.footer-divider {
    width: min(92%, 1260px);
    height: 3px;
    border: 0;
    margin: 0 auto;
    border-radius: 10px;
    background: rgba(255, 255, 255, 1);
}

/* ===== Sponsors ===== */
.footers-sponsors {
    display: flex;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: clamp(10px, 2vw, 18px);
    margin: 0 auto;
    flex-wrap: wrap;
    align-items: center;
    justify-items: center;
}

.sponsor-item {
    display: inline-flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 8px;
    border-radius: 12px;
    transition: all .2s ease-in-out
}

.sponsor-item p {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -250%);
    /* keep your Y offset */
    background-color: #fff;
    color: #111;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
    opacity: 0;
    z-index: 100;
    box-shadow: 0 0 8px rgba(0, 0, 0, .15);
    transition: all .2s ease-in-out;

    white-space: nowrap;
}

.sponsor-item p::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #fff;
    z-index: 101;

}

.sponsor-item:hover p {
    opacity: 1;
    transform: translate(-50%, -190%);
    width: max-content;

}

.sponsor-item:hover {
    transform: scale(1.05);

}

.sponsor-logo {
    max-height: clamp(34px, 6vw, 60px);
    max-width: 180px;
    width: auto;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 1px 0 rgba(0, 0, 0, .15));
}

/* Skeletons */
.skeleton-logo {
    width: clamp(90px, 22vw, 140px);
    height: clamp(40px, 8vw, 60px);
    border-radius: 12px;
    background: rgba(255, 255, 255, .18);
    animation: pulse 1.2s infinite;
}

/* ===== Contact ===== */
.ft-contract-us {
    text-align: center;
    display: grid;
    gap: 8px;
}

.ft-title {
    margin: 0;
    font-size: clamp(1rem, 2.6vw, 1.25rem);
    font-weight: 700;
    letter-spacing: .3px;
}

.ft-contract {
    margin: 0 auto;
    max-width: 900px;
    color: rgba(255, 255, 255, .85);
    line-height: 1.7;
    font-size: clamp(.9rem, 2.2vw, 1rem);
    padding: 0 6px;
}

/* ===== Credit ===== */
.cpr {
    width: 100%;
    padding: .6rem 0 .2rem;
    color: #ffffff;
}

.cpr-text {
    display: flex;
    justify-content: center;
    text-align: center;
    opacity: .9;
    font-size: clamp(.8rem, 2vw, .95rem);
}

/* ===== Anim ===== */
@keyframes pulse {
    0% {
        opacity: .55;
    }

    50% {
        opacity: .95;
    }

    100% {
        opacity: .55;
    }
}

/* ===== Responsive tweaks ===== */
@media (max-width: 640px) {
    .footer-nav {
        gap: 8px 14px;
    }

    .footer-divider {
        width: 92%;
    }
}

@media (min-width: 1280px) {
    .sponsor-logo {
        max-height: 64px;
    }
}
</style>
