import { db } from '../utils/db'

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Clean = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64Clean)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

export default defineEventHandler(async (event) => {
  const publicKey = useRuntimeConfig().public.vapidPublicKey
  const body = await readBody(event)

  // Run in the browser context through fetch() call from phone
  const script = `
    (async () => {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: (${urlBase64ToUint8Array.toString()})('${publicKey}')
      });
      return sub.toJSON();
    })()
  `

  // This endpoint is only to show "we're ready"
  return { message: 'Tap OK — now try again with the real push registration flow' }
})
