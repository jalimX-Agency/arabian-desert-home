import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Neon's pooled endpoint (the host contains "-pooler") is PgBouncer in
 * transaction mode. Without `pgbouncer=true`, Prisma keeps *named* prepared
 * statements on those shared server connections, and any later change to a
 * column's type makes every query that touches it fail with
 * "cached plan must not change result type" until the pool recycles those
 * connections — a column change once did exactly that to the guest pages and
 * new bookings for several minutes. The flag makes Prisma send unnamed
 * statements, so there is nothing stale to hit. It's applied here, in code, so
 * it can't be forgotten in an environment's connection string.
 */
function withPgBouncerFlag(url: string | undefined): string | undefined {
  if (!url) return url
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('-pooler') && !parsed.searchParams.has('pgbouncer')) {
      parsed.searchParams.set('pgbouncer', 'true')
      return parsed.toString()
    }
  } catch {
    // Not a parseable URL: leave it to Prisma to report.
  }
  return url
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasourceUrl: withPgBouncerFlag(process.env.DATABASE_URL),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
