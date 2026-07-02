# SunoSarkar — سنو سرکار

**Real complaints. Real accountability. Real change.**

SunoSarkar is a full-stack civic complaint platform built for Pakistan. Citizens can report public infrastructure problems directly to the government officers responsible for fixing them — with photo evidence, location data, and a live accountability trail.

**Live Demo:** https://suno-sarkar.vercel.app

---

## The Problem

In Pakistan, millions of civic problems go unresolved every year. Broken roads, overflowing sewage, no street lights, garbage piling up for weeks. Citizens complain. Nothing happens. There is no record, no accountability, no follow-up.

SunoSarkar changes that. Every complaint is routed to the specific officer responsible for that union council. Every status change triggers an email. The citizen confirms resolution. The loop closes.

---

## Features

### For Citizens
- Register with CNIC and verify email via OTP
- File complaints with category, priority, photos, and GPS location
- Track complaint status in real time
- Confirm when a problem is actually resolved
- Upvote complaints to show community support
- Full Urdu language support for senior citizens
- Dark and light mode

### For Officers
- Area-specific dashboard showing only complaints in their jurisdiction
- Instant email notification when a new complaint is filed
- Update complaint status with notes (Accepted, In Progress, Resolved, Rejected)
- Citizen gets email notification on every status change
- Leaderboard ranking by resolved complaints — public accountability

### For Admins
- Platform-wide dashboard with statistics and charts
- Manage all users and officers
- Approve or reject officer registrations
- View all complaints across all cities
- City-wise resolution rates and category breakdowns

### Public
- Live complaint feed by city — fully transparent, no login required
- Officer leaderboard — public rankings
- City statistics — complaints, resolution rates, category breakdown
- Emergency contacts for every major city

---

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.5
- Spring Security with JWT Authentication
- Spring Data JPA + Hibernate
- MySQL 8
- JavaMailSender for email notifications
- Cloudinary for photo storage
- Maven

### Frontend
- React 19
- Vite 8
- Tailwind CSS v4
- Axios
- React Router v7
- Recharts for data visualization
- Lucide React icons
- React Hot Toast

### Deployment
- Frontend: Vercel
- Backend: Cloudflare Tunnel / Oracle Cloud
- Database: MySQL

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│              (Vercel — suno-sarkar.vercel.app)          │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / REST API
┌────────────────────────▼────────────────────────────────┐
│                 Spring Boot Backend                      │
│           JWT Auth + Role-based Access Control           │
│    Citizen | Officer | Admin | UC Chairman | Mayor       │
└──────────┬────────────────────────┬─────────────────────┘
           │                        │
┌──────────▼──────────┐   ┌─────────▼─────────────────────┐
│     MySQL 8         │   │   Gmail SMTP + Cloudinary      │
│  complaints, users  │   │   Emails + Photo storage       │
│  officers, OTP      │   └───────────────────────────────┘
└─────────────────────┘
```

---

## Complaint Flow

```
Citizen files complaint
        ↓
Officer in that UC gets email notification
        ↓
Officer accepts → Citizen gets email
        ↓
Officer marks resolved → Citizen gets email
        ↓
Citizen confirms resolution (or reopens)
        ↓
Complaint closed with full audit trail
```

---

## Officer Roles

| Role | Jurisdiction |
|------|-------------|
| Municipal Worker | Field-level operations |
| UC Chairman | Union Council level |
| Town Officer | Town administration |
| Assistant Commissioner | Sub-division |
| Deputy Commissioner | District level |
| Mayor | City level |
| Admin | Platform-wide |

---

## Getting Started

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8
- Maven

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Chander-parkash007/SunoSarkar.git
cd SunoSarkar/sunosarkar

# Create MySQL database
mysql -u root -p
CREATE DATABASE sunosarkar;
exit

# Configure application.properties
# Edit src/main/resources/application.properties
# Set your MySQL credentials, Gmail SMTP, Cloudinary keys

# Run the backend
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd SunoSarkar/sunosarkar-frontend

# Install dependencies
npm install

# Create .env.development
echo "VITE_API_URL=" > .env.development

# Run the frontend
npm run dev
```

Frontend runs on http://localhost:5173
Backend runs on http://localhost:8080

---

## Environment Variables

