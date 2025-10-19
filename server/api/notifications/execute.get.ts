export default defineEventHandler(
  async () => {
    const now = new Date()
    const due = await getDueNotifications(now)

    if (due.length === 0)
      return { message: 'No notifications due', checked: now.toISOString() }

    console.log(`🚀 Found ${due.length} due notifications at ${now.toISOString()}`)

    for (const n of due) {
      try {
        // === (1) SEND LOGIC GOES HERE ===
        // For now, just console.log. Later, you’ll integrate web-push here.
        console.log(`🔔 Sending notification: ${n.title}`)

        // === (2) UPDATE DB ===
        await markAsSent(n.id)
      }
      catch (err) {
        console.error('❌ Notification send failed:', err)
        await updateError(n.id, (err as Error).message)
      }
    }

    return { success: true, processed: due.length }
  },
)
