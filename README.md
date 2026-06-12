# Premium Personal Portfolio Website

A high-performance, responsive, and visually stunning developer portfolio website built on the **MERN (MongoDB, Express, React, Node.js)** stack with **Prisma ORM**, **Framer Motion**, and **Vercel Analytics**. 

This repository features a comprehensive **Admin Portal** to update dynamic profile metrics (like Codeforces/Leetcode/Codechef ratings), experience, education, projects, certifications, achievements, and blog posts securely.

---

## 🚀 Key Features

* **Premium Design Aesthetics**: Clean, HSL-tailored dark mode, smooth glassmorphism, responsive grid layouts, and micro-animations powered by Framer Motion.
* **Admin Portal**: A password-protected dashboard to manage the portfolio content dynamically without writing code.
* **Visitor & Download Analytics**: Tracks custom profile metric views, resume downloads, and integrates seamlessly with Vercel Analytics.
* **Auto-hiding/Private Analytics Redirection**: Clickable analytics dashboard link in the admin portal that checks target hostnames to prevent external clones/forks from exposing your private dashboard URL.
* **Dynamic Blogging Integration**: Displays technical articles and supports custom external redirection links (like Dev.to or Medium) with secure opening tags (`noopener, noreferrer`).
* **Cloudinary & Resend Integration**: Ready to be integrated for handling dynamic file uploads (e.g. resumes, images) and email forms securely.

---

## 📁 Project Structure

```
Personal-Portfolio-Website/
├── backend/
│   ├── middleware/        # Authentication & file processing middleware
│   ├── prisma/            # Prisma schema, SQLite/MongoDB database config, and seed scripts
│   ├── routes/            # API endpoints (Auth, Blog, Analytics, Profile, Projects, etc.)
│   ├── server.js          # Express app initialization
│   └── .env               # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components (Blog, AdminDashboard, Portfolio, etc.)
│   │   ├── App.jsx        # App entry & layout configuration
│   │   └── main.jsx       # ReactDOM render wrapper with Vercel Analytics initialization
│   ├── .env.example       # Example file for frontend environment variables
│   └── package.json       # React / Vite scripts & dependencies
├── package.json           # Root workspace script scripts (concurrent dev commands)
└── README.md              # Project documentation
```

---

## 🛠️ Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** instance (local or via Atlas Cloud)

### 1. Installation
In the root directory, run the following command to automatically install all dependencies for both the frontend and backend:
```bash
npm run install:all
```

### 2. Environment Variables Configuration

#### Backend Configuration
Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority"
JWT_SECRET="your_jwt_secret_key"

# Integrations (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=portfolio@yourdomain.com
RESEND_TO_EMAIL=your-personal-email@gmail.com
```

#### Frontend Configuration
Create a `.env` file inside the `frontend/` folder:
```env
VITE_BRAND_NAME="Portfolio.Dev"
VITE_USER_NAME="Your Name"
VITE_USER_EMAIL="your.email@example.com"
VITE_GITHUB_PRIMARY="github_username_1"
VITE_GITHUB_SECONDARY="github_username_2"
VITE_LINKEDIN="linkedin_slug"
VITE_CODEFORCES="codeforces_handle"
VITE_CODECHEF="codechef_handle"
VITE_RESUME_FILE="Resume.pdf"
VITE_VERCEL_ANALYTICS_URL="https://vercel.com/your-username-projects/your-project-name/analytics"
```

### 3. Database Initialization & Seeding
Generate the Prisma client, migrate schemas, and seed the database with initial mock/template data:
```bash
# Generate Prisma schema client
npm run prisma:generate

# Seed database
npm run prisma:seed
```

### 4. Running the Development Server
Launch both the backend and frontend development servers concurrently:
```bash
npm run dev
```
* **Frontend UI**: Running at `http://localhost:5173` (or the port Vite selects)
* **Backend API**: Running at `http://localhost:5000`

---

## 🔐 Admin Portal Credentials
Default seeded credentials for the admin portal:
* **Username**: `admin`
* **Password**: `adminpassword`

> **Note**: For production, make sure to change the hashed password in MongoDB or customize the backend authentication configuration.

---

## 📈 Deployment on Vercel

1. Push your code repository to GitHub/GitLab.
2. Link the project to Vercel.
3. Configure the respective environment variables (`VITE_VERCEL_ANALYTICS_URL`, etc.) under the Project Settings -> Environment Variables.
4. **Vercel Analytics**: Install the integration via the Vercel Dashboard to begin counting page views.
