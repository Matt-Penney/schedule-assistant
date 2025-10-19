<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import ReminderSlideover from '~/components/ReminderSlideover.vue'

interface Reminder {
  id: number
  title: string
  date_due: Date
  description?: string
  created_at: Date
}

const { data: fetchedReminders } = await useAsyncData<Reminder[]>(
  'reminders',
  () => $fetch<Reminder[]>('/api/reminders', { method: 'GET' }),
  {
    default: () => [],
  },
)

const toast = useToast()
const overlay = useOverlay()

const slideover = overlay.create(ReminderSlideover, {
  props: {
    onReminderAdded: (newReminder: Reminder) => {
      fetchedReminders.value = [newReminder, ...fetchedReminders.value]
    },
  },
})

function open() {
  slideover.open()
}

async function removeReminder(id: number) {
  if (!fetchedReminders.value)
    return

  const originalReminders = [...fetchedReminders.value]

  fetchedReminders.value = fetchedReminders.value.filter(reminder => reminder.id !== id)

  try {
    const { status } = await useFetch(`/api/reminders/${id}`)
    if (status.value !== 'success')
      throw new Error('Failed to delete reminder')

    toast.add({
      title: 'Removed',
      description: 'Reminder removed successfully!',
      color: 'info',
    })
  }
  catch {
    fetchedReminders.value = originalReminders

    toast.add({
      title: 'Error',
      description: 'Failed to delete reminder',
      color: 'error',
    })
  }
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
  <UContainer class="p-8">
    <div v-if="fetchedReminders.length === 0">
      <UEmpty
        variant="naked"
        icon="i-lucide-bell"
        title="No reminders"
        description="You're all caught up. New reminders will appear here."
        :actions="[
          {
            icon: 'i-lucide-refresh-cw',
            label: 'Refresh',
            color: 'neutral',
            variant: 'subtle',
          },
        ]"
      />
      No reminders (UEmpty component coming soon)
    </div>
    <div v-else>
      <UCard
        v-for="reminder in fetchedReminders"
        :key="reminder.id"
        class="mt-4"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <p class="font-semibold">
              {{ reminder.title }}
            </p>
            <UButton
              icon="i-lucide-trash"
              size="sm"
              color="error"
              variant="ghost"
              @click="removeReminder(reminder.id)"
            />
          </div>
        </template>
        <template #default>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Due: {{ new Date(reminder.date_due).toLocaleDateString() }}
            at {{ new Date(reminder.date_due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </p>
          <p
            v-if="reminder.description"
            class="mt-2 text-sm"
          >
            {{ reminder.description }}
          </p>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
