FROM node:19.4.0-alpine
ENV npm_config_cache /app/.cacheapi
RUN apk --update add \
    mariadb-client \
    curl;

WORKDIR /app

COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
# COPY views ./views
COPY prisma ./prisma
COPY app.js ./
COPY package.json ./
RUN npm install  --cache="/app/.cacheapi" --unsafe-perm=true --allow-root
RUN chown -R node:node /app

RUN chown -R node:node /app/node_modules/.prisma
COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["docker-entrypoint.sh"]

# HEALTHCHECK --interval=1m30s --timeout=10s \
#   CMD curl -f http://localhost:8080/ || exit 1
CMD ["npm", "start"]