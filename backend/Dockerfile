ARG NODE_VERSION=20-alpine

# STAGE 1: BASE
FROM node:${NODE_VERSION} AS base
ARG USER=node
ARG SERVER_PORT=3030
ENV PORT=${SERVER_PORT}
WORKDIR /usr/src/app

RUN chown ${USER}:${USER} /usr/src/app

# Se precisares de pacotes de sistema (ex: dumb-init, curl), instala aqui com apk, antes de trocar de user:
# RUN apk add --no-cache dumb-init

COPY --chown=${USER}:${USER} ./entrypoint ./
RUN chmod +x ./entrypoint
EXPOSE ${SERVER_PORT}
USER ${USER}
ENTRYPOINT ["./entrypoint"]

# STAGE 2: DEPENDENCIES (só dependências de produção)
FROM base AS dependencies
USER root
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
USER ${USER}
COPY --chown=${USER}:${USER} package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# STAGE 3: DEV_DEPENDENCIES (todas as dependências, incluindo dev)
FROM base AS dev_dependencies
USER root
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
USER ${USER}
COPY --chown=${USER}:${USER} package.json pnpm-lock.yaml ./
RUN pnpm install

# STAGE 4: BUILD
FROM dev_dependencies AS build
COPY --chown=${USER}:${USER} . .
RUN pnpm run build

# STAGE 5: PRODUCTION
FROM base AS production
COPY --chown=${USER}:${USER} --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --chown=${USER}:${USER} --from=build /usr/src/app/.output ./.output
COPY --chown=${USER}:${USER} ./package.json ./