# Project Management Web App

A full-stack project management application with RBAC, task tracking, and a clean dashboard.

## 🚀 Features
- **Auth**: Signup/Login with JWT.
- **RBAC**: Admin/Member roles.
- **Projects**: Create projects, add members.
- **Tasks**: Create, assign, and track task status (To Do, In Progress, Completed, Overdue).
- **Dashboard**: Real-time stats and overdue task alerts.

## ⚙️ Tech Stack
- **Frontend**: React, Vite, TypeScript, Vanilla CSS (Lucide-React for icons).
- **Backend**: Node.js, Express, TypeScript, Prisma.
- **Database**: PostgreSQL (via Docker).

## 🛠️ Setup & Installation

### 1. Database (Docker)
Ensure Docker is running, then start the PostgreSQL container:
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
# Push schema to DB (make sure Docker DB is running)
npm run prisma:push
# Start dev server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📝 Credentials
You can register as an **Admin** or **Member** during signup. 
Admin has full control over projects they create.

## 🎨 Design
The app uses a premium light-themed design with:
- **HSL tailored colors** (Indigo/Slate palette).
- **Glassmorphism** and subtle shadows.
- **Micro-animations** (fade-ins and hover states).
- **Responsive Layout** for desktop and mobile.
