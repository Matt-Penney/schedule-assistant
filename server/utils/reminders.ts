import { db } from './db'

export async function createReminder(data: {
  title: string
  date_due: Date
  description?: string
  created_at: Date
}) {
  await db`
      insert into reminders (title, date_due, description, created_at)
      values (${data.title}, ${data.date_due}, ${data.description}, ${data.created_at})
      returning *
    `
}

export async function createReminderThenReturn(data: {
  title: string
  date_due: Date
  description?: string
  created_at: Date
}) {
  const result = await db`
      insert into reminders (title, date_due, description, created_at)
      values (${data.title}, ${data.date_due}, ${data.description}, ${data.created_at})
      returning *
    `
  return result[0]
}

export async function deleteReminder(reminderId: number) {
  await db`
    delete from reminders
    where id = ${reminderId}
  `
}

export async function markReminderAsCompleted(reminderId: number) {
  await db`
    update reminders
    set completed = TRUE,
        updated_at = NOW()
    where id = ${reminderId}
  `
}

export async function markReminderAsIncomplete(reminderId: number) {
  await db`
    update reminders
    set completed = FALSE,
        updated_at = NOW()
    where id = ${reminderId}
  `
}

export async function getAllReminders() {
  return await db`
    select * from reminders
    order by date_due asc
  `
}

export async function getPendingReminders() {
  return await db`
    select * from reminders
    where completed = FALSE
    order by date_due asc
  `
}

export async function getReminderById(reminderId: number) {
  const result = await db`
    select * from reminders
    where id = ${reminderId}
  `
  return result[0]
}