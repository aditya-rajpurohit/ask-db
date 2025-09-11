set -e

# ------------------------------
# CONFIG
# ------------------------------
CONTAINER_NAME="ask_db_postgres"
DB_NAME="db_ai_assistant"
DB_USER="postgres"
DB_PASS="postgres"
DB_PORT=5432

# ------------------------------
# Start Docker Postgres
# ------------------------------
echo "🐘 Starting Postgres container..."
docker rm -f $CONTAINER_NAME >/dev/null 2>&1 || true
docker run --name $CONTAINER_NAME \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_PASSWORD=$DB_PASS \
  -e POSTGRES_DB=$DB_NAME \
  -p $DB_PORT:5432 \
  -d postgres:15

# Wait for DB to be ready
echo "⏳ Waiting for Postgres to be ready..."
until docker exec $CONTAINER_NAME pg_isready -U $DB_USER >/dev/null 2>&1; do
  sleep 1
done

# ------------------------------
# Apply schema.sql
# ------------------------------
echo "📜 Applying schema.sql..."
docker cp ./migrations/schema.sql $CONTAINER_NAME:/schema.sql
docker exec -u $DB_USER $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -f /schema.sql

# ------------------------------
# Start Backend
# ------------------------------
echo "🚀 Starting backend server..."
npm install
npm run dev