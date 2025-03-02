<template>
    <Navbar selecto="coconutdata" />
    <page-header head="Coconut Details" />
    <div v-if="loading" class="loading-container">
        <CardShimmer v-for="index in 1" :key="index" />
    </div>
    <div v-else class="details-container">
        <img :src="coconut.image || defaultImage" alt="Coconut Image" class="coconut-image" />
        <h1>{{ coconut.title }}</h1>
        <p>{{ coconut.description }}</p>
        <button @click="goBack" class="back-button">Back to List</button>
    </div>
</template>

<script>
import { useHead } from '@vueuse/head';
import CardShimmer from '@/components/CardShimmer.vue';

export default {
    components: {
        CardShimmer,
    },
    data() {
        return {
            coconut: null,
            loading: true,
            defaultImage: 'https://placehold.co/600x400',
        };
    },
    async mounted() {
        const { id } = this.$route.params;
        try {
            const response = await fetch(`/api/chain_values/${id}`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            this.coconut = data;
            this.loading = false;
        } catch (error) {
            console.error('Error fetching coconut details:', error);
        }
    },
    setup() {
        useHead({
            title: '🥥Coconut - Details',
            meta: [
                {
                    name: 'description',
                    content: 'Details page for Coconut Knowledge Hub',
                },
            ],
        });
    },
    methods: {
        goBack() {
            this.$router.push('/coconut-information/chain-value');
        }
    },
};
</script>

<style scoped>
.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.details-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
}

.coconut-image {
    width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 2rem;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

p {
    font-size: 1rem;
    text-align: center;
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

.back-button {
    padding: 0.5rem 1rem;
    background-color: #4e6d16;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
}

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

/* Coconut Cards Container */
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

/* Card Shimmer */
.CardShimmer {
    height: 18rem;
    width: 15rem;
    border-radius: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer-effect 1.5s infinite;
}
</style>