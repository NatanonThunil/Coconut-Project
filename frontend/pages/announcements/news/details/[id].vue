<template>

    <div style="height: 8rem"></div>
    <div class="faqs-path">
 <NuxtLinkLocale to="/">{{ $t('Home') }}</NuxtLinkLocale>/
        <NuxtLinkLocale to="/news">{{ $t('News') }}</NuxtLinkLocale>/
        <NuxtLinkLocale :to="'/news/details/'+this.$route.params.id">{{ (currentLocale == 'th')? (news?.title || 'ไม่มีหัวข้อ'): (news?.title_en || 'No Title')}}</NuxtLinkLocale>
    </div>
    

    <div v-if="news" class="container">
        <img class="news-image-banner" :src="news.image || 'https://placehold.co/800x400'" alt="News Image"
            v-if="news.image" />

        <h1>{{ (currentLocale == 'th')? (news?.title || 'No Title'): (news?.title_en || 'No Title') }}</h1>
        <p class="news-meta">
            <span><strong>{{(currentLocale == 'th')? "เผยแพร่เมื่อ :" : "Published :"}}</strong> {{ (currentLocale == 'th')?  formatDate(news.upload_date) : formatDateen(news.upload_date) }}</span>
            | <span>{{(currentLocale == 'th')? "โดย": "by "}}{{ news.author }}</span>
        </p>

        <!-- Summary Section -->
        <div class="news-summary" v-if="news.summerize">
            <h2>สรุป</h2>
            <p style=" display: flex; flex-direction: row;"><img class="unyapragard"
                    src="/icon/double-quotes.png">{{ (currentLocale == 'th')? (news?.summerize || 'ไม่มีสรุปในภาษาไทย'): (news?.summerize_en || 'No summerize in English') }}<img src="/icon/double-quotes.png"
                    alt="" class="unyapragardl"></p>
            <!--   -->
        </div>
        <div v-else></div>
        <div style="height: 3px; background-color:#4E6D16 ; margin: 1rem;"></div>

        <!-- News Content -->
        <div class="news-content" v-html="(currentLocale == 'th')? (news?.description || 'ไม่มีข้อมูลในภาษาไทย'): (news?.description_en || 'No description in English') "></div>

        <!-- Back Button -->

        <SeeAllButton text="ดูข่าวอื่น" link="/announcements/news" />
    </div>
    <div v-else-if="loading" class="loading-container">
        <p class="loading">กำลังโหลดข้อมูล...</p>
        <SeeAllButton text="ดูข่าวอื่น" link="/announcements/news" />
    </div>
    <!-- Error Handling -->
    <div v-else>
        <div class="news-404-container">
            <div class="news-404-center-content">
                <section class="news-404-left-section"><img src="/img/News404.png" alt="" draggable="false">
                </section>
                <section class="news-404-right-section">ขออภัยไม่มีการเผยแพร่ข่าว
                    <SeeAllButton text="ดูข่าวอื่นๆ" link="/announcements/news" />
                </section>
            </div>
        </div>
    </div>

</template>

<script>
import { useI18n } from 'vue-i18n';
import { useNews } from '~/composables/useNews';

import unyaprgard from '/icon/double-quotes.png';
const { getNewsById } = useNews(); // Import the getNewsById function

export default {
    setup() {
        const { locale } = useI18n();
        const currentLocale =computed(() => locale.value);
        return { currentLocale: locale };
    },
    data() {
        return {
            news: null,
            error: null,
            loading: true,
        };
    },
    async mounted() {
        this.loading = true;
        const cid = this.$route.params.id;

        try {
            if (!cid) throw new Error('Missing news ID parameter');

            const data = await getNewsById(cid); // Use the getNewsById function
            this.news = data.status ? data : null; // Ensure the news item has a valid status
            this.loading = false;
        } catch (error) {
            console.error('Error fetching news details:', error.message);
            this.error = 'Failed to load news data. Please try again later.';
            this.loading = false;
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        formatDate(dateString) {
            if (!dateString) return 'ไม่ทราบวันที่';
            return new Date(dateString).toLocaleDateString('th-TH', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        },
        formatDateen(dateString) {
            if (!dateString) return 'ไม่ทราบวันที่';
            return new Date(dateString).toLocaleDateString('en-EN', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        }
    }
};
</script>

<style scoped>
.news-404-center-content {
    display: flex;
    flex-direction: column;

    animation: fadeinblur ease-in-out 0.4s;
}

.news-404-center-content .news-404-left-section {
    display: flex;
    justify-content: center;
}

.news-404-center-content .news-404-left-section img {
    height: 25rem;
    border-radius: 10px;
}

.news-404-center-content .news-404-right-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    font-size: 2rem;
    font-weight: 600;
    color: #4e6d16;
}

.news-404-container {
    display: flex;
    width: 100%;
    height: calc(100dvh - 5rem);
    justify-content: center;
    align-items: center;
}

.unyapragard {
    height: 2rem;
    width: 2rem;
    object-fit: cover;
    margin: 0rem 0.5rem;
}

.unyapragardl {
    display: flex;
    align-self: end;
    height: 2rem;
    width: 2rem;
    object-fit: cover;
    margin: 0rem 0.5rem;
}

.loading-container {
    display: flex;
    justify-self: center;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: 50%;
}

.news-content {
    font-size: 1.5rem;
    max-width:100dvw;
    overflow: visible;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-wrap: break-word;
    word-break: break-word;
}

.container {
    padding: 20px;
    max-width: 1000px;
    margin: auto;

}

.news-image-banner {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    margin-bottom: 15px;
}

.news-summary {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-wrap: break-word;
    /* Break long words */
    word-break: break-word;
    /* Ensure long words wrap */
    margin-bottom: 10px;
    background-color: #d5dba5;
    border-radius: 10px;
    color: black;
    padding: 2rem;
    margin: 1rem 0rem;
    font-size: 1.5rem;
}

/* .news-summary p{
    text-align: justify;
} */
.error {
    color: red;
}

.loading {
    font-size: 2.5rem;
    color: gray;
}

@keyframes fadeinblur {
    0% {
        opacity: 0;
        filter: blur(20px);
        transform: scale(0.9);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
