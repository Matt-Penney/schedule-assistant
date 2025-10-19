<script setup lang="ts">
const pwa = usePWA()
onMounted(() => registerPush())
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
  </div>
</template>
