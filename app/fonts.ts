import localFont from 'next/font/local'

export const jakartaSans = localFont({
  src: [
    { path: '../public/fonts/PlusJakartaSans/pjs-latin.woff2' },
    { path: '../public/fonts/PlusJakartaSans/pjs-latinext.woff2' },
    { path: '../public/fonts/PlusJakartaSans/pjs-cyrillic.woff2' },
    { path: '../public/fonts/PlusJakartaSans/pjs-vietnamese.woff2' },
  ],
  variable: '--font-jakarta',
  display: 'swap',
  weight: '600 800',
})

export const vietnamPro = localFont({
  src: [
    { path: '../public/fonts/BeVietnamPro/bvp-400-latin.woff2', weight: '400' },
    { path: '../public/fonts/BeVietnamPro/bvp-500-latin.woff2', weight: '500' },
    { path: '../public/fonts/BeVietnamPro/bvp-600-latin.woff2', weight: '600' },
  ],
  variable: '--font-vietnam',
  display: 'swap',
})

export const cairo = localFont({
  src: [
    { path: '../public/fonts/Cairo/cairo-latin.woff2' },
    { path: '../public/fonts/Cairo/cairo-latinext.woff2' },
    { path: '../public/fonts/Cairo/cairo-arabic.woff2' },
  ],
  variable: '--font-cairo',
  display: 'swap',
  weight: '400 800',
})
