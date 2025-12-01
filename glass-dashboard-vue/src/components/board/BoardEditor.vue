<template>
  <div class="q-pa-none">
    <q-form @submit="handleSubmit">
      <div class="q-mb-md">
        <div class="text-subtitle2 text-grey-8 q-mb-xs">Title</div>
        <q-input
          v-model="title"
          filled
          placeholder="Enter title"
          class="glass-input"
          bg-color="white"
          :rules="[val => !!val || 'Title is required']"
        />
      </div>

      <div class="q-mb-md">
        <div class="text-subtitle2 text-grey-8 q-mb-xs">Content</div>
        <q-editor
          v-model="content"
          min-height="300px"
          :toolbar="[
            ['bold', 'italic', 'strike', 'underline'],
            ['token', 'hr', 'link', 'custom_btn'],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
            ['undo', 'redo'],
            ['viewsource']
          ]"
          content-class="bg-white text-dark"
          toolbar-bg="grey-2"
          toolbar-text-color="dark"
        />
      </div>

      <div class="row justify-end q-gutter-sm q-mt-lg">
        <q-btn flat label="Cancel" color="grey-8" @click="$emit('cancel')" />
        <q-btn type="submit" label="Save" color="primary" unelevated />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({ title: '', content: '' })
  }
})

const emit = defineEmits(['save', 'cancel'])

const title = ref(props.initialData.title || '')
const content = ref(props.initialData.content || '')

const handleSubmit = () => {
  emit('save', { title: title.value, content: content.value })
}
</script>

<style scoped>
.glass-card {
  background: rgba(30, 30, 47, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.glass-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.05);
}
</style>
