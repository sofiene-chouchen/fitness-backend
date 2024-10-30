FROM node:20.12.2-alpine3.18 AS base

# Install curl for healthcheck (optional)
# RUN apk add --no-cache curl

ENV COREPACK_HOME=/usr/local/corepack
RUN corepack enable

# All deps stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --prod

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN node ace docs:generate
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY --from=build /app/swagger.json /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]