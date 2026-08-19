# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.6.5

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

FROM base AS dev_dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=bind,source=pnpm-workspace.yaml,target=pnpm-workspace.yaml \
    --mount=type=bind,source=.npmrc,target=.npmrc \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM dev_dependencies AS build

# ===== Variáveis que o Vite precisa no build =====
ARG VITE_API_URL
ARG VITE_APP_NAME=Bisno
ARG VITE_APP_PORT=3000

# Transforma os ARGs em ENVs para o Vite enxergar durante o build
ENV VITE_API_URL=$VITE_API_URL \
    VITE_APP_NAME=$VITE_APP_NAME \
    VITE_APP_PORT=$VITE_APP_PORT

COPY . .
RUN pnpm run build

# Stage final: servidor Node SSR
FROM node:${NODE_VERSION}-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=build /usr/src/app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]