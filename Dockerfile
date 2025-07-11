# Step 1: Base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit

ARG CLERK_SECRET_KEY
ARG STRIPE_SECRET_KEY
ARG MONGODB_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLOUDINARY_API_KEY
ARG NEXT_PUBLIC_APP_URL
# Copy the rest of the app
COPY . .

ENV NODE_ENV=production
# Use secrets temporarily during build
RUN CLERK_SECRET_KEY=$CLERK_SECRET_KEY \
    STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY \
    MONGODB_URL=$MONGODB_URL \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_CLOUDINARY_API_KEY=$NEXT_PUBLIC_CLOUDINARY_API_KEY \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    npm run build

# Stage 2: Run
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN npm install --omit=dev --prefer-offline --no-audit

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "--max-old-space-size=1024", "server.js"]
