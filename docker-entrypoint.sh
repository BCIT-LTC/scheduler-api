#!/bin/sh
set -e

# Verify that the minimally required environment variables are set.
if [ -z "$POSTGRES_HOST" ] || [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_DB" ] || [ -z "$JWT_AUTH_SIGNING_KEY" ]; then
    printf '\n\nEnvironment variables are not set.\n\tYou need to specify POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB and JWT_AUTH_SIGNING_KEY\n\n'
    exit 1
fi

# Configure connection info
>&2 echo "Configuring DATABASE_URL...\n"
export DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:5432/$POSTGRES_DB"
>&2 echo "DATABASE_URL is now set"

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
