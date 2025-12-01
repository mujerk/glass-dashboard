<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <Calculator />
      </div>
      <div class="col-12 col-md-4">
        <TodoList />
      </div>
      <div class="col-12 col-md-4">
        <EventList />
      </div>
    </div>
  </div>
</template>

<script setup>
import Calculator from '@/components/Calculator.vue'
import TodoList from '@/components/TodoList.vue'
import EventList from '@/components/EventList.vue'
</script>
