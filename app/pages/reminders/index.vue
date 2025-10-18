<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import ReminderSlideover from '~/components/ReminderSlideover.vue'

const fetchedReminders = await fetchReminders()
async function fetchReminders() {
  const { data } = await useFetch<Reminder[]>('api/reminders', {
    method: 'get',
  })
  console.log('Fetched reminders in fetchReminders function:', data.value)
  return data
}

interface Reminder {
  id: number
  created_at: Date
  name: string
  date_due: Date
}

const toast = useToast()
const overlay = useOverlay()

const slideover = overlay.create(ReminderSlideover)

function open() {
  slideover.open()
}

function removeReminder(id: number) {
  fetchedReminders.value = fetchedReminders.value?.filter(reminder => reminder.id !== id)

  toast.add({
    title: 'Removed',
    description: 'Reminder removed successfully!',
    color: 'info',
  })
}

onMounted(() => {
  const eventHandler = () => {
    open()
  }
  window.addEventListener('new-clicked-reminders', eventHandler)
  onUnmounted(() => {
    window.removeEventListener('new-clicked-reminders', eventHandler)
  })
})
</script>

<template>
  <div class="p-8">
    <h1>Reminders Page</h1>
    <p>Your reminders will be listed here.</p>

    <UCard
      v-for="reminder in fetchedReminders"
      :key="reminder.id"
    >
      <template #header>
        <p>{{ reminder.name }}</p>

        <UButton
          icon="i-lucide-trash"
          size="md"
          color="primary"
          variant="solid"
          @click="removeReminder(reminder.id)"
        />
      </template>
      <template #default>
        <p>Reminder Date: {{ reminder.date_due }}</p>
      </template>
    </UCard>
  </div>
</template>
