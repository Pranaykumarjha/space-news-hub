# Space News Hub - Frontend

A modern React frontend for the Space News Hub project built with Vite, React Router DOM, and Axios.

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Login page with email/password form
│   │   ├── Register.jsx       # Registration page with validation
│   │   └── Home.jsx           # Main dashboard displaying space news
│   ├── services/
│   │   └── api.js             # Axios instance with API interceptors
│   ├── components/            # Reusable React components (extensible)
│   ├── styles/
│   │   ├── Auth.css           # Authentication pages styling
│   │   └── Home.css           # Home page styling
│   ├── App.jsx                # Main app component with React Router
│   ├── main.jsx               # React application entry point
│   ├── App.css                # Global app styles
│   └── index.css              # Global CSS variables and base styles
├── package.json
├── vite.config.ts
└── index.html
```

## Tech Stack

- **React 19.2.6** - UI library
- **Vite 8.0.12** - Fast build tool and dev server
- **React Router DOM 7.17.0** - Client-side routing
- **Axios 1.18.0** - HTTP client with interceptors

## Available Routes

- `/login` - User login page
- `/register` - User registration page
- `/` - Home page (requires authentication)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port)

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm preview
```

## Features

### Authentication Pages
- **Login Page**: Email and password authentication with error handling
- **Register Page**: User registration with password confirmation validation

### Home Page
- Protected route (redirects to login if not authenticated)
- Displays "Space News Hub" heading with rocket emoji
- Fetches and displays space news from backend API
- Placeholder loading state with shimmer animation
- Logout functionality

### API Integration
- Axios instance configured with:
  - Base URL: `http://localhost:5000/api`
  - Automatic auth token injection from localStorage
  - Request/response interceptors for error handling
  - Support for Bearer token authentication

## Component Details

### api.js
- Centralized Axios configuration
- Automatic token injection in request headers
- Auth token stored in localStorage as `authToken`
- Response error handling

### Login.jsx
- Form validation
- Password field masked
- Stores auth token on successful login
- Auto-redirects to home page
- Link to registration page

### Register.jsx
- Email and password fields
- Password confirmation validation
- Success/error message display
- Auto-redirect to login after successful registration
- Link to login page

### Home.jsx
- Authentication check on mount
- Fetches news from `/api/news` endpoint
- Displays news cards with title, description, and date
- Placeholder cards during loading
- Logout button in header
- Responsive grid layout

## Styling

### Color Scheme
- Primary Gradient: Purple (#667eea → #764ba2)
- Text: Dark gray (#333)
- Background: Light blue-gray (#f5f7fa)
- Borders: Light gray (#ddd)

### Features
- Modern card-based design
- Gradient headers and buttons
- Shimmer loading animations
- Responsive mobile design
- Smooth transitions and hover effects

## Environment Setup

Make sure your backend is running on `http://localhost:5000` with the following API endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/news` - Fetch space news

## Notes

- Authentication tokens are stored in browser localStorage
- The app redirects unauthenticated users to the login page
- Axios interceptors automatically handle token injection
- All pages include comprehensive comments explaining functionality

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- User profile page
- News filtering and search
- Favorites/bookmarks functionality
- Dark mode toggle
- Notification system
- More detailed news view
