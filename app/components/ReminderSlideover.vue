<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

const emit = defineEmits<{ close: [boolean] }>()

const myForm = ref('myForm')

const toast = useToast()
const reminders = useStorage('reminders', [] as Array<{ id: number, text: string, date: Date }>)

function submitForm() {
  // retrieve the core node (several ways to do this):
  const node = myForm.value.node
  // submit the form!
  node.submit()
}

function addReminder(data: any) {
  console.log('Form submitted with data:', data)
  reminders.value.push({
    id: Date.now(),
    text: data.reminderText,
    date: new Date(data.reminderDate),
  })

  toast.add({
    title: 'Success',
    description: 'Reminder added successfully!',
    color: 'success',
  })
  emit('close', true)
}
</script>

<template>
  <USlideover
    side="bottom"
    :close="{ onClick: () => emit('close', false) }"
    title="Create Reminder"
    class="h-full"
  >
    <template #body>
      <FormKit
        id="input"
        ref="myForm"
        type="form"
        :actions="false"
        @submit="addReminder"
      >
        <FormKit
          type="text"
          name="reminderText"
          label="What's your reminder?"
          validation="required"
          validation-visibility="live"
        />
        <FormKit
          type="datetime-local"
          label="reminder-date"
          name="reminderDate"
          help="Enter your reminder date"
          validation="required|date_after:2025-01-01"
          validation-visibility="live"
        />
      </FormKit>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton
          color="neutral"
          label="Dismiss"
          @click="emit('close', false)"
        />
        <UButton
          type="submit"
          label="Create Reminder"
          @click="submitForm"
        />
      </div>
    </template>
  </USlideover>
</template>
