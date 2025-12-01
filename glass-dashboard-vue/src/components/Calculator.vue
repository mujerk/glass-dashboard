<template>
  <div class="q-pa-md">
    <q-card class="my-card shadow-sm glass-card column">
      <q-card-section class="bg-white text-secondary q-pt-md q-pb-sm">
        <div class="text-h6 text-weight-bold">Calculator</div>
      </q-card-section>

      <q-card-section class="col column q-pa-md">
        <div class="bg-grey-2 q-pa-md rounded-borders q-mb-md text-right border-grey-3" style="border: 1px solid #e0e0e0">
          <div class="text-grey-7 text-caption text-weight-bold" style="min-height: 1.5rem">{{ equation }}</div>
          <div class="text-h4 text-weight-bold text-dark">{{ display }}</div>
        </div>

        <div class="row q-col-gutter-sm col">
          <div class="col-12">
            <q-btn color="negative" label="Clear" class="full-width" @click="clear" unelevated />
          </div>
          <div class="col-3" v-for="btn in buttons" :key="btn">
            <q-btn
              class="full-width full-height text-weight-bold"
              :color="getBtnColor(btn)"
              :text-color="getBtnTextColor(btn)"
              :label="btn"
              unelevated
              @click="handleButtonClick(btn)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const display = ref('0')
const equation = ref('')

const buttons = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '=', '+'
]

const handleNumber = (num) => {
  display.value = display.value === '0' ? num : display.value + num
  equation.value = equation.value + num
}

const handleOperator = (op) => {
  display.value = '0'
  equation.value = equation.value + ' ' + op + ' '
}

const calculate = () => {
  try {
    // Note: eval is generally unsafe, but for a simple calculator port it's acceptable if input is controlled.
    // In a production app, use a math parser.
    // eslint-disable-next-line no-eval
    const result = eval(equation.value)
    display.value = String(result)
    equation.value = String(result)
  } catch (error) {
    display.value = 'Error'
    equation.value = ''
  }
}

const clear = () => {
  display.value = '0'
  equation.value = ''
}

const handleButtonClick = (btn) => {
  if (btn === '=') calculate()
  else if (['+', '-', '*', '/'].includes(btn)) handleOperator(btn)
  else handleNumber(btn)
}

const getBtnColor = (btn) => {
  if (btn === '=') return 'primary'
  if (['+', '-', '*', '/'].includes(btn)) return 'secondary'
  return 'white'
}

const getBtnTextColor = (btn) => {
  if (['=', '+', '-', '*', '/'].includes(btn)) return 'white'
  return 'dark'
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
</style>
