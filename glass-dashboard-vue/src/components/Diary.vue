<template>
  <div class="q-pa-md full-height">
    <div class="row q-col-gutter-md full-height">
      <!-- Input Section -->
      <div class="col-12 col-md-4">
        <q-card class="glass-card full-height column">
          <q-card-section class="bg-primary text-white q-py-md">
            <div class="text-h6 text-weight-bold flex items-center">
              <q-icon name="edit_note" class="q-mr-sm" />
              Write Diary
            </div>
            <div class="text-caption text-white" style="opacity: 0.8">
              {{ new Date().toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </div>
          </q-card-section>

          <q-card-section class="col column q-pa-md">
            <q-input
              v-model="content"
              type="textarea"
              filled
              placeholder="How was your day?"
              class="col glass-input"
              bg-color="white"
              input-style="height: 100%; resize: none;"
            />
            <q-btn
              color="primary"
              class="full-width q-mt-md shadow-2"
              icon="save"
              label="Save Entry"
              @click="saveEntry"
              unelevated
              size="lg"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- List Section -->
      <div class="col-12 col-md-8">
        <q-card class="glass-card full-height column">
          <q-card-section class="bg-white text-primary q-py-sm border-bottom">
            <div class="text-h6 text-weight-bold flex items-center">
              <q-icon name="history_edu" class="q-mr-sm" />
              Your Stories
            </div>
          </q-card-section>

          <q-card-section class="col q-pa-none scroll">
            <q-timeline color="secondary" class="q-pa-md">
              <q-timeline-entry
                v-for="entry in entries"
                :key="entry.id"
                :title="new Date(entry.date).toLocaleDateString()"
                :subtitle="new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })"
                icon="book"
              >
                <q-card flat bordered class="bg-white">
                  <q-card-section>
                    <div class="text-body1" style="white-space: pre-wrap;">{{ entry.content }}</div>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deleteEntry(entry.id)" />
                  </q-card-actions>
                </q-card>
              </q-timeline-entry>
            </q-timeline>

            <div v-if="entries.length === 0" class="flex flex-center full-height text-grey-6 column">
              <q-icon name="auto_stories" size="4rem" class="q-mb-md opacity-50" />
              <div class="text-h6">No entries yet</div>
              <div class="text-subtitle2">Start writing your first diary entry!</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const entries = ref([])
const content = ref('')
const API_URL = '/api/diary'

const fetchEntries = async () => {
  try {
    const response = await axios.get(API_URL)
    if (Array.isArray(response.data)) {
      entries.value = response.data.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else {
      entries.value = []
    }
  } catch (error) {
    console.error('Error fetching diary entries:', error)
  }
}

const saveEntry = async () => {
  if (!content.value.trim()) return

  try {
    const response = await axios.post(API_URL, {
      content: content.value,
      date: new Date().toISOString()
    })
    entries.value.unshift(response.data)
    content.value = ''
  } catch (error) {
    console.error('Error saving diary entry:', error)
  }
}

const deleteEntry = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
    entries.value = entries.value.filter(entry => entry.id !== id)
  } catch (error) {
    console.error('Error deleting diary entry:', error)
  }
}

onMounted(() => {
  fetchEntries()
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
</style>
