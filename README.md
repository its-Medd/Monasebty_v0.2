# Monasebty

[![Validate project](https://github.com/GitMehdi-sys/Monasebty/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/GitMehdi-sys/Monasebty/actions/workflows/pr-validation.yml)
[![CodeQL](https://github.com/GitMehdi-sys/Monasebty/actions/workflows/codeql.yml/badge.svg)](https://github.com/GitMehdi-sys/Monasebty/actions/workflows/codeql.yml)

A modern, full-stack wedding planning & vendor marketplace platform. Monasebty connects couples with wedding service providers—venues, photographers, bridal makeup artists, henna artists, bridal wear, car rentals, and customizable wedding cards.

---

## 🌟 Key Features

### For Couples & Customers
- **Comprehensive Listings & Discovery**: Browse services by category, location (including Laayoune directory), budget ranges, and ratings.
- **Interactive Wedding Card Editor**: In-browser canvas editor (powered by Fabric.js) allowing users to personalize wedding invitation cards with real-time text formatting and font loading.
- **Budget Estimator & Shortlisting**: Create budget estimations for services and invitation cards with automatic cost aggregation.
- **Direct Vendor Contact**: Instant inquiries and booking communications integrated with WhatsApp and SMS notifications.
- **Customer Reviews**: Verified review system for completed service bookings.

### For Vendors & Partners
- **Vendor Portal**: Vendor onboarding, profile management, and dashboard for managing service listings and invitation card templates.
- **Booking Management**: Real-time overview of incoming booking requests, status workflows (pending, confirmed, completed, cancelled), and calendar availability.
- **Media Uploads**: Cloudinary-powered image storage for portfolios, brand icons, and card templates with automated validation and optimization.

### For Administrators
- **Admin Control Panel**: Review and approve/reject vendor registration requests, published services, and card templates.
- **User & Review Moderation**: Complete moderation oversight over users, bookings, and customer reviews.

---

## 🛠 Tech Stack

### Frontend (`eazywed/`)
- **Core**: React 19, Vite, React Router v7
- **Styling**: Bootstrap 5, React-Bootstrap, FontAwesome, custom CSS tokens
- **Interactive Canvas**: Fabric.js for the dynamic card design studio
- **State & Networking**: React Context API, Axios, React Hook Form, Zod
- **Maps & UI Utilities**: Leaflet / React-Leaflet, React-Toastify, React-Calendar

### Backend (`backend/`)
- **Runtime**: Node.js (ES Modules), Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security & Hardening**:
  - Helmet for secure HTTP headers
  - Express Rate Limit to prevent abuse
  - Custom MongoDB query operator sanitation (`$eq` literal comparison)
  - CSRF origin and referer verification middleware
  - Subresource Integrity (SRI) on external CDNs
- **Authentication**: JWT authentication with HTTP-only cookies, bcrypt password hashing, and Twilio-backed phone OTP verification
- **Media & File Storage**: Cloudinary, Multer, Express-FileUpload
- **Scheduled Tasks**: Node-Cron for automated booking lifecycle management

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas URI)
- Cloudinary Account (for media uploads)

### 1. Clone the repository
```bash
git clone https://github.com/GitMehdi-sys/Monasebty.git
cd Monasebty
```

### 2. Environment Configuration

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/eazywed
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

Create a `.env` file in the `eazywed/` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_DEMO_MODE=false
```

### 3. Installation

From the project root, install dependencies for all workspaces:
```bash
npm run install:all
```

Or install separately:
```bash
# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd ../eazywed && npm install
```

### 4. Running the Application

**Run Frontend Development Server:**
```bash
npm run dev
# App will run at http://localhost:5173
```

**Run Backend Development Server:**
```bash
cd backend
npm run dev
# Server will run at http://localhost:5000
```

---

## 🧪 Testing & Quality Assurance

- **Backend tests:**
  ```bash
  npm --prefix backend test
  ```
- **Frontend tests:**
  ```bash
  npm --prefix eazywed test
  ```
- **Frontend build test:**
  ```bash
  npm --prefix eazywed run build
  ```

---

## 🔒 Security

All database queries are sanitized against NoSQL operator injection using strict literal comparison semantics (`$eq`), input validation, and strict property whitelisting. Dependencies are regularly audited and maintained vulnerability-free.

---

## 👥 Contributors

- **El Mehdi El Mouate** ([@GitMehdi-sys](https://github.com/GitMehdi-sys)) — Project Lead & Backend
- **Mohamed Belmaizi** ([@its-Medd](https://github.com/its-Medd)) — Collaborator & Contributor

---

## 📄 License

This project is licensed under the **PolyForm Noncommercial License 1.0.0** - see the [LICENSE](LICENSE) file for full legal terms.

> **Commercial Use Restriction**: This software is strictly for noncommercial, research, and personal use only. Use primarily intended for or directed towards commercial advantage or monetary compensation is expressly prohibited without written permission from the copyright owner.
