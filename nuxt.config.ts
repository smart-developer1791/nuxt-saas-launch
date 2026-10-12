import tailwindcss from '@tailwindcss/vite'
import { env } from 'node:process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const productionUrl = env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://nuxt-saas-launch.vercel.app'
let prerenderServerEntry = ''

export default defineNuxtConfig({
  compatibilityDate: '2026-10-06',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  runtimeConfig: {
    public: {
      siteUrl: env.NUXT_PUBLIC_SITE_URL || productionUrl,
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [{ name: 'theme-color', content: '#f7f8f2' }],
    },
  },
  nitro: {
    hooks: {
      'prerender:init'(renderer) {
        prerenderServerEntry = pathToFileURL(
          resolve(renderer.options.output.serverDir, 'index.mjs'),
        ).href
      },
      async 'prerender:generate'(route) {
        if (route.route !== '/404.html') return
        // Nuxt 4.5 emits a client-only fallback. Render the actual error screen instead.
        try {
          const { localFetch } = await import(prerenderServerEntry)
          const response = await localFetch('/__relay_missing_page__', {
            headers: { accept: 'text/html' },
          })
          if (response.status !== 404) throw new Error('Unexpected error-page response')
          // Native home links make the static 404 usable without an app bootstrap.
          // Omitting hydration also preserves the visitor's actual missing URL.
          route.contents = (await response.text())
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<link\b[^>]*(?:rel="modulepreload"|as="script")[^>]*>/gi, '')
        } catch (cause) {
          route.error = Object.assign(
            new Error('Could not prerender the Relay 404 page', { cause }),
            {
              statusCode: 500,
              statusMessage: 'Static error-page rendering failed',
            },
          )
        }
      },
    },
    prerender: {
      routes: ['/', '/robots.txt', '/sitemap.xml'],
      failOnError: true,
    },
  },
})
