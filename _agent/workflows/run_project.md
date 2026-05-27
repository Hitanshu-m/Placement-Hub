---
description: how to run the placement system project
---
// turbo-all
1. Install all dependencies:
   ```bash
   npm run install-all
   ```
2. (Optional) Seed the database with initial data:
   ```bash
   cd backend && node seed.js && cd ..
   ```
3. Start both backend and frontend:
   ```bash
   npm start
   ```
   - Backend will run on http://localhost:5000
   - Frontend will run on http://localhost:5173
