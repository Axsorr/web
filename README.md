# match-me web

## Run locally
1) Copy env:
- root: `.env.example` -> `.env` (optional)
- back-end: `back-end/.env.example` -> `back-end/.env`
- front-end: `front-end/.env.example` -> `front-end/.env`

2) Start Postgres:
- `docker compose up -d`

3) Install deps:
- `npm install`

4) Run:
- `npm run dev`

Backend health: http://localhost:4000/health
Frontend: shown by Vite in terminal