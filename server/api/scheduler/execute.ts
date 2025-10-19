import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

// Simple util for applying LLM time offsets like "-1d", "+2h", etc.
function applyOffset(date: Date, offset: string): Date {
  console.log('Applying offset:', offset, 'to date:', date)

  const result = new Date(date)
  const match = offset.match(/([+-])(\d+)([dhm])/)
  if (!match)
    return result

  const [, sign, amountStr, unit] = match
  const amount = Number.parseInt(amountStr, 10) * (sign === '-' ? -1 : 1)

  switch (unit) {
    case 'd': result.setDate(result.getDate() + amount); break
    case 'h': result.setHours(result.getHours() + amount); break
    case 'm': result.setMinutes(result.getMinutes() + amount); break
  }

  return result
}

export default defineEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey
  if (!apiKey)
    throw new Error('Missing OpenAI API key')

  const openai = createOpenAI({ apiKey })

  // 1️⃣ Fetch active reminders from Neon
  const reminders = await getPendingReminders()
  if (!reminders.length)
    return { message: 'No active reminders found' }

  // 2️⃣ Build the LLM prompt
  const prompt = `
    You are an intelligent scheduling assistant.
    For each reminder below, return a JSON array of notification plans.

    Each item must include:
    - "reminder_id"
    - "notifications": an array of { "offset": "-7d" | "-1d" | "-1h" | "+1h", "message": "..." }

    Use offsets relative to the reminder's scheduled_for datetime.
    Return JSON only, no explanations.
    Reminders:
    ${JSON.stringify(reminders, null, 2)}
    `
  console.log('LLM Prompt:', prompt)

  // 3️⃣ Call the model (no streaming)
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
  })
  console.log('LLM Response Text:', text)

  // 4️⃣ Parse response and validate
  let plans: any[] = []
  try {
    let sanitizedText = text.trim() // Remove leading/trailing whitespace
    // Attempt to extract JSON array from the response
    const jsonStart = sanitizedText.indexOf('[')
    const jsonEnd = sanitizedText.lastIndexOf(']')
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Response does not contain a valid JSON array')
    }
    sanitizedText = sanitizedText.slice(jsonStart, jsonEnd + 1)
    console.log('Sanitized LLM text:', sanitizedText) // Log sanitized text for debugging
    plans = JSON.parse(sanitizedText)
  }
  catch (err) {
    console.error('Failed to parse LLM JSON output:', err.message)
    console.log('Raw LLM text:', text)
    throw new Error(`Invalid LLM JSON output: ${err.message}`)
  }

  // 5️⃣ Insert notifications into Neon
  let created = 0
  for (const plan of plans) {
    const reminder = reminders.find(r => r.id === plan.reminder_id)
    if (!reminder)
      continue

    for (const n of plan.notifications) {
      const scheduled_for = applyOffset(reminder.date_due, n.offset)

      console.log('scheduled_for:', scheduled_for, 'message:', n.message)
      await createNotification({
        reminder_id: reminder.id,
        title: reminder.title,
        message: n.message,
        scheduled_for,
      })
      created++
    }
  }

  return {
    success: true,
    reminders_processed: reminders.length,
    notifications_created: created,
  }
})
