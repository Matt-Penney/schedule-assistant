export default defineEventHandler(
  async (event) => {
    const body = await readBody(event)

    if (!body.created_at || !body.title || !body.date_due)
      throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })

    const result = await createReminderThenReturn({
      title: body.title,
      date_due: new Date(body.date_due),
      description: body.description,
      created_at: new Date(body.created_at),
    })
    
    return { status: 'success', reminder: result }
  }
)
