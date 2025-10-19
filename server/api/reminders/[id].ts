export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id)
      throw createError({ statusCode: 400, statusMessage: 'Reminder ID is required' })

    await deleteReminder(Number(id))

    return { status: 'success' }
  }
)