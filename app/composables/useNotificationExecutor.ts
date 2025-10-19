export function useNotificationExecutor() {
  let intervalId: NodeJS.Timeout | null = null

  function startExecutor() {
    if (intervalId)
      return // already running

    // eslint-disable-next-line ts/no-misused-promises
    intervalId = setInterval(async () => {
      try {
        await $fetch('/api/notifications/execute', { method: 'GET' })
      }
      catch (err) {
        console.error('Notification executor failed:', err)
      }
    }, 60_000) // every 60 seconds
  }

  function stopExecutor() {
    if (intervalId)
      clearInterval(intervalId)
    intervalId = null
  }

  return { startExecutor, stopExecutor }
}
