FROM node:11.6.0-alpine AS builder
COPY . ./api-sensor-web
WORKDIR /api-sensor-web
RUN npm i
RUN $(npm bin)/ng build --prod

FROM nginx:1.15.8-alpine
COPY --from=builder /api-sensor-web/dist/api-sensor-web/ /usr/share/nginx/html