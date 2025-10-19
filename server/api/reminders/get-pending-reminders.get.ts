export default defineEventHandler(
  async () => {
    const result = await getPendingReminders()
    
    return result
  }
)
