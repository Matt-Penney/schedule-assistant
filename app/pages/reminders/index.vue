<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
import { onMounted, onUnmounted } from 'vue'
import ReminderSlideover from '~/components/ReminderSlideover.vue'

const reminders = useStorage('reminders', [] as Array<{ id: number, text: string }>)

const toast = useToast()
const overlay = useOverlay()

const slideover = overlay.create(ReminderSlideover)

function open() {
  slideover.open()
}

function removeReminder(id: number) {
  reminders.value = reminders.value.filter(reminder => reminder.id !== id)

  toast.add({
    title: 'Removed',
    description: 'Reminder removed successfully!',
    color: 'info',
  })
}

onMounted(() => {
  const eventHandler = () => {
    console.log('new-clicked-reminders event caught!')
    // addReminder()
    open()
  }

  // Add the event listener for the specific event name
  window.addEventListener('new-clicked-reminders', eventHandler)

  // Clean up the event listener when the component is unmounted
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
      v-for="reminder in reminders"
      :key="reminder.id"
    >
      <template #header>
        <p>{{ reminder.text }}</p>

        <UButton
          icon="i-lucide-trash"
          size="md"
          color="primary"
          variant="solid"
          @click="removeReminder(reminder.id)"
        />
      </template>
    </UCard>
  </div>
</template>
