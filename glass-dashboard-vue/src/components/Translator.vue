<template>
  <div class="q-pa-md">
    <q-card class="my-card shadow-sm glass-card column">
      <q-card-section class="bg-white text-secondary q-pt-md q-pb-sm">
        <div class="text-h6 text-weight-bold">Local Translator</div>
      </q-card-section>

      <q-card-section class="col column q-pa-md">
        <q-form @submit="handleSearch" class="q-mb-lg">
          <q-input
            v-model="input"
            filled
            placeholder="Enter word (En/Ko)..."
            class="glass-input"
            bg-color="white"
          >
            <template v-slot:append>
              <q-btn round dense flat icon="search" color="primary" type="submit" />
            </template>
          </q-input>
        </q-form>

        <div class="bg-grey-2 q-pa-lg rounded-borders column flex-center q-mb-lg border-grey-3" style="min-height: 120px; border: 1px solid #e0e0e0">
          <div class="text-h6 text-weight-medium text-center text-dark">
            <span v-if="result">{{ result }}</span>
            <span v-else class="text-grey-6">Translation will appear here</span>
          </div>
        </div>

        <div class="col-auto mt-auto">
          <q-btn
            flat
            dense
            no-caps
            color="primary"
            icon="add"
            label="Add new word"
            class="q-mb-sm"
            @click="isAdding = !isAdding"
          />

          <q-slide-transition>
            <div v-if="isAdding">
              <q-card flat bordered class="bg-grey-1 q-pa-md">
                <div class="column q-gutter-sm">
                  <q-input
                    v-model="newWord.key"
                    dense
                    filled
                    bg-color="white"
                    placeholder="Word (e.g., Apple)"
                  />
                  <q-input
                    v-model="newWord.value"
                    dense
                    filled
                    bg-color="white"
                    placeholder="Translation (e.g., 사과)"
                  />
                  <q-btn
                    color="positive"
                    label="Save to Dictionary"
                    class="full-width"
                    unelevated
                    @click="handleAddWord"
                  />
                </div>
              </q-card>
            </div>
          </q-slide-transition>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const initialDictionary = {
  'hello': '안녕하세요',
  'world': '세상',
  'love': '사랑',
  'computer': '컴퓨터',
  'glass': '유리',
  'water': '물',
  'fire': '불',
  'sky': '하늘',
  'earth': '지구',
  'moon': '달',
  'sun': '태양',
  'star': '별',
  'friend': '친구',
  'family': '가족',
  'school': '학교',
  'work': '일',
  'money': '돈',
  'time': '시간',
  'day': '일 (하루)',
  'night': '밤',
  '안녕하세요': 'Hello',
  '세상': 'World',
  '사랑': 'Love',
  '컴퓨터': 'Computer',
  '감사합니다': 'Thank you',
  '미안합니다': 'Sorry'
}

const dictionary = ref(initialDictionary)
const saved = localStorage.getItem('glass-dictionary')
if (saved) {
  dictionary.value = { ...initialDictionary, ...JSON.parse(saved) }
}

const input = ref('')
const result = ref('')
const isAdding = ref(false)
const newWord = reactive({ key: '', value: '' })

const handleSearch = () => {
  if (!input.value.trim()) return

  const term = input.value.toLowerCase().trim()
  const translation = dictionary.value[term]

  if (translation) {
    result.value = translation
  } else {
    result.value = 'Word not found in local dictionary.'
  }
}

const handleAddWord = () => {
  if (!newWord.key || !newWord.value) return

  const updatedDict = {
    ...dictionary.value,
    [newWord.key.toLowerCase()]: newWord.value,
    [newWord.value.toLowerCase()]: newWord.key // Bi-directional
  }

  dictionary.value = updatedDict
  localStorage.setItem('glass-dictionary', JSON.stringify(updatedDict))
  isAdding.value = false
  newWord.key = ''
  newWord.value = ''
  alert('Word added!')
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
</style>
