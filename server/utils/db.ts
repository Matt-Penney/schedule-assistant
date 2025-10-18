import { neon } from '@neondatabase/serverless'

const { databaseUrl } = useRuntimeConfig()
export const db = neon(databaseUrl)
