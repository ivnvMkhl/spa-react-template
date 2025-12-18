FROM node:22.14 AS builder

USER root
COPY . .
RUN npm ci --omit=dev \
    && npm run build

FROM nginxinc/nginx-unprivileged:alpine

COPY --from=builder ./dist /usr/share/nginx/html/
ADD default.conf /etc/nginx/conf.d/default.conf

USER nginx
EXPOSE 8080
