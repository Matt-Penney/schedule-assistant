import { neon } from '@neondatabase/serverless'

export default defineEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig()
    const db = neon(databaseUrl)

    const body = await readBody(event)
    const result = await db`insert into reminders (created_at, name, date_due) values (${body.created_at}, ${body.name}, ${body.date_due})`
    return result
  },
)
