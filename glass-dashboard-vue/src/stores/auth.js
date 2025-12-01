import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
   const user = ref(null)
   const loading = ref(true)

   const checkUserLoggedIn = async () => {
      try {
         const response = await axios.get('/api/user/me')
         user.value = response.data
      } catch (error) {
         console.error("Error checking login status", error)
         user.value = null
      } finally {
         loading.value = false
      }
   }

   const login = async (username, password) => {
      const params = new URLSearchParams()
      params.append('username', username)
      params.append('password', password)

      try {
         await axios.post('/api/auth/login', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         })
         await checkUserLoggedIn()
         return true
      } catch (error) {
         return false
      }
   }

   const logout = async () => {
      try {
         await axios.post('/api/auth/logout')
         user.value = null
      } catch (error) {
         console.error("Logout failed", error)
      }
   }

   return { user, loading, checkUserLoggedIn, login, logout }
})
