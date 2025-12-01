<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md glass-card" style="width: 400px; max-width: 90vw;">
          <q-card-section class="text-center">
            <div class="text-h5 text-weight-bold text-primary">Log In</div>
            <div class="text-subtitle2 text-grey">Welcome back!</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <q-input
                filled
                v-model="username"
                label="Username"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              />

              <q-input
                filled
                :type="isPwd ? 'password' : 'text'"
                v-model="password"
                label="Password"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type your password']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div v-if="error" class="text-negative text-center q-mb-md">
                {{ error }}
              </div>

              <div>
                <q-btn label="Log In" type="submit" color="primary" class="full-width" unelevated />
              </div>
            </q-form>
          </q-card-section>

          <q-card-section class="text-center q-pt-none">
            <div class="q-mb-md text-grey-7">OR</div>
            <q-btn
              outline
              color="grey-8"
              icon="img:https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              label="Log In with Google"
              class="full-width"
              href="/oauth2/authorization/google"
              type="a"
            />
          </q-card-section>

          <q-card-section class="text-center q-mt-md">
            <div class="text-grey-8">
              Need an account? <RouterLink to="/signup" class="text-primary text-weight-bold" style="text-decoration: none;">Sign Up</RouterLink>
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const username = ref('')
const password = ref('')
const isPwd = ref(true)
const error = ref('')
const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const handleSubmit = async () => {
  error.value = ''
  try {
    const success = await authStore.login(username.value, password.value)
    if (success) {
      router.push('/')
      $q.notify({
        color: 'positive',
        message: 'Logged in successfully'
      })
    } else {
      error.value = 'Failed to log in. Please check your credentials.'
      $q.notify({
        color: 'negative',
        message: 'Login failed'
      })
    }
  } catch (err) {
    console.error(err)
    error.value = 'An error occurred during login.'
  }
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
</style>
