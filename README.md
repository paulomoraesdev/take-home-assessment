# Take-Home Assessment

Full-stack application for contact management.  
The API is built with Fastify and exposes endpoints to list, create, update, and delete contacts.  
The frontend is developed with Vue 3, consuming this API and providing an interface to manage the records.

[Preview](https://youtu.be/fu4JJydWcfQ)

You can read DECISIONS.md and IMPROVEMENTS.md to know what i didn't have enough time to do or why i didn't decide to.

## Stack

### Backend
- [Fastify](https://fastify.dev) — API framework.  
- [Prisma](https://www.prisma.io/) — ORM for database access.  
- [Supabase JS](https://supabase.com/docs/reference/javascript) — client for Supabase integrations.  
- [Zod](https://zod.dev) — schema validation.  
- [Dotenv](https://github.com/motdotla/dotenv) — environment variable loader.  
- @fastify/cors  
- Node.js, TypeScript, and tsx.  

### Frontend
- [Vue 3](https://vuejs.org/) with [Vite](https://vitejs.dev).  
- [Pinia](https://pinia.vuejs.org/) — state management.  
- [Vue Router](https://router.vuejs.org/) — routing.  
- [Tailwind CSS](https://tailwindcss.com/).  
- [Zod](https://zod.dev) — client-side validation.  
- Other utilities: vue-advanced-cropper, @fontsource/questrial.  

## Environment Variables

### Backend (`backend/.env`)
- `API_PORT` – server port.  
- `CORS_ORIGIN` – allowed origin for CORS.  
- `API_TOKEN` – static token for authentication.  
- `SUPABASE_PROJECT_URL` – Supabase project URL.  
- `SUPABASE_SERVICE_ROLE_KEY` – Supabase service role key.  
- `SUPABASE_BUCKET` – storage bucket.  
- `DATABASE_URL` – database connection URL.  
- `DIRECT_URL` – direct connection URL (optional).  

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL` – base URL of the API.  
- `VITE_API_TOKEN` – token sent in requests. Must be the same value as API_TOKEN 

## How to Run

### Installation

Before setting up the project, you'll need to a supabase project.

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd take-home-assessment
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   - Copy `backend/.env.example` to `backend/.env` and fill in the values
   - Copy `frontend/.env.example` to `frontend/.env` and fill in the values

4. **Prepare the database**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. **Run in development mode**
   In one terminal:
   ```bash
   cd backend
   npm run dev
   ```

   In another terminal:
   ```bash
   cd frontend
   npm run dev
   ```

6. **(Optional) Seed Data**
  If you want to populate the database with sample contacts, run the seed:
  ```bash
    cd backend
    npm run seed
  ```

⚠️ **Note:**  
The seed script **does not perform image upload or cropping**.  
It simply registers random images directly by URL, bypassing the upload/editing flow.
