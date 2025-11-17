<template>
  <div style="height: 8rem"></div>


  <Breadcrumb
    :last-label="currentLocale==='th' ? (chain_values?.title || 'ไม่มีหัวข้อ') : (chain_values?.title_en || 'No Title')"/>

  <div class="chainvalue-container">
    <div v-if="loading" class="loading-container">
      <CardShimmer v-for="index in 1" :key="index" />
      <div class="back-button shimmer"></div>
    </div>
    <img
      class="news-image-banner"
      :src="chain_values.image || 'https://placehold.co/800x400'"
      alt="News Image"
      v-else="chain_values.image"
    />

    <h1>
      {{
        currentLocale == "th"
          ? chain_values?.title || "ไม่มีหัวข้อ"
          : chain_values?.title_en || "No Title"
      }}
    </h1>

    <div class="Chain-Value-Category">
      <p><img src="/icon/coconuti.png" alt="">{{ getTypeLabel(chain_values?.type) }}</p>
      <p :class="(chain_values?.category==0)?'young-coconut':'old-coconut'"><img src="/icon/coconut.png" alt="">{{ getCategoryLabel(chain_values?.category) }}</p>
    </div>
    <div
      style="
        height: 3.5px;
        width: 100%;
        background-color: #4e6d16;
        margin: 2rem auto;
        border-radius: 1px;
      "
    ></div>
    <div class="chain_value-content">
      <strong>{{ $t("Description") }}</strong>
      <p
        v-html="
          currentLocale == 'th'
            ? chain_values?.description || 'No Title'
            : chain_values?.description_en || 'No Title'
        "
      ></p>
    </div>

    <SeeAllButton
      :text="$t('More chain value')"
      link="/coconut-information/value-chain"
    />
  </div>
</template>

<script>
import { useHead } from "@vueuse/head";
import CardShimmer from "@/components/CardShimmer.vue";
import { useChainvalues } from "@/composables/useChainvalues";
import { useI18n } from "vue-i18n";

const { getChainvalueById } = useChainvalues();

export default {
  components: { CardShimmer },
  data() {
    return {
      chain_values: null,
      loading: true,
      defaultImage: "https://placehold.co/800x600",
    };
  },
  async mounted() {
    const { id } = this.$route.params;
    try {
      const data = await getChainvalueById(id);
      this.chain_values = data;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching chain value details:", error);
    }
  },
  setup() {
    const { t } = useI18n();
    
  
    useHead({
      title: "🥥Coconut - Value Chain Details",
      meta: [
        {
          name: "description",
          content: "Details page for Value Chain in Coconut Knowledge Hub",
        },
      ],
    });
    return { currentLocale: useI18n().locale, t};
  },
  methods: {
    goBack() {
      this.$router.push("/coconut-information/value-chain");
    },
    getCategoryLabel(value) {
      const categories = {
        0: this.$t("Young-coconut"),
        1: this.$t("Old-coconut"),
      };
      return categories[value] || value;
    },
    getTypeLabel(value) {
      const types = {
        0: this.$t("Upstream"),
        1: this.$t("Midstream"),
        2: this.$t("Downstream"),
      };
      return types[value] || value;
    },
  },
  
};
</script>

<style scoped>
.Chain-Value-Category .old-coconut {
  background-color: lab(66.81% 7.33 2.68);
}
.Chain-Value-Category .young-coconut {
  background-color: #dff169;
}
.Chain-Value-Category {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  color: #000000;
  font-size: 1.2rem;
}
.Chain-Value-Category img {
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
  vertical-align: middle;
}
.Chain-Value-Category p {
  background-color: #dff169;
  padding: 0.5rem 0.8rem;
  border-radius: 12px;
}
.chain_value-content {
  font-size: 1.5rem;
  max-width: 100dvw;
  overflow: visible;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-word;
  gap: 0.5rem;
}
.chainvalue-container {
  max-width: 1000px;
  margin: auto;
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
  object-fit: contain;
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
