# ----------------------------------------------------
# STAGE 1: Build Environment (Has Node, NPM, compilers)
# ----------------------------------------------------
FROM node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Installation des dépendances de production uniquement
# RUN npm install --omit=dev
RUN npm install &&\
	npm ci

# Copy remaining source files
COPY . .

# (Optional) If using TypeScript or React, run build step here
# RUN npm run build

# ----------------------------------------------------
# STAGE 2: Final Runtime (Minimal & Hardened)
# ----------------------------------------------------
FROM reg.mini.dev/node@sha256:947c3dfa3ed6219eefa1851afdbf9c9777154f8a34ecfd60b502fc4c0741ba1b AS runner

WORKDIR /app

# Copy node_modules and app files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Run non-root user (security best practice)
USER 1000

EXPOSE 3000

CMD ["node", "server.js"]
