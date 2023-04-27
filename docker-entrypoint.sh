#!/usr/bin/env sh
set -e

>&2 echo "Seeding db with initial data"
# add your sql commands to add initial data here
mysql --user=$MYSQL_USER --password=$MYSQL_PASSWORD $MYSQL_DB < /app/bsn_dump.sql

# Return to parent shell to run app
>&2 echo "Starting app..."
exec "$@"

