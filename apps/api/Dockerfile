FROM node:22-alpine as base

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./

COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN npm install

WORKDIR /app/apps/api

RUN npm run build

FROM base as production

WORKDIR /app/apps/api

ENV NODE_PATH=./dist

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

CMD ["npm", "start"]
