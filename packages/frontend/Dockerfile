# ---- Build stage ----
FROM node:24-alpine AS builder

WORKDIR /app
RUN npm install -g npm@11.10.1

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

RUN HUSKY=0 npm ci

COPY packages/shared ./packages/shared
COPY packages/frontend ./packages/frontend

RUN npm run build -w @rs-tandem/frontend

# ---- Production stage ----
FROM nginx:alpine

COPY --from=builder /app/packages/frontend/dist/frontend/browser /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
