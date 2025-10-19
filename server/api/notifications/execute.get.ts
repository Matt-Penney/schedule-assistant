import webPush from 'web-push'
import { db } from '../../utils/db'

export default defineEventHandler(async () => {
  const cfg = useRuntimeConfig()

  webPush.setVapidDetails(
    'mailto:you@localhost',
    cfg.public.vapidPublicKey,
    cfg.vapidPrivateKey,
  )

  const now = new Date()
  const due = await getDueNotifications(now)

  if (due.length === 0)
    return { message: 'No notifications due', checked: now.toISOString() }

  console.log(`🚀 Found ${due.length} due notifications at ${now.toISOString()}`)

  // Fetch subscriptions (or fallback)
  const subs = await db`SELECT endpoint, p256dh, auth FROM push_subscriptions`
  const fallbackSub = null // optional hardcoded subscription
  const targets = subs.length ? subs : (fallbackSub ? [fallbackSub] : [])

  for (const n of due) {
    try {
      const payload = JSON.stringify({
        title: n.title,
        body: n.message ?? '',
      })

      for (const sub of targets) {
        try {
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payload,
          )
        }
        catch (err: any) {
          // Handle expired subscriptions
          if (err?.statusCode === 410 || err?.statusCode === 404) {
            await db`DELETE FROM push_subscriptions WHERE endpoint = ${sub.endpoint}`
            console.log(`🧹 Removed expired subscription for ${sub.endpoint}`)
          }
          else {
            console.error('❌ Push failed:', err?.statusCode || err)
          }
        }
      }

      // After attempting all pushes
      await markAsSent(n.id)
    }
    catch (err: any) {
      console.error('❌ Notification processing failed:', err)
      await db`UPDATE notifications SET error = ${err.message} WHERE id = ${n.id}`
    }
  }

  return { success: true, processed: due.length }
})
