<template>
    <Navbar selecto="coconutdata" />
    <page-header head="CoconutInfo" />
    <label class="coconut-v-input">
        <img src="@/assets/icon/search.svg">
        <input type="text" placeholder="ค้นหาด้วยชื่อ..." v-model="searchQuery" @input="filterCoconuts" />
    </label>

    <!-- Loading State -->
    <div v-if="loading" class="coconut-v-cards-container">
        <CardShimmer v-for="index in 30" :key="index" />
    </div>

    <!-- Loaded Content -->
    <!-- ดึงข้อมูลเข้า cards -->
    <div v-else class="coconut-v-cards-container">
        <swiper :slides-per-view="3" space-between="30" navigation pagination>
            <swiper-slide v-for="coconut in paginatedCoconuts" :key="coconut.id">
                <InformationCard :img="coconut.image || defaultImage"
                    :title="currentLocale === 'th' ? coconut.title : coconut.title"
                    :description="coconut.description || 'No description available'" />
            </swiper-slide>
        </swiper>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination">
        <button @click="changePage('prev')" :disabled="currentPage === 1">Previous</button>
        <input type="number" v-model.number="pageInput" @change="goToPage" class="page-input" />
        <button @click="changePage('next')" :disabled="currentPage === totalPages">Next</button>
    </div>
</template>

<script>
import { useHead } from '@vueuse/head';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import InformationCard from '@/components/InformationCard.vue';

export default {
    components: {
        Swiper,
        SwiperSlide,
        InformationCard,
    },
    data() {
        return {
            coconuts: [],
            filteredCoconuts: [],
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 30,
            pageInput: 1,
            loading: true,
            defaultImage: 'https://placehold.co/600x400',
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredCoconuts.length / this.itemsPerPage);
        },
        currentLocale() {
            const { locale } = useI18n();
            return locale.value;
        },
        paginatedCoconuts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredCoconuts.slice(start, end);
        }
    },
    watch: {
        currentPage(newPage) {
            this.pageInput = newPage;
        },
    },
    async mounted() {
        window.scrollTo(0, 0);
        try {
            setTimeout(async () => {
                const response = await fetch('/api/chain_values');
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                this.coconuts = data;
                this.filteredCoconuts = data;
                this.loading = false;
            }, 200);
        } catch (error) {
            console.error('Error fetching coconuts:', error);
        }
    },
    methods: {
        filterCoconuts() {
            const query = this.searchQuery.toLowerCase();
            this.filteredCoconuts = this.coconuts.filter(
                coconut =>
                    coconut.name_th.toLowerCase().includes(query) ||
                    coconut.name_eng.toLowerCase().includes(query)
            );
            this.currentPage = 1;
        },
        changePage(direction) {
            if (direction === 'next' && this.currentPage < this.totalPages) {
                this.currentPage++;
            } else if (direction === 'prev' && this.currentPage > 1) {
                this.currentPage--;
            }
        },
        goToPage() {
            if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
                this.currentPage = this.pageInput;
            } else {
                this.pageInput = this.currentPage;
            }
        },
        goToDetails(id) {
            this.$router.push(`/coconut-information/chain-value/details/${id}`);
        },
    },
    setup() {
        useHead({
            title: '🥥Coconut - Chain Value',
            meta: [
                {
                    name: 'description',
                    content: 'Chain Value page for Coconut Knowledge Hub',
                },
            ],
        });
    },
};
</script>

<style scoped>
/* Swiper Styles */
.swiper {
    width: 100%;
    height: 100%;
}

.swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
}

.swiper-pagination-bullet {
    background: #4e6d16;
}

.swiper-button-next,
.swiper-button-prev {
    color: #4e6d16;
}

/* CoconutCards Styles */
.coconut-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    min-width: 300px; /* Minimum size for big cards */
}

.coconut-card:hover {
    transform: scale(1.05);
}

.coconut-card img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 2rem;
}

.coconut-card .card-content {
    padding: 1rem;
    text-align: center;
}

/* Small Card Styles */
.small-card {
    width: 80%;
    opacity: 0.8;
    transition: opacity 0.3s ease-in-out;
}

.small-card:hover {
    opacity: 1;
}

/* Existing Styles */
.context-header {
    display: flex;
    justify-self: center;
}

label.coconut-v-input {
    transition: ease-in-out 0.5s;
    display: flex;
    justify-self: center;
    width: 60%;
    height: 3rem;
    outline: 3px solid #4e6d16;
    border-radius: 10px;
    overflow: hidden;
    cursor: text;
    animation: btnexpand 0.5s ease-in-out forwards;
}

label.coconut-v-input:hover {
    outline: 4px solid #4e6d16;
}

label.coconut-v-input img {
    display: flex;
    align-self: center;
    padding-left: 0.5rem;
    width: 10%;
    height: 2rem;
}

label.coconut-v-input input {
    all: unset;
    padding-left: 1rem;
    padding-right: 1rem;
    overflow: hidden;
    width: 90%;
}

@keyframes shimmer-effect {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.coconut-v-cards-container {
    height: auto;
    width: 80%;
    display: flex;
    justify-self: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    margin: 2rem;
}

.CardShimmer {
    height: 18rem;
    width: 15rem;
    border-radius: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer-effect 1.5s infinite;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 2rem;
}

.pagination button {
    padding: 0.5rem 1rem;
    background-color: #4e6d16;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.pagination .page-input {
    width: 3rem;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0.3rem;
}

.pagination .pagination-line {
    width: fit-content;
    min-width: 20%;
    height: 4px;
    background-color: #4e6d16;
}

.pagination-controller {
    justify-content: center;
    display: flex;
    justify-content: space-around;
    width: 20rem;
}

@media (max-width: 662px) {
    .coconut-v-cards-container {
        width: 90%;
    }
}

@keyframes btnexpand {
    0% {
        opacity: 0;
        width: 20%;
    }

    100% {
        opacity: 1;
        width: 60%;
    }
}
</style>