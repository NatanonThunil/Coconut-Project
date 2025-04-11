<template>
    <Navbar selecto="aboutus" />
    <div style="height: 5rem;"></div>

    <div v-if="news" class="container">
        <img class="news-image-banner" :src="news.image || 'https://placehold.co/800x400'" alt="News Image"
            v-if="news.image" />

        <h1>{{ news.title }}</h1>
        <p class="news-meta">
            <span><strong>เผยแพร่เมื่อ:</strong> {{ formatDate(news.upload_date) }}</span>
            | <span>โดย {{ news.author }}</span>
        </p>

        <div style="height: 3px; background-color:#4E6D16 ; margin: 1rem;"></div>

        <!-- News Content -->
        <div class="news-content" v-html="news.description"></div>

        <!-- Back Button -->

        <SeeAllButton text="ดูข่าวอื่น" link="/achievement" />
    </div>
    <div v-else-if="loading" class="loading-container">
        <p class="loading">กำลังโหลดข้อมูล...</p>
        <SeeAllButton text="ดูข่าวอื่น" link="/news" />
    </div>
    <!-- Error Handling -->
    <div v-else>
        <div class="news-404-container">
            <div class="news-404-center-content">
                <section class="news-404-left-section"><img src="@/assets/img/News404.png" alt="" draggable="false">
                </section>
                <section class="news-404-right-section">ขออภัยไม่มีการเผยแพร่ข่าว
                    <SeeAllButton text="ดูข่าวอื่นๆ" link="/news" />
                </section>
            </div>
        </div>
    </div>

</template>

<script>
import unyaprgard from '@/assets/icon/double-quotes.png';
export default {
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

            const response = await fetch(`/api/achievements_table/`);
            if (!response.ok) throw new Error('Failed to fetch news details');

            const data = await response.json();
            this.news = data.find(news => (news.id === parseInt(cid)) && (news.status)) || null;
            this.loading = false;
        } catch (error) {
            console.error('Error fetching news details:', error);
            this.error = 'Failed to load news data. Please try again later.';
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
        }
    }
}

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
