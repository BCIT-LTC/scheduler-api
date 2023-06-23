FROM node:19.4.0-alpine

WORKDIR /app

RUN apk --update add \
        mariadb-client \
        curl \
    ;
COPY package.json ./

RUN npm install

COPY middleware ./middleware
COPY models ./models
COPY prisma ./prisma
COPY routes ./routes
COPY app.js ./

RUN npm install

COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "prod"]