export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/image'],
  css: ['~/assets/scss/main.scss'],
  app: {
    head: {
      title: 'Квартиры — подбор',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://www.paratype.ru/fonts/pt/pt-root-ui.css'
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      jsonbinMasterKey: process.env.JSONBIN_MASTER_KEY || ''
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: ['/']
    }
  }
})