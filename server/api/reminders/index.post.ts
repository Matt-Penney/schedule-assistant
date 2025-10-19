import { db } from '../../utils/db'

export default defineEventHandler(
  async (event) => {
    const body = await readBody(event)

    if (!body.created_at || !body.title || !body.date_due)
      throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })

    const result = await db`
      insert into reminders (title, date_due, description, created_at)
      values (${body.title}, ${body.date_due}, ${body.description}, ${body.created_at})
      returning *
    `
    return { status: 'success', reminder: result[0] }
  }
)
