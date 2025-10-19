function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Clean = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64Clean)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i)
  return output
}

export async function registerPush() {
  if (!('serviceWorker' in navigator))
    return

  const reg = await navigator.serviceWorker.ready
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    console.warn('Push permission not granted')
    return
  }

  const publicKey = useRuntimeConfig().public.vapidPublicKey
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  })

  await $fetch('/api/push/subscribe', {
    method: 'POST',
    body: sub.toJSON(),
  })

  console.log('📬 Push subscription saved to server')
}
