<script setup lang="ts">

</script>

<template>
  <AppHeader />

  <UMain>
    <slot />
  </UMain>

  <USeparator
    icon="i-simple-icons-nuxtdotjs"
    type="dashed"
    class="h-px"
  />

  <AppFooter />
</template>
