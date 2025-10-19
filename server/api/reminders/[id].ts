import { db } from '../../utils/db'

export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Reminder ID is required' })
    }

    await db`
      delete from reminders
      where id = ${id}
    `

    return { status: 'success' }
  }
)