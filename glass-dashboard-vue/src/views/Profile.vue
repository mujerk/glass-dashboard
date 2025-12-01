<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md glass-card" style="width: 400px; max-width: 90vw;">
          <q-card-section class="text-center">
            <div class="text-h5 text-weight-bold text-primary">Edit Profile</div>
            <div class="text-subtitle2 text-grey">Update your personal information</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <q-input
                filled
                v-model="formData.username"
                label="Username (ID)"
                readonly
                hint="Username cannot be changed"
              />

              <q-input
                filled
                type="password"
                v-model="formData.currentPassword"
                label="Current Password"
                :rules="[ val => val && val.length > 0 || 'Please enter your current password to save changes']"
              />

              <q-input
                filled
                :type="isPwd ? 'password' : 'text'"
                v-model="formData.password"
                label="New Password"
                hint="Leave blank to keep current password"
                :rules="[
                  val => !val || /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(val) || 'Password must contain at least 8 characters, including letters, numbers, and special characters'
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

              <div class="q-px-sm q-mb-md" v-if="formData.password">
                <div class="text-caption q-mb-xs">Password Strength</div>
                <q-linear-progress :value="passwordStrength / 4" :color="passwordStrengthColor" track-color="grey-3" class="q-mb-xs" />
                <div class="text-caption text-right" :class="`text-${passwordStrengthColor}`">{{ passwordStrengthLabel }}</div>
              </div>

              <q-input
                filled
                :type="isPwdConfirm ? 'password' : 'text'"
                v-model="formData.confirmPassword"
                label="Confirm New Password"
                v-if="formData.password"
                :rules="[
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

              <div class="row q-gutter-sm">
                <q-btn label="Cancel" color="grey" class="col" flat to="/dashboard" />
                <q-btn label="Save Changes" type="submit" color="primary" class="col" unelevated />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

import { computed } from 'vue'

const $q = useQuasar()
const authStore = useAuthStore()
const router = useRouter()

const formData = reactive({
  username: '',
  currentPassword: '',
  password: '',
  confirmPassword: '',
  name: '',
  gender: 'Other'
})

const isPwd = ref(true)
const isPwdConfirm = ref(true)
const error = ref('')

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

onMounted(() => {
  // Load current user data
  if (authStore.user) {
    formData.username = authStore.user.username
    formData.name = authStore.user.name
    formData.gender = authStore.user.gender || 'Other'
  }
})

const handleSubmit = async () => {
  error.value = ''
  try {
    // In a real app, you would send the update to the backend
    // await axios.put('/api/auth/profile', formData)
    
    // Mock update for now
    authStore.user.name = formData.name
    authStore.user.gender = formData.gender
    
    $q.notify({
      color: 'positive',
      message: 'Profile updated successfully!'
    })
    router.push('/dashboard')
  } catch (err) {
    console.error(err)
    error.value = 'Failed to update profile'
    $q.notify({
      color: 'negative',
      message: error.value
    })
  }
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
</style>
