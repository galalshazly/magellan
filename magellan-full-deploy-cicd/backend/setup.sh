
#!/usr/bin/env bash
set -e
echo "==> Backend setup (NestJS + Prisma)"
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then cp .env.example .env; fi
  echo "Edit backend/.env with your DATABASE_URL, JWT_SECRET, TAP_* before running in production."
fi
npm install
npm run prisma:generate
npm run prisma:deploy || npm run prisma:migrate
npm run seed || true
echo "==> Done. To run locally: npm run start:dev"
