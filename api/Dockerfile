# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app
# npm, the Nest CLI (dist/, schema.graphql) and Compose Watch all write into /app.
RUN chown node:node /app
USER node

# ---- deps: ALL dependencies (incl. @nestjs/cli, TypeScript). Cached until package*.json changes ----
FROM base AS deps
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

# ---- development: CLI in watch mode, recompiles and restarts on change ----
FROM deps AS development
ENV NODE_ENV=development
COPY --chown=node:node . .
EXPOSE 4000
# --no-shell: the CLI runs `node` directly, so on each reload it stops the old process and
# waits for it to exit before starting the new one. With the default shell, it must find the
# real node process via `ps`, which minimal images may lack → "EADDRINUSE" on reload.
CMD ["npm", "run", "start:dev", "--", "--no-shell"]

# ---- build: compile to dist/ ----
FROM deps AS build
COPY --chown=node:node . .
RUN npm run build

# ---- prod-deps: runtime dependencies only ----
FROM base AS prod-deps
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- production: the image that ships ----
FROM base AS production
ENV NODE_ENV=production
# No --chown: files stay root-owned and the `node` process can't modify its own code.
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
EXPOSE 4000
# Exec form: node is PID 1 and receives SIGTERM directly → enableShutdownHooks() runs.
CMD ["node", "dist/main.js"]