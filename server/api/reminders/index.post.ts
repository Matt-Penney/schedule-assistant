import { neon } from '@neondatabase/serverless'

export default defineEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig()
    const db = neon(databaseUrl)

    const body = await readBody(event)

    if (!body.created_at || !body.name || !body.date_due) {
      throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    const result = await db`insert into reminders (created_at, name, date_due, description) values (${body.created_at}, ${body.name}, ${body.date_due}, ${body.description})`
    return result
  },
)
