# CodeReview AI - AI-Powered Code Review Platform

A sophisticated full-stack application for code review with AI-powered analysis, collaborative features, and intelligent suggestions. Built with Next.js 16, Express, PostgreSQL, and OpenAI integration.

## 🚀 Features

- **AI-Powered Code Analysis**: Automated code review using OpenAI GPT-4 for bug detection, performance optimization, and security suggestions
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Repository Management**: Organize and track multiple code repositories
- **Code Reviews**: Create, manage, and track code reviews with status tracking
- **Collaborative Comments**: Team collaboration through comments on code reviews
- **Smart Suggestions**: AI-generated suggestions categorized by type (BUG, PERFORMANCE, SECURITY, STYLE, BEST_PRACTICE, DOCUMENTATION) and severity
- **Responsive UI**: Clean, modern interface built with Tailwind CSS and custom components
- **Real-time Updates**: Dynamic dashboard with statistics and activity tracking

## 🛠️ Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router and Server Components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Custom UI Components**: Button, Input, Card, Badge, Textarea components

### Backend
- **Node.js & Express**: RESTful API server
- **TypeScript**: Type-safe backend development
- **Prisma ORM**: Database ORM with PostgreSQL
- **JWT Authentication**: Secure token-based authentication
- **OpenAI API**: AI-powered code analysis
- **Zod**: Runtime type validation

### Database
- **PostgreSQL**: Relational database with Prisma ORM

## 📁 Project Structure

```
krud/
├── frontend/                 # Next.js 16 frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── page.tsx     # Landing page
│   │   │   ├── login/       # Login page
│   │   │   ├── register/    # Registration page
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   ├── repositories/# Repository management
│   │   │   └── code-reviews/# Code review pages
│   │   ├── components/      # Reusable components
│   │   │   └── ui/          # UI components
│   │   └── lib/             # Utilities and API client
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Express API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication middleware
│   │   ├── services/        # AI service
│   │   └── utils/           # Prisma client
│   ├── prisma/              # Database schema
│   │   └── schema.prisma
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- OpenAI API key (optional, for AI features)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/codereviewdb?schema=public"
JWT_SECRET="your_jwt_secret_key_here"
PORT=5000
NODE_ENV=development
OPENAI_API_KEY="your_openai_api_key_here"
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Generate Prisma client:
```bash
npm run prisma:generate
```

7. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📊 Database Schema

### Users
- Email, name, password (hashed)
- GitHub and LinkedIn profile links
- Relationships to repositories, code reviews, and comments

### Repositories
- Name, description, URL, language
- Belongs to a user
- Has many code reviews

### Code Reviews
- Title, code snippet, language, status
- AI analysis results
- Belongs to a user and repository
- Has many comments and suggestions

### Comments
- Content, timestamps
- Belongs to a user and code review

### Suggestions
- Type, content, line numbers, severity
- AI-generated or manually added
- Belongs to a code review

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication with expiration
- **Input Validation**: Zod schema validation on all API endpoints
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **CORS Configuration**: Configured cross-origin resource sharing
- **Environment Variables**: Sensitive data stored in environment files

## 🤖 AI Integration

The application uses OpenAI GPT-4 for code analysis:

- **Automatic Analysis**: Code is analyzed when a review is created
- **Smart Suggestions**: Categorized by type and severity
- **Fallback Mode**: Works without API key with basic suggestions
- **Configurable**: Add your OpenAI API key for advanced features

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Repositories
- `POST /api/repositories` - Create repository
- `GET /api/repositories` - Get all repositories
- `GET /api/repositories/:id` - Get repository by ID
- `PUT /api/repositories/:id` - Update repository
- `DELETE /api/repositories/:id` - Delete repository

### Code Reviews
- `POST /api/code-reviews` - Create code review (with AI analysis)
- `GET /api/code-reviews` - Get all code reviews
- `GET /api/code-reviews/:id` - Get code review by ID
- `PUT /api/code-reviews/:id` - Update code review
- `PATCH /api/code-reviews/:id/status` - Update review status
- `DELETE /api/code-reviews/:id` - Delete code review

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments/:codeReviewId` - Get comments for review
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Suggestions
- `POST /api/suggestions` - Create suggestion
- `GET /api/suggestions/:codeReviewId` - Get suggestions for review
- `PUT /api/suggestions/:id` - Update suggestion
- `DELETE /api/suggestions/:id` - Delete suggestion

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL` (your deployed backend URL)
4. Deploy

### Backend Deployment (Railway/Render/Heroku)

1. Push code to GitHub
2. Create a PostgreSQL database
3. Deploy backend to Railway/Render/Heroku
4. Configure environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT`
   - `NODE_ENV`
   - `OPENAI_API_KEY` (optional)
5. Run migrations: `npm run prisma:migrate`
6. Generate Prisma client: `npm run prisma:generate`

## 🧪 Testing

The application includes comprehensive error handling and validation. For production, consider adding:

- Unit tests with Jest
- Integration tests with Supertest
- E2E tests with Playwright
- API testing with Postman collections

## 📝 License

This project is built as a demonstration for the House of Edtech Fullstack Developer assignment.

## 👤 Developer

Built by Your Name

- [GitHub Profile](https://github.com/yourprofile)
- [LinkedIn Profile](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- OpenAI for GPT-4 API
- Prisma team for the ORM
- Tailwind CSS for the styling framework
#   r e s e a r c h h u b  
 #   R e s e a r c h H u b  
 