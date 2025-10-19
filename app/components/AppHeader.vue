<script setup lang="ts">
const { data: test } = await useFetch('/api/test')
</script>

<template>
  <UHeader title="Jarvis">
    <template #right>
      <UBadge
        label="API"
        :colour="test ? 'success' : 'error'"
        variant="solid"
      />
      <UColorModeButton />
      <UTooltip
        text="Open on GitHub"
        :kbds="['meta', 'G']"
      >
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/Matt-Penney/schedule-assistant"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>
