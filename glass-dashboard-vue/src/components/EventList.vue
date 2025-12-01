<template>
  <q-card class="glass-card full-height">
    <q-card-section class="bg-white text-secondary q-pb-sm">
      <div class="text-h6 text-weight-bold">Upcoming Events</div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-scroll-area style="height: 300px;">
        <q-list separator>
          <q-item v-for="event in sortedEvents" :key="event.id" v-ripple>
            <q-item-section avatar>
              <q-icon name="event" :style="{ color: event.color || 'primary' }" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">{{ event.title }}</q-item-label>
              <q-item-label caption>
                {{ formatDate(event.startDate) }} ~ {{ formatDate(event.endDate) }}
              </q-item-label>
            </q-item-section>
          </q-item>
          
          <q-item v-if="sortedEvents.length === 0">
            <q-item-section class="text-center text-grey">
              No upcoming events
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const events = ref([])
const API_URL = '/api/events'

const fetchEvents = async () => {
  try {
    const response = await axios.get(API_URL)
    if (Array.isArray(response.data)) {
      events.value = response.data
    } else {
      events.value = []
    }
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}

const sortedEvents = computed(() => {
  return [...events.value].sort((a, b) => {
    if (a.startDate < b.startDate) return -1
    if (a.startDate > b.startDate) return 1
    return 0
  })
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
</style>
