<template>
    <Navbar selecto="chainvalues" />
    <div style="height: 8rem"></div>
    <div class="faqs-path">
        <NuxtLinkLocale to="/coconut-information/">{{ $t('CoconutInfo') }}</NuxtLinkLocale>/
        <NuxtLinkLocale to="/coconut-information/value-chain">{{ $t('Value Chain') }}</NuxtLinkLocale>/
        <NuxtLinkLocale :to="'/coconut-information/value-chain/' + this.$route.params.id">{{ chain_values?.title || 'No Title' }}</NuxtLinkLocale>
    </div>
    <div v-if="loading" class="loading-container">
        <CardShimmer v-for="index in 1" :key="index" />
        <div class="back-button shimmer"></div>
    </div>
    <div v-else class="details-container">
        <img :src="chain_values.image || defaultImage" alt="Chain Value Image" class="chain-value-image" draggable="false" />
        <h1>{{ chain_values.title }}</h1>
        <p>{{ getCategoryLabel(chain_values.category) }}, {{ getTypeLabel(chain_values.type) }}</p>
        <div class="summary-container">
            <h2>{{ $t('Description') }}:</h2>
            <p>{{ chain_values.description }}</p>
        </div>
        <button @click="goBack" class="back-button">{{ $t('Back to Value Chain') }}</button>
    </div>
</template>

<script>
import { useHead } from '@vueuse/head';
import CardShimmer from '@/components/CardShimmer.vue';
import { useChainvalues } from '@/composables/useChainvalues'; // Import useChainvalues composable

const { getChainvalueById } = useChainvalues();

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
            const data = await getChainvalueById(id); // Fetch chain value by ID
            this.chain_values = data;
            this.loading = false;
        } catch (error) {
            console.error('Error fetching chain value details:', error);
        }
    },
    setup() {
        useHead({
            title: '🥥Coconut - Value Chain Details',
            meta: [
                {
                    name: 'description',
                    content: 'Details page for Value Chain in Coconut Knowledge Hub',
                },
            ],
        });
    },
    methods: {
        goBack() {
            this.$router.push('/coconut-information/value-chain');
        },
        getCategoryLabel(value) {
            const categories = {
                '0': this.$t('Upstream'),
                '1': this.$t('Midstream'),
            };
            return categories[value] || value;
        },
        getTypeLabel(value) {
            const types = {
                '0': this.$t('Type 0'),
                '1': this.$t('Type 1'),
                '2': this.$t('Type 2'),
            };
            return types[value] || value;
        },
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

.chain-value-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    margin-bottom: 15px;
}

h1 {
    font-size: 2rem;
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