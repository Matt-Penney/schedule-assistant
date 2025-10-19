<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'close': [boolean]
  'reminder-added': [any]
}>()

const myForm = ref('myForm')

const toast = useToast()

function submitForm() {
  const node = myForm.value.node
  node.submit()
}

async function addReminder(data: any) {
  // console.log('Form submitted with data:', data)

  const { data: newReminder } = await useFetch('/api/reminders/create-reminder', {
    method: 'post',
    body: {
      title: data.title,
      date_due: data.date_due,
      description: data.description,
      created_at: new Date(Date.now()),
    },
  })

  if (!newReminder.value || newReminder.value.status !== 'success') {
    toast.add({
      title: 'Error',
      description: 'Failed to add reminder. Please try again.',
      color: 'error',
    })
  }
  else {
    toast.add({
      title: 'Success',
      description: 'Reminder added successfully!',
      color: 'success',
    })

    // Emit the new reminder to parent
    emit('reminder-added', newReminder.value.reminder)
    emit('close', true)
  }
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
          name="title"
          label="What's your reminder?"
          validation="required"
          validation-visibility="live"
        />
        <FormKit
          type="datetime-local"
          name="date_due"
          label="When do you want to be reminded?"
          validation="required|date_after"
          validation-visibility="live"
        />
        <FormKit
          type="text"
          name="description"
          label="Description"
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
