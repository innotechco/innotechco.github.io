FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_BASE_PATH=/
ARG VITE_CMS_ENABLED=true
ARG VITE_CMS_BASE_URL=https://blog.innotech.global
ARG VITE_CMS_HOME_ENABLED=false
ARG VITE_CMS_BLOG_ENABLED=true
ARG VITE_CMS_BLOG_PER_PAGE=50
ARG VITE_INLEARN_ENABLED=true
ARG VITE_INLEARN_API_URL=
ARG VITE_IMAGE_PROXY=https://images.weserv.nl/

ENV VITE_BASE_PATH=$VITE_BASE_PATH \
    VITE_CMS_ENABLED=$VITE_CMS_ENABLED \
    VITE_CMS_BASE_URL=$VITE_CMS_BASE_URL \
    VITE_CMS_HOME_ENABLED=$VITE_CMS_HOME_ENABLED \
    VITE_CMS_BLOG_ENABLED=$VITE_CMS_BLOG_ENABLED \
    VITE_CMS_BLOG_PER_PAGE=$VITE_CMS_BLOG_PER_PAGE \
    VITE_INLEARN_ENABLED=$VITE_INLEARN_ENABLED \
    VITE_INLEARN_API_URL=$VITE_INLEARN_API_URL \
    VITE_IMAGE_PROXY=$VITE_IMAGE_PROXY

RUN npm run build

RUN node tools/scripts/generate-static-route-fallbacks.mjs \
 || echo ">>> WARNING: route metadata was not generated (CMS or API unreachable). Pages still resolve via the SPA fallback."



FROM nginx:1.27-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
