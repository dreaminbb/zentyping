import { createApp } from 'vue'
import App from '@/App.vue';
import pinia from './store/store';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library, type IconPack } from '@fortawesome/fontawesome-svg-core';
import routes from './router';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { code_data } from './store/store';
import { loading_setup } from './module/loading'

library.add(fas as IconPack, far as IconPack, fab as IconPack)
const app = createApp(App)


app.component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(routes)

const markdownFiles = import.meta.glob('./src/md/*.md', { eager: true }) as Record<string, { default: any }>;
// Markdownコンポーネントをグローバル登録
Object.entries(markdownFiles).forEach(([path, module]) => {
  // パスからコンポーネント名を生成（例：./src/md/about.md -> AboutMd）
  const componentName = path
    .split('/')
    .pop()
    ?.replace(/\.md$/, '')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') + 'Md';

  if (componentName) {
    // グローバルコンポーネントとして登録
    app.component(componentName, module.default);
  }
});


loading_setup().then(() => {

  //run the laoding setup process
  code_data().initialize().then(() => {
    app.mount('#app')
  }).catch((error) => {
    console.error('error : some error happened during the initialization of the code data', error)
  })
})

