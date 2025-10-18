import { neon } from '@neondatabase/serverless'

export default defineCachedEventHandler(
  async () => {
    const { databaseUrl } = useRuntimeConfig()
    const db = neon(databaseUrl)
    const result = await db`SELECT version()`
    return result
  },
  {
    maxAge: 60 * 60 * 24, // cache it for a day
  },
)
