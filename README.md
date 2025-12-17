**Premed**
Premed is a full-stack web application for managing the medical school admission process.
It includes a public client application and an administrative panel for managing users, admission steps, announcements, and related data.
The system is deployed in production using Docker, Nginx, HTTPS, and MongoDB.

**Architecture Overview**
The application is composed of three main services, all running in Docker containers:
Client – React (Create React App) served via Nginx
API Server – Node.js with Express
Database – MongoDB
Nginx (HTTPS, SPA routing)
   ├── /        → React build
   └── /api     → Node.js API Server
                     ↓
                  MongoDB
**Tech Stack**
Frontend:
React (CRA)
Redux
Axios

Backend:
Node.js
Express
Mongoose
JWT authentication (access + refresh tokens)

Infrastructure:
Docker & Docker Compose
Nginx (reverse proxy + SPA handling)
Let’s Encrypt / Certbot (SSL certificates)

**Environment & Deployment**
Docker Services:
react-app – builds the React app and serves it with Nginx
api-server – Express server exposed internally
mongodb – MongoDB with authentication enabled

Environment Variables:
Sensitive values are stored in .env (gitignored):
MONGO_URI
DB_USER
DB_PASS
JWT_SECRET
JWT_SECRET_REFRESH
NODE_ENV

**HTTPS & Security**
HTTPS is enabled via Let’s Encrypt
Certificates are automatically renewed by Certbot
HTTP traffic is redirected to HTTPS
Nginx proxies /api requests to the API container
SPA routing is handled with try_files fallback to index.html

**Current Status**
The site is successfully deployed and accessible in production.

What works:
React app loads correctly
Static assets are served properly
API routing through Nginx works
Authentication infrastructure is active
MongoDB is connected and operational
HTTPS certificate is valid and auto-renewing

**Known Issues / Open Tasks**
The following features are currently not functioning correctly and require fixes:
Admission Steps flow
Steps logic does not load or progress correctly
Adding new announcements
Admin cannot successfully create new announcements
Admin admission process
The admin panel crashes during the admission workflow

These issues are backend-related and likely involve:
Missing or inconsistent MongoDB data
Logic errors in Mongoose queries
Incomplete validation or authorization handling

**Notes for Future Development**
Improve error handling and logging in the API
Add database seed scripts for initial admin users and base data
Add health checks for containers
Add role-based access control enforcement
Write integration tests for critical flows (auth, steps, admin)


**Summary**
This project now has:
A working production deployment
Correct Docker + Nginx + HTTPS setup
Stable frontend serving
Connected backend and database

>> The next phase is stabilizing business logic, especially around the admission workflow and admin features.
