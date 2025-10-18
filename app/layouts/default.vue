<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items: NavigationMenuItem[] = [
  {
    label: 'Reminders',
    icon: 'i-lucide-book-open',
    to: '/reminders',
  },
  {
    label: 'Workouts',
    icon: 'i-lucide-database',
    to: '/workouts',
  },
  {
    label: 'New',
    icon: 'i-lucide-plus',
    onSelect: () => {
      const eventName = `new-clicked-${route.path.replace('/', '') || 'home'}`
      window.dispatchEvent(new CustomEvent(eventName))
    },
  },
  {
    label: 'Filler',
    icon: 'i-lucide-box',
    to: '/',
  },
  {
    label: 'Settings',
    icon: 'i-lucide-box',
    to: '/settings',
  },
]

const test = await useFetch('/api/test')
</script>

<template>
  <UHeader title="Jarvis Bot">
    <template #right>
      <p>API connection: {{ test ? 'true' : 'false' }}</p>
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

  <UMain>
    <slot />
  </UMain>

  <USeparator
    icon="i-simple-icons-nuxtdotjs"
    type="dashed"
    class="h-px"
  />
  <UFooter>
    <template #top>
      <UNavigationMenu
        :items="items"
        class="w-full justify-center"
        variant="link"
        color="primary"
      />
    </template>

    <template #bottom>
      <p class="text-center">
        © 2025 Jarvis Bot. All rights reserved.
      </p>
    </template>
  </UFooter>
</template>
