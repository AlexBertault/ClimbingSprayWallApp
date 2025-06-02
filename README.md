# Climbing Board Backend

This is a minimal Node.js + Express + SQLite backend for the Climbing Board app.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:3001 by default.

## API Endpoints

- `POST /climbs` — Add a new climb
  - Body: `{ name, description, grade, creator, location, holds }`
- `GET /climbs?search=...` — Search climbs by name, description, or location
- `GET /climbs/:id` — Get a single climb by ID

## Deploying to Render

1. Push this folder to a GitHub repository.
2. Go to [Render.com](https://render.com/), create a new Web Service, and connect your repo.
3. Set the build and start commands:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Use the public URL Render provides as your API endpoint in your iOS app.

---

For questions or help, see the Render docs or ask your AI assistant! 