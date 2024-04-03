import App from './App.vue'
import { createApp } from 'vue'

const app = createApp(App)
app.mount('#app')

const sex = document.getElementById('sex')

sex.addEventListener('click', () => {
  console.log('sex')
})
