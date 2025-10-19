<script setup lang="ts">
const notificationExecutor = useNotificationExecutor()

onMounted(() => {
  console.log('Starting notification executor...')
  notificationExecutor.startExecutor()
})

onBeforeUnmount(() => {
  notificationExecutor.stopExecutor()
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>

  <NuxtPwaManifest />
</template>
