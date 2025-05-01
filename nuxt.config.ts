// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
import Material from '@primeuix/themes/material';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '_nuxt/static/favicon.svg' }
      ]
    }
  },
  css: [
    '~/assets/css/main.css'
  ],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['nuxt-echarts', '@primevue/nuxt-module'],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { 'echarts/lib/util/number': 'echarts/lib/util/number.js' },
    },
  },
  primevue: {
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Material,
        options: {
          prefix: 'p',
          darkModeSelector: '.my-app-dark',
          cssLayer: false
        }
      }
    }
  },
  echarts: {
    renderer: ['svg', 'canvas'],
    charts: ['LineChart'],
    components: [
      'DatasetComponent',
      'GridComponent',
      'TooltipComponent',
      'ToolboxComponent',
      'GeoComponent',
      'VisualMapComponent',
      'LegendComponent'
    ],  
  },
  build: { transpile: ['echarts-liquidfill'] },
})