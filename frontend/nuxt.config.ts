// import dotenv from 'dotenv'

// dotenv.config({path:'../backend/.env'})
export default defineNuxtConfig({

  ssr: false,
  devServer: {
    port: 5000,
  },
  
  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      beUrl: process.env.BE_BASE_URL || 'http://localhost:5100',
      urlBase: process.env.FE_BASE_URL,
      apiBase: process.env.API_BASE,
      LoadingTimeMock: process.env.LOADING_TIME_MOCK,
      apiKey: process.env.API_SECRET || 'Cocon541986',
      
    },
  },
  devtools: { enabled: false },

  typescript: {
    strict: false
  },

  compatibilityDate: '2024-11-24',

  app: {
    head: {
      title: 'Coconut Knowledge hub',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Default meta description.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },

        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
        },

      ],
    },
  },

  css: [
    '@/assets/css/global.css',
  ],

  modules: [
    // 'nuxt-primevue',
    '@nuxtjs/i18n',
  ],


  i18n: {
    lazy: true,
    langDir: 'locales',
    strategy: 'no_prefix',
    locales: [
      { code: 'th', language: 'th-TH', file: 'th-TH.json', name: 'Thai' },
      { code: 'en', language: 'en-US', file: 'en-US.json', name: 'English' },
    ],
    defaultLocale: 'th',
  },
})
