import { db } from '../utils/db'

export default defineCachedEventHandler(
  async () => {
    const result = await db`SELECT version()`
    return result
  },
  {
    maxAge: 60 * 60 * 24, // cache it for a day
  },
)
