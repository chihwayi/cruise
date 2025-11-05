# API Service - Development
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=development

# Start with ts-node-dev for hot reload
CMD ["npm", "run", "dev"]

