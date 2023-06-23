FROM node:19.4.0-alpine

WORKDIR /app

# Install dependencies
RUN apk --update add \
        mariadb-client \
        curl \
    ;
COPY package.json ./
RUN npm install

# Copy app
COPY middleware ./middleware
COPY models ./models
COPY prisma ./prisma
COPY routes ./routes
COPY app.js ./

# Copy and run init script
COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 8000

CMD ["npm", "run", "prod"]