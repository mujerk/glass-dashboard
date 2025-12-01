<template>
  <div class="q-pa-md">
    <q-card class="glass-card">
      <q-card-section class="bg-white text-secondary q-pt-md q-pb-sm flex justify-between items-center">
        <div class="text-h6 text-weight-bold">Board</div>
        <q-btn
          v-if="viewMode === 'list'"
          color="primary"
          icon="edit"
          label="Write New Post"
          @click="viewMode = 'write'"
          unelevated
          size="sm"
        />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <div v-if="viewMode === 'list'">
          <q-table
            :rows="paginatedPosts"
            :columns="columns"
            row-key="id"
            flat
            bordered
            class="bg-transparent"
            :pagination="initialPagination"
            hide-pagination
          >
            <template v-slot:header="props">
              <q-tr :props="props" class="bg-grey-1">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-grey-8 text-weight-bold">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" @click="viewPost(props.row)" class="cursor-pointer hover-bg-grey-2 bg-white">
                <q-td v-for="col in props.cols" :key="col.name" :props="props" class="text-dark">
                  <template v-if="col.name === 'actions'">
                    <div class="row justify-center q-gutter-xs" @click.stop>
                      <q-btn flat round dense color="warning" icon="edit" size="sm" @click="editPost(props.row)" />
                      <q-btn flat round dense color="negative" icon="delete" size="sm" @click="deletePost(props.row.id)" />
                    </div>
                  </template>
                  <template v-else-if="col.name === 'title'">
                    <div class="ellipsis" style="max-width: 200px">{{ col.value }}</div>
                    <div class="lt-sm text-grey-7 text-right q-mt-xs" style="font-size: 11px">
                      {{ props.row.date }} <span class="q-mx-xs">|</span> {{ props.row.author }}
                    </div>
                  </template>
                  <template v-else>
                    {{ col.value }}
                  </template>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <div class="row justify-center q-py-md bg-white">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :max-pages="5"
              boundary-numbers
              direction-links
              color="primary"
              active-color="primary"
              active-text-color="white"
            />
          </div>
        </div>

        <div v-else-if="viewMode === 'write'" class="q-pa-md bg-white">
          <BoardEditor @save="savePost" @cancel="viewMode = 'list'" />
        </div>

        <div v-else-if="viewMode === 'view'" class="q-pa-md bg-white">
          <BoardView
            :post="selectedPost"
            :currentUser="authStore.user"
            @back="viewMode = 'list'"
            @edit="editPost"
            @delete="deletePost"
          />
        </div>

        <div v-else-if="viewMode === 'edit'" class="q-pa-md bg-white">
          <BoardEditor
            :initial-data="selectedPost"
            @save="updatePost"
            @cancel="viewMode = 'view'"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useQuasar } from 'quasar'
import BoardEditor from '@/components/board/BoardEditor.vue'
import BoardView from '@/components/board/BoardView.vue'

const $q = useQuasar()
const authStore = useAuthStore()
const posts = ref([])
const viewMode = ref('list')
const selectedPost = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

const columns = [
  { name: 'id', align: 'left', label: '#', field: 'id', sortable: true },
  { name: 'title', align: 'left', label: 'Title', field: 'title', sortable: true },
  { name: 'author', align: 'left', label: 'Author', field: 'author', sortable: true, classes: 'gt-xs', headerClasses: 'gt-xs' },
  { name: 'date', align: 'left', label: 'Date', field: 'date', sortable: true, classes: 'gt-xs', headerClasses: 'gt-xs' },
  { name: 'views', align: 'center', label: 'Views', field: 'views', sortable: true, classes: 'gt-xs', headerClasses: 'gt-xs' },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions', classes: 'gt-xs', headerClasses: 'gt-xs' }
]

const initialPagination = {
  rowsPerPage: itemsPerPage
}

const totalPages = computed(() => Math.ceil(posts.value.length / itemsPerPage))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return posts.value.slice(start, end)
})

const fetchPosts = async () => {
  // Mock data for now as API might not be ready or we want to ensure UI works
  if (posts.value.length === 0) {
    posts.value = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Post Title ${i + 1}`,
      author: 'User',
      date: new Date().toLocaleDateString(),
      views: Math.floor(Math.random() * 100),
      content: 'This is some sample content for the post.'
    })).reverse()
  }
}

const viewPost = (post) => {
  selectedPost.value = post
  viewMode.value = 'view'
}

const savePost = (postData) => {
  const newPost = {
    id: posts.value.length + 1,
    ...postData,
    author: 'Me',
    date: new Date().toLocaleDateString(),
    views: 0
  }
  posts.value.unshift(newPost)
  viewMode.value = 'list'
  $q.notify({
    color: 'positive',
    message: 'Post created successfully',
    icon: 'check'
  })
}

const updatePost = (postData) => {
  const index = posts.value.findIndex(p => p.id === selectedPost.value.id)
  if (index !== -1) {
    posts.value[index] = { ...posts.value[index], ...postData }
  }
  selectedPost.value = posts.value[index]
  viewMode.value = 'view'
  $q.notify({
    color: 'positive',
    message: 'Post updated successfully',
    icon: 'check'
  })
}

const editPost = (post) => {
  selectedPost.value = post
  viewMode.value = 'edit'
}

const deletePost = (id) => {
  $q.dialog({
    title: 'Confirm',
    message: '선택한 항목을 삭제할까요?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    posts.value = posts.value.filter(p => p.id !== id)
    viewMode.value = 'list'
    $q.notify({
      color: 'positive',
      message: 'Post deleted successfully',
      icon: 'check'
    })
  })
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}
</style>
