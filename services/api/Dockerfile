# API Service - Development
FROM node:20-alpine

WORKDIR /app

# Install system dependencies for pdf-parse and native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev

# Copy package files
COPY package*.json ./

# Install dependencies (including pdf-parse)
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=development

# Start with ts-node-dev for hot reload
CMD ["npm", "run", "dev"]

