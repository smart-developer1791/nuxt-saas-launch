import manropeFont from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url'
import monoFont from '@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2?url'

export function useLocalFonts() {
  // Keep font faces outside Vite's stylesheet replacement during dev hydration.
  if (import.meta.server) {
    useHead({
      style: [
        {
          key: 'relay-fonts',
          innerHTML: `
            @font-face {
              font-family: 'Manrope Variable';
              font-style: normal;
              font-weight: 200 800;
              font-display: optional;
              src: url('${manropeFont}') format('woff2');
            }
            @font-face {
              font-family: 'DM Mono';
              font-style: normal;
              font-weight: 400;
              font-display: optional;
              src: url('${monoFont}') format('woff2');
            }
          `,
        },
      ],
      link: [
        {
          rel: 'preload',
          href: manropeFont,
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: monoFont,
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
    })
  }
}
