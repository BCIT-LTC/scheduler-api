FROM node:19.4.0
LABEL maintainer courseproduction@bcit.ca
ARG VERSION
ENV VERSION=${VERSION:-0.0.0}

WORKDIR /app

# # Install dependencies
# RUN apk --update add \
#         mariadb-client \
#         curl \
#     ;

RUN apt-get install mariadb-client curl -y

# Copy app
COPY package.json ./

RUN npm install

COPY middleware ./middleware/
COPY models ./models/
COPY prisma ./prisma/
COPY routes ./routes/
COPY app.js ./
COPY logger.js ./

# Copy and run init script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

EXPOSE 8000

CMD ["npm", "run", "prod"]