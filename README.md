# WeHave.ai

An AI-powered web profile platform that helps users create and manage their digital presence.

## Features

- AI-powered profile generation
- Customizable web pages and websites
- Digital business card creation
- QR code generation
- AI chatbot for recruiter interactions
- Secure user authentication
- Multiple hosting options

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Hosting: Render

## Project Structure

```
wehave.ai/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
└── docs/             # Documentation
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wehave.ai.git
   cd wehave.ai
   ```

2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Set up the backend:
   ```bash
   cd ../backend
   npm install
   ```

4. Create a `.env` file in the backend directory:
   ```
   PORT=3001
   NODE_ENV=development
   DATABASE_URL=postgresql://username:password@localhost:5432/wehave_ai
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:5173
   ```

5. Initialize the database:
   ```bash
   cd backend
   npm run init-db
   ```

6. Start the development servers:

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

7. Open your browser and navigate to `http://localhost:5173`

## Development

- Frontend development server runs on port 5173
- Backend API server runs on port 3001
- API endpoints are prefixed with `/api`

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile
- PATCH `/api/users/profile` - Update user profile
- DELETE `/api/users/profile` - Delete user account

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 