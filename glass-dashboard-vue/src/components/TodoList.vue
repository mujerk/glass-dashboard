<template>
  <div class="q-pa-md">
    <q-card class="my-card shadow-sm glass-card">
      <q-card-section class="bg-white text-secondary q-pt-md q-pb-sm">
        <div class="text-h6 text-weight-bold">To-Do List</div>
        <div class="text-caption text-grey-7">Manage your tasks</div>
      </q-card-section>

      <q-card-section class="q-px-md q-pt-md q-pb-none">
        <q-form @submit.prevent="addTodo">
          <q-input
            v-model="input"
            filled
            placeholder="Add a task..."
            class="glass-input"
            bg-color="white"
            dense
            @keyup.enter="addTodo"
          >
            <template v-slot:append>
              <q-btn round dense flat icon="add" color="primary" @click="addTodo" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-list separator class="rounded-borders bg-grey-1 border-grey-3" style="border: 1px solid #e0e0e0">
          <q-item v-if="todos.length === 0" class="q-pa-md flex-center">
            <q-item-section class="text-center text-grey-6">
              No tasks yet. Add one above!
            </q-item-section>
          </q-item>

          <q-item
            v-for="todo in todos"
            :key="todo.id"
            tag="label"
            v-ripple
            class="bg-white"
          >
            <q-item-section avatar>
              <q-checkbox v-model="todo.completed" @update:model-value="toggleTodo(todo.id)" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="{ 'text-strike text-grey-5': todo.completed, 'text-dark': !todo.completed }">
                {{ todo.text }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round dense color="negative" icon="delete" size="md" @click.stop="onDelete(todo.id)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const todos = ref([])
const input = ref('')
const API_URL = '/api/todos'

const fetchTodos = async () => {
  try {
    const response = await axios.get(API_URL)
    if (Array.isArray(response.data)) {
      todos.value = response.data
    } else {
      todos.value = []
    }
  } catch (error) {
    console.error('Error fetching todos:', error)
    // Fallback
    if (todos.value.length === 0) {
        todos.value = [
            { id: 1, text: 'Quasar Migration', completed: true },
            { id: 2, text: 'Check UI Components', completed: false },
        ]
    }
  }
}

const addTodo = async () => {
  if (!input.value.trim()) return

  try {
    const response = await axios.post(API_URL, { text: input.value, completed: false })
    todos.value.push(response.data)
    input.value = ''
    $q.notify({
      color: 'positive',
      message: 'Task added',
      icon: 'check',
      position: 'top'
    })
  } catch (error) {
    console.error('Error adding todo:', error)
    // Fallback
    const newTodo = { id: Date.now(), text: input.value, completed: false }
    todos.value.push(newTodo)
    input.value = ''
  }
}

const toggleTodo = async (id) => {
  const todoToUpdate = todos.value.find(t => t.id === id)
  if (!todoToUpdate) return

  try {
    await axios.put(`${API_URL}/${id}`, {
      ...todoToUpdate,
      completed: todoToUpdate.completed
    })
  } catch (error) {
    console.error('Error updating todo:', error)
  }
}

const onDelete = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
    todos.value = todos.value.filter(t => t.id !== id)
    $q.notify({
      message: 'Task deleted',
      color: 'negative',
      icon: 'delete',
      position: 'top'
    })
  } catch (error) {
    console.error('Error deleting todo:', error)
    // Fallback
    todos.value = todos.value.filter(t => t.id !== id)
  }
}

onMounted(() => {
  fetchTodos()
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.glass-input :deep(.q-field__control) {
  background: white;
}
</style>

