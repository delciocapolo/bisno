# syntax=docker/dockerfile:1

ARG NODE_VERSION=24
ARG PNPM_VERSION=10.6.5

#========================================
#               Base
#========================================
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

#========================================
#   Production dependencies only
#========================================
FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

#========================================
#      Full dependencies (incl. dev)
#   Used by build and by the dev target
#========================================
FROM base AS dev_dependencies

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

#========================================
#               Build
#========================================
FROM dev_dependencies AS build

COPY . .

RUN pnpm run build

#========================================
#           Production image
#========================================
FROM base AS production

ENV NODE_ENV=production

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package.json ./

USER node

EXPOSE 3000

CMD ["pnpm", "run", "preview"]