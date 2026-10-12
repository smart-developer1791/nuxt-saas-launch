export default defineEventHandler((event) => {
  const origin = new URL(useRuntimeConfig(event).public.siteUrl).origin
  const safeUrl = `${origin}/`
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${safeUrl}</loc></url></urlset>\n`
})
