# 🍱 Food Waste Management System — MERN Stack

A full-stack web application to reduce food waste by connecting food donors with receivers using Google Maps.

---

## 📁 Project Structure

```
waste-food-management/
├── app.js                    # Express server entry point
├── package.json              # Backend dependencies
├── .env                      # Backend environment variables
├── controllers/
│   ├── authController.js     # Register, login, profile
│   ├── foodController.js     # CRUD for food listings
│   ├── donationController.js # Donation tracking
│   └── userController.js     # User profile update
├── models/
│   ├── User.js               # User schema
│   ├── Food.js               # Food listing schema
│   └── Donation.js           # Donation schema
├── routes/
│   ├── authRoutes.js
│   ├── foodRoutes.js
│   ├── donationRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── authMiddleware.js     # JWT protect & adminOnly
│   └── uploadMiddleware.js   # Multer image upload
├── utils/
│   └── sendEmail.js          # Nodemailer email utility
└── frontend/
    ├── package.json
    ├── .env                  # REACT_APP_GOOGLE_MAPS_KEY
    └── src/
        ├── App.js
        ├── index.js
        ├── context/AuthContext.js
        ├── utils/api.js
        ├── components/
        │   ├── Navbar.js
        │   ├── FoodCard.js
        │   ├── MapView.js
        │   └── PrivateRoute.js
        └── pages/
            ├── Home.js
            ├── Login.js
            ├── Register.js
            ├── FoodList.js
            ├── FoodDetail.js
            ├── PostFood.js
            ├── Dashboard.js
            └── Profile.js
```

---

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
# From the root folder
npm install
```

Create `.env` in root:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/wastefood
JWT_SECRET=wastefood_jwt_secret_key_2024
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

> If you don't have a Google Maps key yet, the app still works — the map section will show a placeholder message.

### 3. Run the App

**Terminal 1 (Backend):**
```bash
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 🗄️ MongoDB Setup (with Compass)

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Database `wastefood` will be auto-created on first run

---

## 🔑 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/profile | Yes | Get profile |
| GET | /api/food | No | List available food |
| POST | /api/food | Yes (donor) | Post food listing |
| GET | /api/food/:id | No | Get food detail |
| PUT | /api/food/:id/claim | Yes (receiver) | Claim food |
| DELETE | /api/food/:id | Yes | Delete listing |
| GET | /api/donations | Yes | My donations |
| PUT | /api/donations/:id/status | Yes | Update status |
| PUT | /api/user/profile | Yes | Update profile |

---

## 🌟 Features

- JWT authentication (donor / receiver / admin roles)
- Post food donations with image upload
- Browse food by category (grid view + map view)
- Google Maps integration for pickup locations
- Claim food and track donation history
- Email notifications on registration and claiming
- Responsive UI

---

## 📧 Email Setup (Optional)

The app uses Gmail SMTP. To enable emails:
1. Enable 2-Factor Authentication on your Gmail
2. Generate an **App Password** from Google Account settings
3. Put that password in `.env` as `EMAIL_PASS`
