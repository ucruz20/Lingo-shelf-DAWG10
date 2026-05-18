FROM node:26-alpine AS base
WORKDIR /app
COPY . /app
RUN rm -rf /app/node_modules

FROM base AS development
RUN npm ci
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS production
RUN npm ci --only=production
CMD ["npm", "start"]

