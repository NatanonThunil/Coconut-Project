<template>
    <Navbar selecto="coconutdata" />
    <div style="height: 8rem"></div>
    <div class="faqs-path">
        <NuxtLinkLocale to="/">Home</NuxtLinkLocale>/
        <NuxtLinkLocale to="/coconut-information/chain-value">{{ $t('Chain Value') }}</NuxtLinkLocale>/
        <NuxtLinkLocale :to="'/coconut-information/chain-value/'+this.$route.params.id">{{ chain_values?.title || 'No Title'}}</NuxtLinkLocale>
    </div>
    <div v-if="loading" class="loading-container">
        <CardShimmer v-for="index in 1" :key="index" />
        <div class="back-button shimmer"></div>
    </div>
    <div v-else class="details-container">
        <img :src="chain_values.image || defaultImage" alt="Coconut Image" class="coconut-image" draggable =false
         />
        <h1>{{ chain_values.title }}</h1>
        <p>{{ getCategoryLabel(chain_values.category) }}, {{ getTypeLabel(chain_values.type) }}</p>
        <div class="summary-container">
            <h2>คำอธิบาย :</h2>
            <p>{{ chain_values.description }}</p>
        </div>
        <button @click="goBack" class="back-button">ดูข่าวอื่น</button>
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
            chain_values: null,
            loading: true,
            defaultImage: 'https://placehold.co/600x400',
        };
    },
    async mounted() {
        const { id } = this.$route.params;
        try {
            const response = await fetch(`/api/chain_values/${id}`, {
                headers: {
                    "CKH": '541986Cocon',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            this.chain_values = data;
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
        },
        getCategoryLabel(value) {
            const categories = {
                '0': this.$t('Young Coconut'),
                '1': this.$t('Mature Coconut'),
            };
            return categories[value] || value;
        },
        getTypeLabel(value) {
            const types = {
                '0': this.$t('Upstream'),
                '1': this.$t('Midstream'),
                '2': this.$t('Downstream'),
            };
            return types[value] || value;
        }
    },
};
</script>

<style scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.details-container {
    padding: 20px;
    max-width: 1000px;
    margin: 6rem auto;

}

.coconut-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    margin-bottom: 15px;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.publish-info {
    font-size: 1rem;
    color: #666;
    margin-bottom: 1rem;
}

.summary-container {
    background-color: #d9e8c5;
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1rem;
    width: 100%;
}

.summary-container h2 {
    margin: 0;
    font-size: 1.5rem;
}

.summary-container p {
    margin: 0;
    font-size: 1rem;
}

p {
    padding: 20px;
    max-width: 1000px;
    font-size: 1rem;
    margin: auto;

}

.back-button {
    display: flex;
    margin: 2rem auto;
    padding: 0.8rem 2rem;
    border: 2px solid #4e6d16;
    background: transparent;
    color: #4e6d16;
    font-size: 1.2rem;
    border-radius: 30px;
    cursor: pointer;
    transition: 0.3s ease;
}

.shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}
</style>