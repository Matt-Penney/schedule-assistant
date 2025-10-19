<script setup lang="ts">
const pwa = usePWA()
const toast = useToast()

async function subscribe() {
  const res = await $fetch('/api/subscribe-test', { method: 'POST' })
  toast.add({
    title: 'Push Subscription Test',
    description: JSON.stringify(res.message),
    color: 'info',
  })
}
</script>

<template>
  <div>
    <h1>
      Welcome to My App
    </h1>

    <DevOnly>
      <ClientOnly>
        PWA Installed: {{ pwa?.isPWAInstalled }}
      </ClientOnly>
    </DevOnly>

    <UButton
      class="p-2 bg-blue-600 text-white rounded"
      label="Test Push Subscription"
      @click="subscribe"
    />
  </div>
</template>
