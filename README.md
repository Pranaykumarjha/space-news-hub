# 🚀 Space News Hub

A full-stack MERN application that delivers the latest space news from trusted sources such as NASA, SpaceNews, NASASpaceflight, and more. Users can create accounts, securely log in, browse real-time space news, search articles, and save their favorite articles using a personalized bookmarking system.

---

## 🌌 Overview

Space News Hub is a modern full-stack web application built using the MERN stack. The platform aggregates real-time space news through the Spaceflight News API and allows authenticated users to bookmark articles for future reference.

The project demonstrates:

* Full-stack development
* JWT Authentication
* MongoDB integration
* RESTful APIs
* External API consumption
* Protected routes
* Deployment using Render and Vercel
* Responsive UI design

---

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* Secure JWT Authentication
* Password Hashing using bcryptjs
* Protected Routes

### 📰 Space News Feed

* Real-time space news
* News fetched from Spaceflight News API
* Featured article section
* News cards with images and summaries
* Direct article links

### 🔍 Search Functionality

* Search articles instantly
* Filter news by keywords
* Dynamic results

### ⭐ Bookmark System

* Save favorite articles
* View bookmarked articles
* Remove bookmarks
* User-specific saved content

### 🎨 User Interface

* Modern dark-themed design
* Responsive layout
* Sticky navigation
* Mobile-friendly experience

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router DOM
* Axios
* CSS / Custom Styling

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* bcryptjs

### External APIs

* Spaceflight News API

### Deployment

* Vercel (Frontend)
* Render (Backend)

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

#### Register User

```http
POST /api/auth/register
```

#### Login User

```http
POST /api/auth/login
```

---

### News

#### Get Latest News

```http
GET /api/news
```

---

### Bookmarks

#### Get User Bookmarks

```http
GET /api/bookmarks
```

#### Save Bookmark

```http
POST /api/bookmarks
```

#### Delete Bookmark

```http
DELETE /api/bookmarks/:id
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY

JWT_EXPIRES_IN=7d

FRONTEND_URL=YOUR_FRONTEND_URL
```

### Frontend (.env.development)

```env
VITE_API_URL=http://localhost:5000/api
```

### Frontend (.env.production)

```env
VITE_API_URL=YOUR_RENDER_BACKEND_URL/api
```

---

## 🚀 Local Installation

### Clone Repository

```bash
git clone YOUR_REPOSITORY_URL

cd space-news-hub
```

---

### Backend Setup

```bash
cd backend

npm install
```

Create:

```env
.env
```

Add required environment variables.

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

## 🌍 Deployment

### Frontend

Hosted on:

**Vercel**

Live Demo:

```text
[YOUR_VERCEL_URL_HERE]
```

---

### Backend

Hosted on:

**Render**

API URL:

```text
[YOUR_RENDER_URL_HERE]
```

---

### Database

Hosted on:

**MongoDB Atlas**

---

## 📸 Screenshots

### Home Page

```text
<img width="1856" height="920" alt="image" src="https://github.com/user-attachments/assets/b4165a7c-ac2f-428d-aa10-f2140a7e236e" />

```

---

### Login Page

```text
<img width="1895" height="905" alt="image" src="https://github.com/user-attachments/assets/2f903ad1-b08f-4496-80dd-01ab7e7b11e9" />

```

---

### Register Page

```text
<img width="1891" height="897" alt="image" src="https://github.com/user-attachments/assets/c63c2faf-2b52-4946-b74f-7c43253281ec" />

```

---

### News Feed

```text
<img width="1889" height="2701" alt="image" src="https://github.com/user-attachments/assets/354f4d69-36f2-422c-8532-065ad3152a6c" />


```

---

### Bookmarks Page

```text
<img width="1886" height="2305" alt="image" src="https://github.com/user-attachments/assets/c9ceef88-8303-4183-a62a-9512a86ea70b" />

```

---

## 🧠 Challenges Faced

During development several real-world problems were encountered and solved:

* MongoDB Atlas connection configuration
* JWT Authentication setup
* External API integration
* Environment variable management
* Production deployment
* CORS policy issues between Vercel and Render
* API communication debugging
* Protected route implementation

These challenges provided practical experience with real-world full-stack application development.

---

## 🎯 Future Improvements

* User profiles
* Category-based filtering
* Infinite scrolling
* Article recommendations
* Dark/Light mode toggle
* Email verification
* Password reset functionality
* Admin dashboard
* Trending news section
* Pagination support

---

## 📚 What I Learned

This project helped me gain hands-on experience with:

* React Development
* Node.js & Express
* MongoDB & Mongoose
* REST API Design
* JWT Authentication
* API Integration
* Cloud Deployment
* Git & GitHub Workflows
* Debugging Production Issues
* Full-Stack Application Architecture

---

## 👨‍💻 Author

**Pranay Kumar Jha**

LinkedIn:
https://www.linkedin.com/in/pranay-jha-530266328/

GitHub:
https://github.com/Pranaykumarjha

Portfolio:
https://portfolio-b3u8.vercel.app/

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

⭐ Star the repository and share your feedback.
