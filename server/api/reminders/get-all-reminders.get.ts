export default defineEventHandler(
  async () => {
    const result = await getAllReminders()
    
    return result
  }
)
