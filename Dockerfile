# Step 1: Base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

ARG CLERK_SECRET_KEY
ARG STRIPE_SECRET_KEY
ARG MONGODB_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV MONGODB_URL=$MONGODB_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run
FROM node:18
WORKDIR /app
COPY --from=builder /app ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "server.js"]
