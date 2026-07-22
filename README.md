# 🩸 BloodConnect

A full-stack blood donor–bank connection platform built with the MERN stack. BloodConnect bridges the gap between blood donors, recipients, and blood banks — enabling real-time donor discovery, inventory management, urgent broadcast alerts, and donation camp coordination.

**Live demo:** [blood-connect-one-nu.vercel.app](https://blood-connect-one-nu.vercel.app) *(update with your actual production URL)*

---

## 📖 Overview

Most blood donation platforms solve only half the problem — they help people find donors, but ignore the blood bank's side of things: inventory tracking, camp scheduling, and donor eligibility. BloodConnect treats both sides as first-class citizens.

**Two user roles:**
- **Donors** — register with blood group and location, search nearby banks/stock, create urgent requests, browse donation camps, track their own donation history.
- **Blood Banks** — manage live inventory per blood group, broadcast urgent shortage alerts to nearby eligible donors via email, organize donation camps, and log completed donations.

---

## ✨ Features

- 🔐 Role-based authentication (JWT + HTTP-only cookies) for donors and banks
- 🩸 Geolocation-based donor and blood bank search (MongoDB `2dsphere` geo queries)
- 📦 Live inventory management with low-stock visual indicators
- 📢 Urgent broadcast alerts — emails nearby eligible donors instantly via Resend
- 🏕️ Camp creation and discovery for organized donation drives
- 📜 Donation history tracking with automatic donor eligibility calculation (90-day cooldown)
- ✅ Manual blood bank verification flow to maintain trust
- 📱 Responsive, accessible UI with a custom design system

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS v4
- Zustand (state management)
- React Router
- Axios
- React Hot Toast
- Lucide React (icons)

**Backend**
- Node.js + Express
- MongoDB Atlas + Mongoose (geo-indexed queries)
- JWT authentication (HTTP-only cookies)
- bcryptjs (password hashing)
- Resend (transactional email)
- Cloudinary (image handling, if applicable)

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📂 Project Structure

```
blood-connect/
├── backend/
│   ├── src/
│   │   ├── models/          # User, BloodBank, Request, Camp, Donation
│   │   ├── controllers/     # Business logic per resource
│   │   ├── routes/          # Express route definitions
│   │   ├── middleware/      # Auth guards (protectRoute, requireBank)
│   │   ├── lib/             # db.js, resend.js
│   │   ├── emails/          # Email templates
│   │   └── index.js         # App entry point
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/      # Layout, BloodBadge, Spinner, etc.
    │   ├── pages/            # Login, Signup, DonorDashboard, BankDashboard
    │   ├── store/            # useAuthStore (Zustand)
    │   ├── lib/               # axios instance
    │   └── App.jsx
    └── .env
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (free tier works)
- A Resend account for email (free tier / sandbox sender works for dev)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/blood-connect.git
cd blood-connect
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## 🔑 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `MONGO_URI` | backend | MongoDB Atlas connection string |
| `JWT_SECRET` | backend | Secret used to sign JWTs |
| `RESEND_API_KEY` | backend | API key for sending emails via Resend |
| `EMAIL_FROM` | backend | Sender address (use Resend's sandbox sender for dev) |
| `CLIENT_URL` | backend | Deployed frontend URL, used for CORS |
| `NODE_ENV` | backend | `development` or `production` |
| `VITE_API_URL` | frontend | Deployed backend URL + `/api` |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup/donor` | Register a new donor |
| POST | `/api/auth/signup/bank` | Register a new blood bank |
| POST | `/api/auth/login` | Login (donor or bank) |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/check` | Check current session |

### Donors
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/search` | Search eligible donors by blood group + location |
| PUT | `/api/users/location` | Update donor's geolocation |
| PUT | `/api/users/donate` | Mark a donation completed (resets eligibility) |

### Blood Banks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/banks/search` | Search verified banks by blood group + location |
| PUT | `/api/banks/inventory` | Update stock for a blood group |
| GET | `/api/banks/inventory/me` | Get own inventory |
| PUT | `/api/banks/location` | Update bank's geolocation |
| PUT | `/api/banks/:id/verify` | Verify a bank (admin action) |
| POST | `/api/banks/broadcast` | Send urgent alert to nearby matching donors |

### Requests
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/requests` | Create a blood request (auto-matches nearby donors) |
| GET | `/api/requests` | List open requests |
| PUT | `/api/requests/:id/fulfill` | Mark a request fulfilled |

### Camps
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/camps` | Create a donation camp (bank only) |
| GET | `/api/camps` | List upcoming camps near a location |

### Donations
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/donations` | Log a completed donation (bank only) |
| GET | `/api/donations/me` | Get logged-in donor's donation history |

---

## 🧠 Design Decisions

- **Manual bank verification** — rather than building a full document-review pipeline (out of scope for this project), new bank accounts require a manual `verified` flag flip. This mirrors how many real platforms bootstrap trust before automating it.
- **Lazy eligibility checks** — donor eligibility (90-day post-donation cooldown) is recalculated on read rather than via a scheduled cron job, keeping the architecture simple for this scope.
- **Geospatial queries** — MongoDB's native `2dsphere` indexing and `$near` operator are used for all "nearby" features (donor search, bank search, camps, broadcast matching) instead of a third-party geocoding service.

---

## 🔮 Future Improvements

- Donor autocomplete/search when banks log a donation (currently requires manually entering a donor ID)
- Automated document-based bank verification
- Push notifications in addition to email for urgent broadcasts
- Analytics dashboard for banks (shortage trends, donation trends over time)
- Admin panel for verification and platform oversight

---

## 📄 License

This project was built as a final-year academic project. Feel free to fork and build on it.

---

## 🙋 Author

Built by Nirman as a final-year software engineering project.
