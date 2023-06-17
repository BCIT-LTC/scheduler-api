FROM node:19.4.0-alpine

RUN apk --update add \
        mariadb-client \
        curl \
    ;

WORKDIR /app

COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
# COPY views ./views
COPY app.js ./
COPY package.json ./

RUN npm install

COPY docker-entrypoint.sh /usr/local/bin

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]

# HEALTHCHECK --interval=1m30s --timeout=10s \
#   CMD curl -f http://localhost:8080/ || exit 1

CMD ["npm", "start"]