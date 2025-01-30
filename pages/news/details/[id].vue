<template>
    <Navbar selecto="home" />
    <div style="height: 5rem;"></div>

    <div v-if="news" class="container">
        <img class="news-image-banner" :src="news.image || 'https://placehold.co/800x400'" alt="News Image" v-if="news.image"/>

        <h1>{{ news.title }}</h1>
        <p class="news-meta"> 
            <span><strong>เผยแพร่เมื่อ:</strong> {{ formatDate(news.upload_date) }}</span> 
            | <span>โดย {{ news.author }}</span>
        </p>
        
        <!-- Summary Section -->
        <div class="news-summary"v-if="news.summerize">
            <h2>สรุป</h2>
            <p style=" display: flex; flex-direction: row;"><img class="unyapragard" src="/assets/icon/double-quotes.png" >{{ news.summerize }}<img src="/assets/icon/double-quotes.png" alt="" class="unyapragardl"></p>
        </div>
        <div v-else></div>
        <div style="height: 3px; background-color:#4E6D16 ; margin: 1rem;"></div>

        <!-- News Content -->
        <div  class="news-content">{{ news.description }}</div>

        <!-- Back Button -->
        
        <SeeAllButton text="ดูข่าวอื่น" link="/news"/>
    </div>
    <div v-else-if="loading" class="loading-container">
        <p class="loading">กำลังโหลดข้อมูล...</p>
        <SeeAllButton text="ดูข่าวอื่น" link="/news"/>
    </div>
    <!-- Error Handling -->
    <div v-else>
        <p class="error">ไม่มีข่าวมีหรอกมู่ห้าห้า</p>
        <button @click="goBack" class="back-button">กลับ</button>
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

            const response = await fetch(`/api/news/`+ cid);
            if (!response.ok) throw new Error('Failed to fetch news details');
            
            const data = await response.json();
            this.news = data.find(news => (news.id === parseInt(cid))&&(news.status === 1)) || null;
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
.loading-container{
    display: flex;
    justify-self: center;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: 50%;
}

.news-content{
    font-size: 1.5rem;
    overflow: hidden;
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
    word-wrap: break-word; /* Break long words */
    word-break: break-word; /* Ensure long words wrap */
    margin-bottom: 10px;
    background-color: #d5dba5;
    border-radius: 10px;
    color: black;
    padding: 1rem;
    margin: 1rem 0rem;
    font-size: 1.5rem;
}
.error {
    color: red;
}
.loading {
    font-size: 2.5rem;
    color: gray;
}

</style>
