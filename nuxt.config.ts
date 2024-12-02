export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '123',
    public: {
      apiBase: '/api'
    }
  },

  typescript: {
      strict: false
    },

  compatibilityDate: '2024-11-24'
})