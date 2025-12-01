import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'
import './style.css'



const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Quasar, {
   plugins: {
      Notify,
      Dialog
   },
})

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Axios Interceptor for 401 Unauthorized
axios.interceptors.response.use(
   response => response,
   error => {
      if (error.response && error.response.status === 401) {
         const authStore = useAuthStore()
         // Clear user state
         authStore.user = null
         // Redirect to login page if not already there
         if (router.currentRoute.value.path !== '/login') {
            router.push('/login')
         }
      }
      return Promise.reject(error)
   }
)

app.mount('#app')
