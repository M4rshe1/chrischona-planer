# Build Stage
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies only when package.json changes for faster rebuilds
COPY package*.json ./
RUN npm install

# Copy the rest of the app's code
COPY . .

# Build the Next.js app
RUN npm run build

# Production Stage (minimal for deployment)
FROM node:18-alpine as production

WORKDIR /app

# Copy the built app from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./

# Environment variables (you'll set these in docker-compose.yml)
ENV DATABASE_URL=postgres://user:password@host:5432/db
ENV PORT=3000
ENV NODE_ENV=production
ENV NEXTAUTH_URL=http://localhost:3000

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]