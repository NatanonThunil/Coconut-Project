<template>

  <div style="height: 8rem"></div>

  <!-- Breadcrumb -->
  <div class="faqs-path">
    <NuxtLinkLocale to="/">Home</NuxtLinkLocale>/
    <NuxtLinkLocale to="/coconut-information/">{{ $t('CoconutInfo') }}</NuxtLinkLocale> /
    <NuxtLinkLocale to="/coconut-information/value-chain">{{ $t('Value Chain') }}</NuxtLinkLocale> /
    <NuxtLinkLocale :to="'/coconut-information/value-chain/details/' + $route.params.id">
      {{ chain_values?.title || 'No Title' }}
    </NuxtLinkLocale>
  </div>

  <!-- Loading -->

  <div class="chainvalue-container">
    <div v-if="loading" class="loading-container">
      <CardShimmer v-for="index in 1" :key="index" />
      <div class="back-button shimmer"></div>
    </div>
    <img class="news-image-banner" :src="chain_values.image || 'https://placehold.co/800x400'" alt="News Image"
      v-else="chain_values.image" />

    <h1>{{ (currentLocale == 'th') ? (chain_values?.title || 'No Title') : (chain_values?.title_en || 'No Title') }}
    </h1>
    
    <div class="chain_value-content">
  <strong>{{ $t("Description") }}:</strong>
  {{ (currentLocale == 'th') ? (chain_values?.description || 'No Title') : (chain_values?.description_en || 'No Title') }}
</div>

    <SeeAllButton text="ดูห่วงโซ่คุณค่าอื่นๆ" link="/coconut-information/value-chain" />
  </div>


</template>

<script>
import { useHead } from '@vueuse/head';
import CardShimmer from '@/components/CardShimmer.vue';
import { useChainvalues } from '@/composables/useChainvalues';
import { useI18n } from 'vue-i18n';

const { getChainvalueById } = useChainvalues();

export default {

  components: { CardShimmer },
  data() {
    return {
      chain_values: null,
      loading: true,
      defaultImage: 'https://placehold.co/800x600',
    };
  },
  async mounted() {
    const { id } = this.$route.params;
    try {
      const data = await getChainvalueById(id);
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
  },computed:{
    currentLocale() {
      return this.$i18n.locale;
    }
  }
};
</script>

<style scoped>
.chain_value-content {
      font-size: 1.5rem;
    max-width:100dvw;
    overflow: visible;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-wrap: break-word;
    word-break: break-word;
    
}
.chainvalue-container {
  max-width: 1000px;
  margin:  auto;
  padding: 20px;
  gap: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 5rem;
}
.news-image-banner {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 10px;
}
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
   color: #4e6d16;
}
.details-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.details-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 1100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

.image-container {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-width: 300px;
}

.chain-value-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
}

.details-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.summary-container {
  background-color: #f4f8ef;
  padding: 1.2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.summary-container h2 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #2d3a22;
}

.summary-container p {
  font-size: 1rem;
  line-height: 1.6;
    overflow-wrap: anywhere;
  white-space: normal;
}

.title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2d3a22;
}

.meta {
  margin-bottom: 1.5rem;
}

.badge {
  display: inline-block;
  background: #4e6d16;
  color: #fff;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.badge-outline {
  background: transparent;
  border: 1px solid #4e6d16;
  color: #4e6d16;
}



.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.8rem 2rem;
  border: 2px solid #4e6d16;
  background: #fff;
  color: #4e6d16;
  font-size: 1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
}

.back-button:hover {
  background: #4e6d16;
  color: #fff;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .details-card {
    flex-direction: column;
    padding: 1rem;
  }

  .image-container {
    width: 100%;
  }

  .chain-value-image {
    width: 100%;
    max-height: none;
    /* allow taller image */
  }
}
</style>
