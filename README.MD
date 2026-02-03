<h1 align="center">✨ Full-Stack Chat App with Auth & Emails ✨</h1>

## ABOUT

### Highlights:

- 🔐 Custom JWT Authentication (no 3rd-party auth)
- ⚡ Real-time Messaging via Socket.io
- 🟢 Online/Offline Presence Indicators
- 🔔 Notification & Typing Sounds (with toggle)
- 📨 Welcome Emails on Signup (Resend)
- 🗂️ Image Uploads (Cloudinary)
- 🧰 REST API with Node.js & Express
- 🧱 MongoDB for Data Persistence
- 🚦 API Rate-Limiting powered by Arcjet
- 🎨 Beautiful UI with React, Tailwind CSS & DaisyUI
- 🧠 Zustand for State Management
- 🧑‍💻 Git & GitHub Workflow (branches, PRs, merges)
- 🚀 Easy Deployment (free-tier friendly with Sevalla)

---

1. hosting project on sevalla (Not Implemented Yet because trial)
   that can run the both frontend and backend application just in one same repo project (not separrated frontend and backend) so it will run from root package.json

sevalla login account using github account

2. Resend (aj**\*\*\***2@gmail.com)
   to send an email to user that successed register to our website

3. cloudinary (aj\*\*\*\*\*\*g@gmail.com)
   image cdn

![Demo App](/frontend/public/screenshot-for-readme.png)

---

### Frontend (`/frontend`)

- Tailwind css

## 🧪 .env Setup

### Backend (`/backend`)

- database using mongodb aj**\*\***g@gmail.com

```bash
PORT=3000
MONGO_URI=your_mongo_uri_here

NODE_ENV=development

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email_from_address
EMAIL_FROM_NAME=your_email_from_name

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

---

## 🔧 Run the Backend

```bash
cd backend
npm install
npm run dev
```

## 💻 Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

## SECTION NOT IMPLEMENTED YET

- 'resend' email send after register user
- rate limitting with arcjet, example on rapid login [02:35:17]
- BE : handle error upload image large file [05:10:00]
- BE : send Message concat,
- BE : show message still empty message from api
