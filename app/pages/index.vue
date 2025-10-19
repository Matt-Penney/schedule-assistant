<script setup lang="ts">
const pwa = usePWA()
</script>

<template>
  <div>
    <h1>
      Welcome to My App
    </h1>

    <ClientOnly>
      PWA Installed: {{ pwa?.isPWAInstalled }}
    </ClientOnly>
  </div>
</template>
