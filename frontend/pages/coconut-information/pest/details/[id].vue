<template>
  <div style="height: 8rem"></div>

  <!-- Breadcrumb -->
  <div class="faqs-path">
    <NuxtLinkLocale to="/">{{ $t("Home") }}</NuxtLinkLocale> /
    <NuxtLinkLocale to="/coconut-information/">{{ $t("CoconutInfo") }}</NuxtLinkLocale> /
    <NuxtLinkLocale to="/pest">{{ $t("Pest") }}</NuxtLinkLocale> /
    <NuxtLinkLocale :to="'/pest/details/' + $route.params.id">
      {{ currentLocale === "th" ? pest?.name || "No Name" : pest?.name_en || "No Name" }}
    </NuxtLinkLocale>
  </div>

  <!-- Container -->
  <div class="pest-container">
    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <CardShimmer v-for="index in 1" :key="index" />
      <div class="back-button shimmer"></div>
    </div>

    <!-- Pest Detail -->
    <div v-else>
      <img class="pest-image-banner" :src="pest?.image || defaultImage" alt="Pest Image" />

      <h1>
        {{ currentLocale === "th" ? pest?.name || "No Name" : pest?.name_en || "No Name" }}
      </h1>

      <div class="pest-content">
        <p><strong>{{ $t('engname') }}:</strong> {{ pest?.name_en || "N/A" }}</p>
        <p class="sci_name "><strong>{{ $t('scientificname') }} :</strong> <p v-html="pest?.sci_name"></p></p>
        <p>
          <strong>{{ $t('lifecycle') }}</strong>
          {{ currentLocale === "th" ? pest?.lifecycle || "N/A" : pest?.lifecycle_en || "N/A" }}
        </p>
        <p>
          <strong>{{ $t('prevent') }}</strong>
          {{currentLocale === "th" ? pest?.prevent || "N/A" : pest?.prevent_en || "N/A"}}
        </p>
      </div>

      <SeeAllButton :text="$t('seeanotherpests')" link="/coconut-information/pest" />
    </div>
  </div>
</template>

<script>
import { useHead } from "@vueuse/head";
import { useI18n } from "vue-i18n";
import CardShimmer from "@/components/CardShimmer.vue";
import { usePests } from "@/composables/usePests";

const { getPestById } = usePests();

export default {
  components: { CardShimmer },
  data() {
    return {
      pest: null,
      loading: true,
      defaultImage: "https://placehold.co/800x600",
    };
  },
  async mounted() {
    const { id } = this.$route.params;
    try {
      const data = await getPestById(id);
      this.pest = data && data.status === 1 ? data : null;
      this.loading = false;
    } catch (error) {
      console.error("Error fetching pest details:", error);
      this.loading = false;
    }
  },
  setup() {
    const { locale } = useI18n();

    useHead({
      title: "🥥 Coconut - Pest Details",
      meta: [
        {
          name: "description",
          content: "Details page for Pests in Coconut Knowledge Hub",
        },
      ],
    });

    return {
      currentLocale: locale,
    };
  },
};
</script>

<style scoped>
.sci_name {
  
  display: flex;
  gap: 0.5rem;
}
.pest-container {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  gap: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 5rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #4e6d16;
}

.pest-image-banner {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 10px;
}

.pest-content {
  font-size: 1.5rem;
  max-width: 100dvw;
  overflow: visible;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-word;
  margin-bottom: 1.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
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

/* Responsive */
@media (max-width: 768px) {
  .pest-content {
    font-size: 1.2rem;
  }
}
</style>
