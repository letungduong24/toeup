FROM node:20-alpine AS base
WORKDIR /app

# Build-time env for Next.js
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && npm ci

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]