### Backend (application.properties)

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/sunosarkar}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:yourpassword}
jwt.secret=${JWT_SECRET:your-secret-key}
spring.mail.username=${SPRING_MAIL_USERNAME:your-email@gmail.com}
spring.mail.password=${SPRING_MAIL_PASSWORD:your-app-password}
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME:your-cloud-name}
cloudinary.api-key=${CLOUDINARY_API_KEY:your-api-key}
cloudinary.api-secret=${CLOUDINARY_API_SECRET:your-api-secret}
```

### Frontend (.env.production)

```
VITE_API_URL=https://your-backend-url/api
```

---

## API Endpoints

### Authentication
```
POST /api/auth/user/register      Register citizen
POST /api/auth/officer/register   Register officer
POST /api/auth/verify-email       Verify OTP
POST /api/auth/user-login         Citizen login
POST /api/auth/officer-login      Officer login
POST /api/auth/resend-otp         Resend OTP
```

### Complaints
```
POST /api/complaints              File complaint (multipart)
GET  /api/complaints/my           Get my complaints
GET  /api/complaints/public       Public feed by city
GET  /api/complaints/area         Area complaints (officers)
GET  /api/complaints/all          All complaints (admin)
POST /api/complaints/:id/status   Update status
POST /api/complaints/:id/confirm  Citizen confirms resolved
POST /api/complaints/:id/upVote   Upvote complaint
```

### Officer
```
GET /api/officer/dashboard        Officer dashboard stats
GET /api/officer/pending          Pending complaints in area
GET /api/officer/leaderboard      Public officer rankings
```

### Admin
```
GET /api/admin/users              All registered users
GET /api/admin/officers           All officers
GET /api/admin/officers/pending   Officers awaiting approval
PUT /api/admin/officers/:id/verify    Approve officer
PUT /api/admin/users/:id/deactivate   Deactivate user
GET /api/admin/stats              Platform statistics
```

### Public
```
GET /api/stats/city/:city         City statistics
GET /api/stats/categories/:city   Category breakdown
GET /api/stats/status/:city       Status breakdown
GET /api/emergency/:city          Emergency contacts
```

---

## What Can Citizens Report

- Broken roads and potholes
- Garbage collection issues
- Sewage and drainage problems
- Water supply failures
- Street light outages
- Sanitation and hygiene
- Parks and public spaces
- Any other civic infrastructure issue

---

## Project Structure

```
SunoSarkar/
├── sunosarkar/                    # Spring Boot backend
│   ├── src/main/java/SunoSarkar/
│   │   ├── config/                # Security, CORS
│   │   ├── controller/            # REST controllers
│   │   ├── dto/                   # Data transfer objects
│   │   ├── entity/                # JPA entities
│   │   ├── enums/                 # Roles, status, category
│   │   ├── exception/             # Global exception handler
│   │   ├── repository/            # Spring Data JPA repos
│   │   ├── security/              # JWT filter and util
│   │   ├── service/               # Business logic
│   │   └── scheduling/            # Auto reminder emails
│   └── src/main/resources/
│       └── application.properties
│
└── sunosarkar-frontend/           # React frontend
    ├── src/
    │   ├── components/            # Reusable UI components
    │   ├── context/               # App context, translations
    │   ├── lib/                   # API client, auth helpers
    │   └── pages/                 # All page components
    │       ├── auth/              # Login, register, verify
    │       ├── citizen/           # Citizen dashboard
    │       ├── officer/           # Officer dashboard
    │       ├── admin/             # Admin panel
    │       └── public/            # Public pages
    └── public/
```

---

## Security

- JWT tokens with 24-hour expiration
- BCrypt password hashing
- Role-based access control on every endpoint
- Email OTP verification for all registrations
- Officer accounts require admin approval before login
- CORS restricted to allowed origins only
- Input validation on all DTOs

---

## Automatic Email Notifications

- OTP verification on registration
- Officer notified when complaint filed in their area
- Citizen notified when officer accepts complaint
- Citizen notified when complaint is marked resolved
- Officer receives reminder if complaint is pending 48+ hours

---

## Languages

- English (default)
- Urdu — complete translation including UI labels, navigation, forms, error messages, and status updates

---

## Built By

Chander Parkash — Full Stack Developer from Pakistan

Built independently with a belief that technology can fix what has been ignored for too long.

- GitHub: https://github.com/Chander-parkash007
- LinkedIn: https://linkedin.com/in/chander-parkash
- Email: sunosarkar2410@gmail.com

---

## License

This project is open source and available under the MIT License.

---

*Technology should never replace government. It should make government accountable.*
