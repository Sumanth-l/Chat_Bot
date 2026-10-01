# Dialog AI Chat

A TypeScript chat application with a React/Vite frontend, an Express API, PostgreSQL persistence, Prisma, and Gemini or Groq for AI responses.

## Requirements

- Node.js 20.19+ or 22.12+ and npm
- PostgreSQL 14 or newer
- An API key for the AI provider you plan to use (Gemini by default, or Groq)

## Installation

From the repository root, install each app's dependencies:

```sh
npm install --prefix backend
npm install --prefix frontend
```

## Configure the environment

Create the backend environment file from the example:

```sh
cp .env.example backend/.env
```

On Windows PowerShell, use `Copy-Item .env.example backend/.env` instead.

Set these values in `backend/.env`:

```dotenv
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_chatbot
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
```

Use `AI_PROVIDER=groq` and set `GROQ_API_KEY` to use Groq instead. Provider model and request timeout settings are optional; defaults are defined in the backend. Keep real secrets out of source control.

The frontend defaults to the local API at `http://localhost:5000`. To override it, create `frontend/.env.local` with:

```dotenv
VITE_API_URL=http://localhost:5000
VITE_AI_PROVIDER=gemini
```

Set `VITE_AI_PROVIDER=groq` when using Groq. The API keys belong only in `backend/.env`.

## Database setup and migrations

Create a PostgreSQL database named `ai_chatbot` (or use a different name and update `DATABASE_URL`). For example, with `psql`:

```sql
CREATE DATABASE ai_chatbot;
```

From the backend directory, generate the Prisma client and apply the committed baseline migration to a fresh database:

```sh
cd backend
npm run db:generate
npx prisma migrate dev --schema ../prisma/schema.prisma
```

For later schema changes, create and apply a named migration during development:

```sh
npx prisma migrate dev --schema ../prisma/schema.prisma --name describe_change
```

In a deployment environment, apply committed migrations with:

```sh
npx prisma migrate deploy --schema ../prisma/schema.prisma
```

There is currently no seed script or sample data. No seed command is needed; add and configure a Prisma seed script before running `npx prisma db seed`.

If your database already has the User, Conversation, and Message tables, do not reset it or apply the baseline SQL again. After confirming the existing tables match the baseline, mark that migration as applied and then apply the additive feedback migration:

```sh
npx prisma migrate resolve --applied 20261001120000_init --schema ../prisma/schema.prisma
npx prisma migrate deploy --schema ../prisma/schema.prisma
```

Check `npx prisma migrate status --schema ../prisma/schema.prisma` first. The baseline migration represents the original chat tables; the following migration adds feedback without deleting existing data. Use `migrate deploy` for an existing or production database; reserve `migrate dev` for a disposable development database.

## Feedback API

Feedback endpoints require the authenticated access cookie. Users can submit feedback only for assistant messages in their own conversations.

- `POST /api/feedback` creates or updates one feedback record for the signed-in user, message, and feedback type. The request body includes `conversationId`, `messageId`, and `type`; ratings use `type: "GENERAL"` with an integer `rating` from 1 to 5. `BUG_REPORT` and `FEATURE_REQUEST` require a non-empty `comment` (up to 2,000 characters). `LIKE` and `DISLIKE` are mutually exclusive for a message.
- `GET /api/feedback/conversation/:conversationId` returns the signed-in user's saved feedback for that conversation.

Optional database browser:

```sh
npm run db:studio
```

## Run locally

Run each app in a separate terminal. Start the API from the backend directory:

```sh
cd backend
npm run dev
```

Start the frontend from the frontend directory:

```sh
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API listens on port `5000` by default; set `PORT` in `backend/.env` to change it and update `VITE_API_URL` and `CLIENT_ORIGIN` to match.

## Production build

Build the frontend from its directory:

```sh
cd frontend
npm run build
```

The backend currently provides a development watch script only (`npm run dev`); configure a production TypeScript build/start process before deploying it.
