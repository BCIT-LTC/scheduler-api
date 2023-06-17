#!/usr/bin/env sh
set -e

# Verify that the minimally required environment variables are set.
if [ -z "$MARIADB_ROOT_HOST" ] || [ -z "$MARIADB_USER" ] || [ -z "$MARIADB_PASSWORD" ] || [ -z "$MARIADB_DATABASE" ]; then
    printf '\n\nEnvironment variables are not set.\n\tYou need to specify MARIADB_ROOT_HOST, MARIADB_DATABASE, MARIADB_USER, and MARIADB_PASSWORD\n\n'
    exit 1
fi

# Environment variable trace
if [ "${DEBUG}" == "true" ]; then echo -e " \
    \nEnvironment Variables: \
    \n  MARIADB_ROOT_HOST: $MARIADB_ROOT_HOST \
    \n  MARIADB_USER: $MARIADB_USER \
    \n  MARIADB_PASSWORD: $MARIADB_PASSWORD \
    \n  MARIADB_DATABASE: $MARIADB_DATABASE \
    \n  APP_URL: $APP_URL \
    \n  GIT_TAG: $GIT_TAG \
    \n";
fi
# Configure and store connection info
>&2 echo "Writing ENV VARS to .env file..."
echo -n "" > .env
echo DATABASE_URL="mysql://$MARIADB_USER:$MARIADB_PASSWORD@$MARIADB_ROOT_HOST:3306/$MARIADB_DATABASE" >> .env
echo APP_URL=$APP_URL >> .env


# Initialize prisma
>&2 echo "Running migrations..."
npx prisma db push --schema='prisma/schema.prisma'

# Seed database with initial data
>&2 echo "seeding db..."
npx prisma db seed

# Return to parent shell to run app
>&2 echo "Starting app..."

# run tests
>&2 echo "Running Tests..."
npm run test

exec "$@"
