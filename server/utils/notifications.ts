import { db } from './db'

// Create a new notification
export async function createNotification(data: {
  reminder_id: number
  title: string
  message?: string
  scheduled_for: Date
}) {
  await db`
    INSERT INTO notifications (reminder_id, title, message, scheduled_for)
    VALUES (${data.reminder_id}, ${data.title}, ${data.message ?? null}, ${data.scheduled_for})
    ON CONFLICT DO NOTHING
  `
}

// Find notifications that are due (for the executor)
export async function getDueNotifications(now = new Date()) {
  return await db`
    SELECT * FROM notifications
    WHERE sent_at IS NULL
    AND scheduled_for <= ${now}
  `
}

// Mark notification as sent
export async function markAsSent(notificationId: string) {
  await db`
    UPDATE notifications
    SET sent_at = NOW(), updated_at = NOW()
    WHERE id = ${notificationId}
  `
}

// Reschedule (for snooze)
export async function rescheduleNotification(notificationId: string, minutes: number) {
  await db`
    UPDATE notifications
    SET scheduled_for = NOW() + INTERVAL '${minutes} minutes',
        sent_at = NULL,
        acknowledged = false,
        updated_at = NOW()
    WHERE id = ${notificationId}
  `
}

// Mark as acknowledged
export async function acknowledgeNotification(notificationId: string) {
  await db`
    UPDATE notifications
    SET acknowledged = TRUE,
        updated_at = NOW()
    WHERE id = ${notificationId}
  `
}

// Update error message
export async function updateError(notificationId: string, errorMessage: string) {
  await db`
    UPDATE notifications
    SET error = ${errorMessage},
        updated_at = NOW()
    WHERE id = ${notificationId}
  `
}
