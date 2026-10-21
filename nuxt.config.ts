import { readFileSync } from 'node:fs'

const source = JSON.parse(readFileSync(new URL('./app/data/content.json', import.meta.url), 'utf8'))
const routes = source.pages.map((page: { route: string }) => page.route.replace(/^\/(en\/)?products\?category=/, '/$1category/'))
const demoRoutes = ['/']
for (const variant of ['v1', 'v2', 'v3']) {
  demoRoutes.push(`/${variant}`)
  for (const route of routes) demoRoutes.push(`/${variant}${route === '/' ? '' : route}`)
}

export default defineNuxtConfig({
  compatibilityDate: '2026-10-21',
  css: ['~/assets/main.css', '~/assets/redesign.css'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'APEKS — направления интернет-магазина',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Три направления интернет-магазина геодезического оборудования APEKS' }
      ]
    }
  },
  nitro: {
    prerender: {
      routes: [...new Set(demoRoutes)],
      crawlLinks: false,
    }
  }
})
