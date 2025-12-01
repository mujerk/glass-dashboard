<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glass-header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Glass Dashboard
        </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
            <q-btn round dense flat color="white" icon="notifications" @click="handleNotificationClick">
              <q-badge color="red" text-color="white" floating v-if="notificationCount > 0">
                {{ notificationCount }}
              </q-badge>
            </q-btn>
            <q-btn round flat to="/profile">
              <q-avatar size="26px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
            </q-btn>
            <q-btn flat round dense icon="logout" @click="handleLogout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="glass-drawer"
    >
      <q-list>
        <q-item-label header>
          Menu
        </q-item-label>

        <q-item clickable v-ripple to="/dashboard" active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/todo" active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="check_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Todo List</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/calendar" active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="calendar_today" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Calendar</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/board" active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="article" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Board</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/diary" active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="book" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Diary</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/translator" active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="translate" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Translator</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/calculator" active-class="text-primary">
          <q-item-section avatar>
            <q-icon name="calculate" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Calculator</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useQuasar } from 'quasar'
import axios from 'axios'

const leftDrawerOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const notificationCount = ref(0)
const notificationDetails = ref({})

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const fetchNotificationCount = async () => {
  try {
    const response = await axios.get('/api/notifications/count')
    notificationCount.value = response.data.count
    notificationDetails.value = response.data.details
  } catch (error) {
    console.error('Failed to fetch notifications', error)
  }
}

const handleNotificationClick = () => {
  if (notificationCount.value === 0) {
    $q.notify({
      message: 'No new notifications in the last 24 hours.',
      color: 'info'
    })
    return
  }

  const { board, diary, todo } = notificationDetails.value
  $q.notify({
    message: `New updates: Board (${board}), Diary (${diary}), Todo (${todo})`,
    color: 'primary',
    icon: 'notifications',
    position: 'top-right'
  })
  
  // Optional: Clear count locally or navigate to a list
  // notificationCount.value = 0 
}

onMounted(() => {
  fetchNotificationCount()
  // Refresh every minute
  setInterval(fetchNotificationCount, 60000)
})
</script>

<style scoped>
.glass-header {
  background: rgba(25, 118, 210, 0.8);
  backdrop-filter: blur(10px);
}

.glass-drawer {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}
</style>
