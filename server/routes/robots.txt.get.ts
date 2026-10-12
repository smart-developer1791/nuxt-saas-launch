export default defineEventHandler((event) => {
  const origin = new URL(useRuntimeConfig(event).public.siteUrl).origin
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
})
