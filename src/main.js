import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.css'


import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({ components, directives })


import TopBar from './components/layout/TopBar.vue'
import FooterBar from './components/layout/FooterBar.vue'
import SiteNav from './components/SiteNav.vue'


createApp(App)
  .use(router)
  .use(vuetify) 
  .component('TopBar', TopBar)
  .component('FooterBar', FooterBar)
  .component('SiteNav', SiteNav)
  .mount('#app')
