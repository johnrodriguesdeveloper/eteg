# syntax=docker/dockerfile:1
#
# Build context MUST be the monorepo root (see docker-compose.yml:
# `build.context: .`, `build.dockerfile: apps/frontend/Dockerfile`), because
# `@eteg/shared` (Zod schemas) is an npm workspace resolved via a symlink into
# `packages/shared`, and is imported directly as source by react-hook-form's
# zodResolver in apps/frontend/src/features/*/hook.ts.

# ---- Stage 1: install only the workspaces this image needs -----------------
FROM node:26-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/shared/package.json ./packages/shared/package.json

# -w scopes the install to frontend + shared, so the backend's Express/Prisma
# dependency tree never ends up in this build stage.
RUN npm ci -w apps/frontend -w packages/shared --include-workspace-root

# ---- Stage 2: type-check and build the Vite SPA ----------------------------
FROM deps AS build

COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend

ARG VITE_API_URL=http://localhost:3333
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build --workspace=apps/frontend

FROM nginx:1.27-alpine AS runtime

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
