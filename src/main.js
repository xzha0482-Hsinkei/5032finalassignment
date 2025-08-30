import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'


import './styles/index.css'

import TopBar from './components/layout/TopBar.vue'
import FooterBar from './components/layout/FooterBar.vue'
import SiteNav from './components/SiteNav.vue'

createApp(App)
  .use(router)
  .component('TopBar', TopBar)
  .component('FooterBar', FooterBar)
  .component('SiteNav', SiteNav)
  .mount('#app')
