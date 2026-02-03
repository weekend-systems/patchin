FROM node:20-alpine AS base
RUN corepack enable && corepack prepare yarn@4.12.0 --activate

# Build
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY apps/ ./apps/
COPY packages/ ./packages/
COPY scripts/ ./scripts/

RUN yarn install --immutable

ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn turbo build --filter=@patchin/web

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# App files
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Migration files and deps
COPY --from=builder /app/packages/db/drizzle ./packages/db/drizzle
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
COPY --from=builder /app/node_modules/postgres ./node_modules/postgres

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
