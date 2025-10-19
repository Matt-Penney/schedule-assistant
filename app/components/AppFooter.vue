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
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
    <div class="grid grid-cols-5 gap-0">
      <UButton
        v-for="item in items"
        :key="item.label"
        :to="item.to"
        :label="item.label"
        active-color="primary"
        variant="ghost"
        color="gray"
        class="h-16 flex flex-col items-center justify-center rounded-none"
        @click="item.onSelect?.()"
      >
        <template #default>
          <div class="flex flex-col items-center gap-1">
            <UIcon
              :name="item.icon"
              class="text-xl"
            />
            <span class="text-xs">{{ item.label }}</span>
          </div>
        </template>
      </UButton>
    </div>
  </footer>
</template>
