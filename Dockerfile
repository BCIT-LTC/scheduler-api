FROM node:20-alpine

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
RUN export npm_config_cache=/app/cache
RUN npm install


COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["docker-entrypoint.sh"]

# HEALTHCHECK --interval=1m30s --timeout=10s \
#   CMD curl -f http://localhost:8080/ || exit 1
CMD ["npm", "start"]