<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md glass-card" style="width: 400px; max-width: 90vw;">
          <q-card-section class="text-center">
            <div class="text-h5 text-weight-bold text-primary">Sign Up</div>
            <div class="text-subtitle2 text-grey">Create your account</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <q-input
                filled
                v-model="formData.username"
                label="Username (ID)"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              />

              <q-input
                filled
                :type="isPwd ? 'password' : 'text'"
                v-model="formData.password"
                label="Password"
                lazy-rules
                :rules="[
                  val => val && val.length > 0 || 'Please type your password',
                  val => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(val) || 'Password must contain at least 8 characters, including letters, numbers, and special characters'
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="q-px-sm q-mb-md">
                <div class="text-caption q-mb-xs">Password Strength</div>
                <q-linear-progress :value="passwordStrength / 4" :color="passwordStrengthColor" track-color="grey-3" class="q-mb-xs" />
                <div class="text-caption text-right" :class="`text-${passwordStrengthColor}`">{{ passwordStrengthLabel }}</div>
              </div>

              <q-input
                filled
                :type="isPwdConfirm ? 'password' : 'text'"
                v-model="formData.confirmPassword"
                label="Confirm Password"
                lazy-rules
                :rules="[
                  val => val && val.length > 0 || 'Please confirm your password',
                  val => val === formData.password || 'Passwords do not match'
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwdConfirm = !isPwdConfirm"
                  />
                </template>
              </q-input>

              <q-input
                filled
                v-model="formData.name"
                label="Name"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type your name']"
              />

              <q-select
                filled
                v-model="formData.gender"
                :options="['Male', 'Female', 'Other']"
                label="Gender"
              />

              <div v-if="error" class="text-negative text-center q-mb-md">
                {{ error }}
              </div>

              <div>
                <q-btn label="Sign Up" type="submit" color="primary" class="full-width" unelevated />
              </div>
            </q-form>
          </q-card-section>

          <q-card-section class="text-center q-mt-md">
            <div class="text-grey-8">
              Already have an account? <RouterLink to="/login" class="text-primary text-weight-bold" style="text-decoration: none;">Log In</RouterLink>
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

import { computed } from 'vue'

const $q = useQuasar()
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  gender: 'Other'
})
const isPwd = ref(true)
const isPwdConfirm = ref(true)
const error = ref('')
const router = useRouter()

const passwordStrength = computed(() => {
  let score = 0
  const pwd = formData.password
  if (!pwd) return 0
  if (pwd.length >= 8) score++
  if (/[A-Za-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[@$!%*#?&]/.test(pwd)) score++
  return score
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value <= 1) return 'red'
  if (passwordStrength.value === 2) return 'orange'
  if (passwordStrength.value === 3) return 'blue'
  return 'green'
})

const passwordStrengthLabel = computed(() => {
  if (passwordStrength.value <= 1) return 'Weak'
  if (passwordStrength.value === 2) return 'Fair'
  if (passwordStrength.value === 3) return 'Good'
  return 'Strong'
})

const handleSubmit = async () => {
  error.value = ''
  try {
    const response = await axios.post('/api/auth/signup', formData)
    $q.notify({
      color: 'positive',
      message: 'Account created successfully! Please log in.'
    })
    router.push('/login')
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || 'Failed to sign up'
    $q.notify({
      color: 'negative',
      message: error.value
    })
  }
}
</script>
