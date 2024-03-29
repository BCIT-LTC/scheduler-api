#!/bin/sh
set -e

# Verify that the minimally required environment variables are set.
if [ -z "$MARIADB_ROOT_HOST" ] || [ -z "$MARIADB_USER" ] || [ -z "$MARIADB_PASSWORD" ] || [ -z "$MARIADB_DATABASE" ] || [ -z "$JWT_AUTH_SIGNING_KEY" ]; then
    printf '\n\nEnvironment variables are not set.\n\tYou need to specify MARIADB_ROOT_HOST, MARIADB_DATABASE, MARIADB_USER, MARIADB_PASSWORD and JWT_AUTH_SIGNING_KEY\n\n'
    exit 1
fi

# Configure connection info
>&2 echo "Configuring DATABASE_URL...\n"
export DATABASE_URL="mysql://$MARIADB_USER:$MARIADB_PASSWORD@$MARIADB_ROOT_HOST:3306/$MARIADB_DATABASE"

# update the prisma schema
>&2 echo "Updating prisma schema...\n"
npx prisma generate

# Initialize prisma
>&2 echo "Running migrations...\n"
npx prisma db push --accept-data-loss --schema='prisma/schema.prisma'

# Seed database with initial data
>&2 echo "Seeding db...\n"
npx prisma db seed

# Return to parent shell to run app
>&2 echo "Starting app...\n"

exec "$@"
