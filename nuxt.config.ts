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
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/logo/CKH-round.ico' },
      ],
    },
  },
  css: [

    '@/assets/css/global.css',
  ],
})