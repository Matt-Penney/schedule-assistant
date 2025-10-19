import { db } from '../../utils/db'

export const runtime = 'nodejs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { endpoint, keys } = body

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid subscription data' })
  }

  await db`
    INSERT INTO push_subscriptions (endpoint, p256dh, auth)
    VALUES (${endpoint}, ${keys.p256dh}, ${keys.auth})
    ON CONFLICT (endpoint) DO NOTHING
  `

  return { success: true }
})
