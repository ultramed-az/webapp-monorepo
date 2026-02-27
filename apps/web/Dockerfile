FROM node:20-alpine AS builder

RUN npm install -g pnpm && apk add --no-cache openssl libc6-compat

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @ultramed/database exec prisma generate --schema=prisma/schema.prisma
RUN pnpm --filter @ultramed/web build

FROM node:20-alpine

RUN npm install -g pnpm && apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules

ARG FRONTEND_PORT
ENV FRONTEND_PORT=${FRONTEND_PORT}
EXPOSE ${FRONTEND_PORT}

CMD ["pnpm", "--filter", "@ultramed/web", "start"]
