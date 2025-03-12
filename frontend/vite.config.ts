import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    // VueDevTools()
  ],
  server: {
    port: 8000
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  define: {
    SITE_NAME: JSON.stringify(process.env.SITE_NAME as string),
    API_URL: JSON.stringify(process.env.API_URL as string),
    VITE_API_URL_RETURN_CODE_DATA: JSON.stringify(process.env.VITE_API_URL_RETURN_CODE_DATA as string),
  }
})