# 🚀 AI Course Studio Backend

Backend API for **AI Course Studio**, built with **Node.js**, **Express.js**, and **MongoDB**.
This backend provides secure user authentication, email verification, and password reset functionality.

---

# 📌 Features

### 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* Password Hashing with bcrypt
* Protected Routes using middleware

### 📧 Email System

* Email Verification after signup
* Forgot Password email
* Password Reset functionality
* Emails sent using Nodemailer

### 🗄 Database

* MongoDB database
* Mongoose schema models
* Secure user data storage

### 🔒 Security

* Password encryption
* JWT token authentication
* Environment variable protection
* Secure API endpoints

---

# 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* bcryptjs
* Nodemailer
* dotenv
* cors

---

# 📂 Project Structure

```
ai-course-backend
│
├── config
│   └── db.js
│
├── controllers
│   └── authController.js
│
├── middleware
│   └── authMiddleware.js
│
├── models
│   └── User.js
│
├── routes
│   └── authRoutes.js
│
├── utils
│   ├── generateToken.js
│   └── sendEmail.js
│
├── .env
├── server.js
└── README.md
```

---

# ⚙️ Installation

Clone the repository:

```
git clone https://github.com/yourusername/ai-course-backend.git
```

Move into the project folder:

```
cd ai-course-backend
```

Install dependencies:

```
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory.

Example:

```
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/aicourse

JWT_SECRET=your_jwt_secret

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password

CLIENT_URL=http://localhost:3000
```

---

# ▶️ Running the Server

Start development server:

```
npm run dev
```

Start production server:

```
npm start
```

Server will run at:

```
http://localhost:5000
```

---

# 📡 API Endpoints

### Register User

```
POST /api/auth/register
```

### Login User

```
POST /api/auth/login
```

### Verify Email

```
GET /api/auth/verify/:token
```

### Forgot Password

```
POST /api/auth/forgot-password
```

### Reset Password

```
POST /api/auth/reset-password/:token
```

---

# 🔐 Authentication

Protected routes require a **JWT token** in the request header.

Example:

```
Authorization: Bearer <token>
```

---

# 💡 Future Improvements

Planned features for future development:

* Role-based authentication (Admin / Instructor / Student)
* Course management APIs
* Video upload system
* Payment integration
* Rate limiting for API security
* OAuth login (Google / GitHub)

---

# 🧑‍💻 Author

Developed by **Vivek**

---

# 📄 License

This project is licensed under the **MIT License**.

