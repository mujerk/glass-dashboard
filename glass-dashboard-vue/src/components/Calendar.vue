<template>
  <div class="q-pa-md">
    <q-card class="my-card shadow-sm glass-card" @mouseup="handleMouseUp">
      <q-card-section class="bg-white text-secondary q-pt-md q-pb-sm flex justify-between items-center">
        <div class="text-h6 text-weight-bold">
          {{ currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) }}
        </div>
        <div class="flex q-gutter-xs">
          <q-btn flat round dense icon="chevron_left" @click="prevMonth" />
          <q-btn flat round dense icon="chevron_right" @click="nextMonth" />
        </div>
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <div class="row text-center q-mb-sm text-grey-7 text-caption text-weight-bold">
          <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="col">
            {{ day }}
          </div>
        </div>

        <div class="flex flex-wrap calendar-grid">
          <div v-for="blank in blanks" :key="`blank-${blank}`" class="calendar-cell"></div>
          <div
            v-for="day in days"
            :key="day"
            class="calendar-cell q-pa-xs"
            @mousedown="handleMouseDown(day)"
            @mouseenter="handleMouseEnter(day)"
          >
            <div
              class="full-width full-height column rounded-borders overflow-hidden relative-position transition-generic"
              :class="{
                'bg-primary-opacity text-primary border-primary': isSelected(day),
                'bg-white hover-bg-grey-2 border-grey-3': !isSelected(day),
                'border-primary border-2': isToday(day)
              }"
              style="border-width: 1px; border-style: solid; cursor: pointer; user-select: none;"
            >
              <span class="q-ml-xs q-mt-xs text-weight-bold" :class="isToday(day) ? 'text-primary' : 'text-grey-8'">
                {{ day }}
              </span>

              <div class="column q-gutter-y-xs q-px-xs q-mt-xs overflow-hidden">
                <div
                  v-for="event in getEventsForDay(day)"
                  :key="event.id"
                  class="rounded-borders q-px-xs text-white ellipsis"
                  :style="{ backgroundColor: event.color, fontSize: '0.65rem', height: '16px', lineHeight: '16px' }"
                  :title="event.title"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Add Event Dialog -->
      <q-dialog v-model="showModal">
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Add Event</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <p class="text-grey-7 q-mb-md">
              Date Range: {{ currentDate.getFullYear() }}-{{ currentDate.getMonth() + 1 }}-{{ Math.min(selectionStart || 0, selectionEnd || 0) }} to {{ Math.min(selectionStart || 0, selectionEnd || 0) !== Math.max(selectionStart || 0, selectionEnd || 0) ? `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${Math.max(selectionStart || 0, selectionEnd || 0)}` : '' }}
            </p>
            <q-form @submit="handleSaveEvent" class="q-gutter-md">
              <q-input
                filled
                v-model="newEventTitle"
                label="Event Title"
                placeholder="Meeting, Vacation, etc."
                ref="titleInput"
                :rules="[val => !!val || 'Field is required']"
              />
              <q-input
                filled
                v-model="newEventColor"
                label="Color"
                class="my-input"
              >
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="newEventColor" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup @click="handleCloseModal" />
            <q-btn flat label="Save Event" @click="handleSaveEvent" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'

const currentDate = ref(new Date())
const events = ref([])
const API_URL = '/api/events'

// Selection State
const isDragging = ref(false)
const selectionStart = ref(null)
const selectionEnd = ref(null)

// Modal State
const showModal = ref(false)
const newEventTitle = ref('')
const newEventColor = ref('#0d6efd')
const titleInput = ref(null)

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

const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

const daysInMonth = computed(() => getDaysInMonth(currentDate.value))
const firstDay = computed(() => getFirstDayOfMonth(currentDate.value))
const days = computed(() => Array.from({ length: daysInMonth.value }, (_, i) => i + 1))
const blanks = computed(() => Array.from({ length: firstDay.value }, (_, i) => i))

// --- Drag & Drop Logic ---

const handleMouseDown = (day) => {
  isDragging.value = true
  selectionStart.value = day
  selectionEnd.value = day
}

const handleMouseEnter = (day) => {
  if (isDragging.value) {
    selectionEnd.value = day
  }
}

const handleMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    showModal.value = true
    nextTick(() => {
      titleInput.value?.focus()
    })
  }
}

const isSelected = (day) => {
  if (selectionStart.value === null || selectionEnd.value === null) return false
  const start = Math.min(selectionStart.value, selectionEnd.value)
  const end = Math.max(selectionStart.value, selectionEnd.value)
  return day >= start && day <= end
}

// --- Event Logic ---

const handleSaveEvent = async () => {
  if (!newEventTitle.value.trim() || selectionStart.value === null || selectionEnd.value === null) return

  const startDay = Math.min(selectionStart.value, selectionEnd.value)
  const endDay = Math.max(selectionStart.value, selectionEnd.value)

  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const formatDate = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${y}-${mm}-${dd}`
  }

  const startDate = formatDate(year, month, startDay)
  const endDate = formatDate(year, month, endDay)

  try {
    const response = await axios.post(API_URL, {
      title: newEventTitle.value,
      startDate: startDate,
      endDate: endDate,
      color: newEventColor.value
    })
    events.value.push(response.data)
    handleCloseModal()
  } catch (error) {
    console.error('Error saving event:', error)
  }
}

const handleCloseModal = () => {
  showModal.value = false
  newEventTitle.value = ''
  selectionStart.value = null
  selectionEnd.value = null
}

const getEventsForDay = (day) => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  const targetDate = `${year}-${mm}-${dd}`

  const eventsForDay = events.value.filter(event => {
    return targetDate >= event.startDate && targetDate <= event.endDate
  })

  // Sort by start date
  return eventsForDay.sort((a, b) => {
    if (a.startDate < b.startDate) return -1
    if (a.startDate > b.startDate) return 1
    return 0
  })
}

const isToday = (day) => {
  const today = new Date()
  return (
    day === today.getDate() &&
    currentDate.value.getMonth() === today.getMonth() &&
    currentDate.value.getFullYear() === today.getFullYear()
  )
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

.calendar-grid {
  display: flex;
  flex-wrap: wrap;
}

.calendar-cell {
  width: 14.28%; /* 100% / 7 */
  min-height: 100px;
  height: auto;
}

.bg-primary-opacity {
  background-color: rgba(25, 118, 210, 0.15);
}

.border-primary {
  border-color: var(--q-primary) !important;
}

.border-grey-3 {
  border-color: #e0e0e0;
}

.hover-bg-grey-2:hover {
  background-color: #f5f5f5;
}

.transition-generic {
  transition: all 0.2s ease;
}

.my-input :deep(.q-field__append) {
  padding: 0;
}
</style>
