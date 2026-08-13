
FROM node:26-alpine AS deps
WORKDIR /app


COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci -w apps/backend -w packages/shared --include-workspace-root

FROM deps AS build

RUN apk add --no-cache openssl

COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

RUN npm exec --workspace=apps/backend -- prisma generate

FROM node:26-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache openssl \
  && addgroup -S nodejs \
  && adduser -S expressjs -G nodejs

ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/shared ./packages/shared
COPY --from=build /app/apps/backend ./apps/backend

WORKDIR /app/apps/backend
USER expressjs

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3333)+'/api-docs').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.ts"]
