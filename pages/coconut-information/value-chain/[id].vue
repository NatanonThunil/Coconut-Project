<template>
    <div>
      <Navbar selecto="coconutdata" />
      <div class="all-container">
        <div style="height: 8rem"></div>
  
        <!-- Breadcrumb -->
        <div class="faqs-path">
          <NuxtLinkLocale to="/coconut-information/value-chain">{{ $t('Chain Value') }}</NuxtLinkLocale> /
          <NuxtLinkLocale :to="'/coconut-information/value-chain/' + this.$route.params.id">
            {{ chain_values?.title || 'No Title' }}
          </NuxtLinkLocale>
        </div>
  
        <!-- Loader -->
        <div v-if="loading" class="loading">
          <p>กำลังโหลดข้อมูล...</p>
        </div>
  
        <!-- Error -->
        <div v-if="error" class="error">
          <p>{{ error }}</p>
        </div>
  
        <!-- Coconut Details Card -->
        <div class="details-container" v-if="chain_values">
          <div class="coconut-card">
            <img
              :src="chain_values?.image || defaultImage"
              class="coconut-image"
              alt="Coconut Image"
              draggable="false"
            />
            <div class="coconut-details">
              <h1 class="coconut-title">{{ chain_values?.title }}</h1>
              <div class="info">
                <p><strong>Category:</strong> {{ getCategoryLabel(chain_values.category) }}</p>
                <p><strong>Type:</strong> {{ getTypeLabel(chain_values.type) }}</p>
                <p><strong>Description:</strong> {{ chain_values?.description || 'N/A' }}</p>
              </div>
            </div>
          </div>
          <div style="height: 8rem"></div>
  
          <!-- Back Button -->
          <div class="back-btn-container">
            <button @click="goBack" class="back-button">ดูข่าวอื่น</button>
          </div>
        </div>
      </div>
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
        error: null,
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
        this.error = "ไม่สามารถโหลดข้อมูลศัตรูพืชได้ กรุณาลองใหม่อีกครั้ง";
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
        this.$router.push('/coconut-information/value-chain');  // Updated path for back navigation
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
  .all-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Breadcrumb styling */
  .faqs-path {
    display: flex;
    align-items: center;
    padding-left: 1rem;
    margin: 1rem 0;
    gap: 0.5rem;
    font-size: 1.2rem;
    color: #424141;
  }
  .faqs-path a {
    color: #424141;
    text-decoration: none;
    margin-left: 0.5rem;
  }
  
  /* Loader and Error styling */
  .loading,
  .error {
    text-align: center;
    font-size: 1.2rem;
    color: gray;
    padding: 1rem;
  }
  
  /* Coconut card container */
  .details-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin: 0 auto;
  }
  
  /* Coconut card layout */
  .coconut-card {
    display: flex;
    gap: 2rem; /* Space between image and text */
    max-width: 100%;
    padding: 1.5rem; /* Increased padding for more space */
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Image styling */
  .coconut-image {
    width: 350px; /* Increased image size */
    height: auto;
    object-fit: cover;
    border-radius: 10px;
    aspect-ratio: 1/1.14;
  }
  
  /* Coconut details layout */
  .coconut-details {
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Align text to top */
    width: calc(100% - 350px); /* Adjust width to fit next to image */
  }
  
  /* Coconut title styling */
  .coconut-title {
    font-size: 2.2rem; /* Increased font size for the name */
    font-weight: bold;
    color: #4e6d16;
    margin-bottom: 1.5rem; /* Increased margin */
  }
  
  /* Info styling */
  .info p {
    margin: 1rem 0; /* Increased margin between lines */
  }
  
  /* Back button container */
  .back-btn-container {
    width: 30%;
    text-align: center;
    margin-top: 3rem; /* Added more spacing */
  }
  
  /* Back button styling */
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
  </style>
  