# 🚀 Space News Hub

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)
![Render](https://img.shields.io/badge/API-Render-purple)

A modern full-stack MERN application that delivers real-time space news from trusted sources such as NASA, SpaceNews, NASASpaceflight, and more. Users can create accounts, securely log in, browse the latest space news, search articles, and save their favorite articles using a personalized bookmarking system.

---

## 🌐 Live Demo

🔗 **Live Application:**
https://space-news-hub-ce86-oeyoeu2mo-pranay-kumar-jhas-projects.vercel.app/

---

## 🌌 Overview

Space News Hub is a full-stack web application built using the MERN stack. The platform aggregates real-time space news through the Spaceflight News API and provides users with a personalized experience through authentication and bookmarking.

### Key Highlights

* Real-time space news aggregation
* Secure JWT-based authentication
* Personalized bookmarking system
* Responsive modern UI
* Full-stack MERN architecture
* Cloud deployment using Vercel and Render

---

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* Password Hashing with bcryptjs
* Protected Routes

### 📰 Space News Feed

* Real-time news updates
* Spaceflight News API integration
* Featured articles
* News cards with images
* Article summaries
* Direct links to original articles

### 🔍 Search Functionality

* Instant article search
* Dynamic filtering
* Keyword-based results

### ⭐ Bookmark System

* Save favorite articles
* Personalized bookmark collection
* Remove saved articles
* User-specific data storage

### 🎨 User Experience

* Modern dark-themed UI
* Responsive design
* Mobile-friendly layout
* Sticky navigation bar
* Clean card-based layout

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT (JSON Web Tokens)
* bcryptjs

### APIs

* Spaceflight News API

### Deployment

* Vercel (Frontend)
* Render (Backend API)

---

## 📁 Project Structure

```text
space-news-hub/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.development
│   ├── .env.production
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema

### User Model

```javascript
{
  email: String,
  password: String
}
```

### Bookmark Model

```javascript
{
  title: String,
  summary: String,
  image_url: String,
  url: String,
  news_site: String,
  published_at: Date,
  userId: ObjectId
}
```

---

## 🔗 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### News

```http
GET /api/news
```

### Bookmarks

```http
GET /api/bookmarks
POST /api/bookmarks
DELETE /api/bookmarks/:id
```

---

## 📸 Screenshots

### 🏠 Home Page

<img src="https://github.com/user-attachments/assets/b4165a7c-ac2f-428d-aa10-f2140a7e236e" alt="Home Page" width="100%" />

---

### 🔐 Login Page

<img src="https://github.com/user-attachments/assets/2f903ad1-b08f-4496-80dd-01ab7e7b11e9" alt="Login Page" width="100%" />

---

### 📝 Register Page

<img src="https://github.com/user-attachments/assets/c63c2faf-2b52-4946-b74f-7c43253281ec" alt="Register Page" width="100%" />

---

### 📰 News Feed

<img src="https://github.com/user-attachments/assets/354f4d69-36f2-422c-8532-065ad3152a6c" alt="News Feed" width="100%" />

---

### ⭐ Bookmarks Page

<img src="https://github.com/user-attachments/assets/c9ceef88-8303-4183-a62a-9512a86ea70b" alt="Bookmarks Page" width="100%" />

---

## ⚙️ Environment Variables

### Backend

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY

JWT_EXPIRES_IN=7d

FRONTEND_URL=YOUR_FRONTEND_URL
```

### Frontend

```env
VITE_API_URL=YOUR_BACKEND_API_URL
```

---

## 🚀 Local Installation

### Clone Repository

```bash
git clone YOUR_REPOSITORY_URL

cd space-news-hub
```

### Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file and add the required environment variables.

Run backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🧠 Challenges Solved

During development, several real-world engineering challenges were encountered and resolved:

* MongoDB Atlas configuration
* JWT Authentication implementation
* External API integration
* REST API architecture
* Environment variable management
* Production deployment
* Vercel ↔ Render communication
* CORS policy debugging
* Protected route implementation
* Frontend and backend integration

---

## 📚 What I Learned

This project provided hands-on experience with:

* React Development
* Node.js & Express
* MongoDB & Mongoose
* REST API Design
* JWT Authentication
* External API Integration
* Cloud Deployment
* Git & GitHub Workflows
* Production Debugging
* Full-Stack Application Architecture

---

## 🎯 Future Improvements

* Infinite scrolling
* Category-based filtering
* User profiles
* Article recommendations
* Email verification
* Password reset functionality
* Dark/Light theme switcher
* Trending news section
* Pagination support

---

## 👨‍💻 Author

### Pranay Kumar Jha

🔗 LinkedIn
https://www.linkedin.com/in/pranay-jha-530266328/

🔗 GitHub
https://github.com/Pranaykumarjha

🔗 Portfolio
https://portfolio-b3u8.vercel.app/

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

⭐ Star the repository and share your feedback!
