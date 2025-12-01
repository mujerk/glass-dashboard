<template>
  <div class="q-pa-none">
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h5 text-weight-bold">{{ post.title }}</div>
      <div class="text-subtitle2 text-grey-7">
        <span class="q-mr-md">By {{ post.author ? post.author.name : 'Unknown' }}</span>
        <span>{{ new Date(post.createdAt || post.date).toLocaleDateString() }}</span>
      </div>
    </div>

    <q-separator class="q-mb-lg" />

    <div class="board-content q-mb-xl text-body1" v-html="post.content"></div>

    <q-separator class="q-mb-md" />

    <div class="row justify-between">
      <q-btn flat label="Back to List" icon="arrow_back" color="grey-8" @click="$emit('back')" />
      <div class="row q-gutter-sm">
        <!-- Temporarily showing buttons always for debugging, or check prop -->
        <q-btn flat label="Edit" icon="edit" color="warning" @click="$emit('edit', post)" />
        <q-btn flat label="Delete" icon="delete" color="negative" @click="$emit('delete', post.id)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: Object,
  currentUser: Object
})

defineEmits(['back', 'edit', 'delete'])

// const isAuthor = computed(() => {
//   return props.currentUser && props.post.author && props.currentUser.username === props.post.author.username
// })
</script>
