# syntax=docker/dockerfile:1

# The site, built to static files and served by nginx.
#
# THE ONE THING TO KNOW ABOUT THIS FILE
#
# Vite reads VITE_* at BUILD time and writes the values into the JavaScript it
# emits. They are not read again when the container starts. So the API address
# cannot be changed by setting an environment variable on a running container -
# it has to be a build argument, and a different address means a different
# image.
#
# That is why the server builds this rather than receiving a finished image:
# docker compose passes the domains from .env into the ARGs below, and the
# build picks them up. The values here are the defaults for a local run.

FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# The same set the Pages workflow builds with, so the container and the
# published site are made from the same switches.
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

# This can fail, and when it does it is not Docker's fault: vite.config.js
# fails the build on any render-blocking chunk over 48KB compressed, for the
# reason written out at length in that file. A build that stops here is that
# guard doing its job.
RUN npm run build

# Per-route files, so a direct link to an article or a course carries its own
# title and description rather than the home page's.
#
# Allowed to fail on purpose. It asks WordPress and Strapi for the current
# slugs, and neither is guaranteed to be reachable from a build machine. What
# it adds is metadata; what it does NOT add is the ability to reach those
# addresses at all - nginx's try_files below already does that, which is the
# difference from GitHub Pages, where a missing file really is a 404. So a
# failure here costs SEO on new routes and nothing else, and says so loudly in
# the build log rather than stopping a deploy over an unreachable CMS.
RUN node tools/scripts/generate-static-route-fallbacks.mjs \
 || echo ">>> WARNING: route metadata was not generated (CMS or API unreachable). Pages still resolve via the SPA fallback."


# -------------------------------------------------------------------- runtime

FROM nginx:1.27-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
