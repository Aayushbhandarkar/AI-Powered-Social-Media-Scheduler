AI-Powered Social Media Scheduler 🚀
A full-stack MERN application that helps you schedule social media posts across multiple platforms with AI-generated content. Connect your Twitter, LinkedIn, and Instagram accounts, use AI to generate engaging content, and schedule posts for automatic publishing.

🌟 Live Demo
Frontend: https://ai-powered-social-media-scheduler.onrender.com

Backend: https://ai-powered-social-media-scheduler-backend.onrender.com

📋 Features
🔐 Authentication
JWT-based authentication system

OAuth integration with Twitter, LinkedIn, and Instagram

Secure login/signup with password hashing

🤖 AI-Powered Content Generation
Integrated with Google Gemini AI

Smart content suggestions and post generation

Context-aware conversation with AI assistant

Customizable content tone and style

📅 Social Media Management
Connect multiple social media accounts (Twitter, LinkedIn, Instagram)

Schedule posts with calendar interface

Automatic posting at scheduled times

Post status tracking (scheduled, published, failed)

🎨 User Experience
Modern dark theme UI/UX

Fully responsive design (mobile + desktop)

Real-time updates and notifications

Intuitive dashboard and navigation

🛠️ Tech Stack
Frontend
React.js - Component-based UI library

Tailwind CSS - Utility-first CSS framework

React Router - Client-side routing

Axios - HTTP client for API calls

Vite - Fast build tool and dev server

Backend
Node.js - Runtime environment

Express.js - Web application framework

MongoDB - NoSQL database

Mongoose - MongoDB object modeling

JWT - JSON Web Tokens for authentication

Passport.js - Authentication middleware

OAuth - Social media integration

Additional Technologies
Google Gemini AI - AI content generation

Node-cron - Job scheduling for automatic posting

Date-fns - Date utility library

React Icons - Icon library

📦 Installation & Setup
Prerequisites
Node.js (v14 or higher)

MongoDB (local or cloud instance)

Social media developer accounts (Twitter, LinkedIn, Instagram)

Google AI Studio account (for Gemini API)

1. Clone the Repository
bash
git clone [https://github.com/yourusername/ai-social-media-scheduler.git](https://github.com/Aayushbhandarkar/AI-Powered-Social-Media-Scheduler.git)
cd ai-social-media-scheduler
2. Install Dependencies
bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
3. Environment Configuration
Create a .env file in the root directory:

env
# Server
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000

# OAuth Keys
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_CALLBACK_URL=http://localhost:5000/api/auth/twitter/callback

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback

INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_CALLBACK_URL=http://localhost:5000/api/auth/instagram/callback

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
4. Run the Application
Development Mode:

bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:

# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
Production Mode:

bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
🚀 Deployment
Frontend Deployment (Render)
Connect your GitHub repository to Render

Set build command: cd client && npm install && npm run build

Set publish directory: client/dist

Add environment variables

Backend Deployment (Render)
Create a Web Service on Render

Set build command: cd server && npm install

Set start command: cd server && npm start

Add environment variables from your .env file

📱 Usage
Sign Up/Login: Create an account or login with existing credentials

Connect Social Accounts: Link your Twitter, LinkedIn, and Instagram accounts via OAuth

Generate Content: Use the AI chatbot to create engaging social media posts

Schedule Posts: Choose platforms, set date/time, and schedule your posts

Monitor: Track post status and performance through the dashboard

🏗️ Project Structure
text
ai-social-media-scheduler/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── scripts/          # Background scripts
└── package.json          # Root package.json
🔧 API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/me - Get current user

GET /api/auth/twitter - Twitter OAuth

GET /api/auth/linkedin - LinkedIn OAuth

GET /api/auth/instagram - Instagram OAuth

Posts
GET /api/posts - Get user's posts

POST /api/posts - Create new post

PUT /api/posts/:id - Update post

DELETE /api/posts/:id - Delete post

Social Media
GET /api/social/accounts - Get connected accounts

DELETE /api/social/disconnect/:platform - Disconnect account

AI Chatbot
POST /api/chatbot/generate - Generate AI content

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Google Gemini AI for content generation capabilities

Social media platforms for their API access

Render for hosting services

The open-source community for amazing tools and libraries

📞 Support
If you have any questions or need help with setup, please open an issue or contact the development team.

Built with ❤️ using the MERN Stack
