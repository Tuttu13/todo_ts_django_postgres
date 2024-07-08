
echo "Building containers..."
docker compose build

echo "Starting containers..."
docker compose up -d

echo "migrating..."
docker compose exec backend python backend/manage.py migrate

echo "Starting TODO APP..."
cd frontend
npm install
npm start