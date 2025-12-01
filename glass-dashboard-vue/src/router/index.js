import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardHome from '@/views/DashboardHome.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import { useAuthStore } from '@/stores/auth'

// Placeholder views for other routes
import Calculator from '@/components/Calculator.vue'
import TodoList from '@/components/TodoList.vue'
import Calendar from '@/components/Calendar.vue'
import Diary from '@/components/Diary.vue'
import Translator from '@/components/Translator.vue'
import Board from '@/views/Board.vue'
import Profile from '@/views/Profile.vue'

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/',
         redirect: '/dashboard'
      },
      {
         path: '/login',
         name: 'login',
         component: Login
      },
      {
         path: '/signup',
         name: 'signup',
         component: Signup
      },
      {
         path: '/',
         component: DashboardLayout,
         children: [
            {
               path: 'dashboard',
               name: 'dashboard',
               component: DashboardHome
            },
            {
               path: 'calculator',
               name: 'calculator',
               component: Calculator
            },
            {
               path: 'todo',
               name: 'todo',
               component: TodoList
            },
            {
               path: 'calendar',
               name: 'calendar',
               component: Calendar
            },
            {
               path: 'diary',
               name: 'diary',
               component: Diary
            },
            {
               path: 'translator',
               name: 'translator',
               component: Translator
            },
            {
               path: 'board',
               name: 'board',
               component: Board
            },
            {
               path: 'profile',
               name: 'profile',
               component: Profile
            }
         ]
      }
   ]
})

router.beforeEach(async (to, from, next) => {
   const publicPages = ['/login', '/signup']
   const authRequired = !publicPages.includes(to.path)
   const auth = useAuthStore()

   // If auth is required and user is not logged in, check login status
   if (authRequired && !auth.user) {
      await auth.checkUserLoggedIn()
      if (!auth.user) {
         return next('/login')
      }
   }

   // If user is logged in and tries to access login/signup, redirect to dashboard
   if (auth.user && publicPages.includes(to.path)) {
      return next('/dashboard')
   }

   next()
})

export default router
