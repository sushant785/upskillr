🚀 UpSkillr – MERN Learning Management System (LMS)

UpSkillr is a full-stack MERN-based Learning Management System that enables instructors to create and manage courses, while learners can enroll, track progress, and provide feedback.

This project is built with a scalable architecture, role-based authentication, and modern UI using React + Tailwind CSS.

🛠️ Tech Stack
Frontend

React (Vite)

React Router

Tailwind CSS

Axios

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

bcrypt.js

Tools & Services

MongoDB Atlas (Cloud Database)

Git & GitHub

Postman (API testing)

✨ Features
🔐 Authentication & Authorization

User registration & login

JWT-based authentication

Role-based access control (Instructor / Learner)

Protected routes

👨‍🏫 Instructor Module

Create, edit, and delete courses

Publish / unpublish courses

Add lessons and learning resources

View course analytics

👨‍🎓 Learner Module

Browse published courses

Enroll in courses

View enrolled courses

Track lesson-wise progress

📈 Progress Tracking

Mark lessons as completed

Real-time progress calculation

Course completion status

⭐ Feedback & Ratings

Course rating after completion

Written reviews

Average rating calculation

📂 Project Structure
UpSkillr/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   ├── server.js
│   └── .env
│
└── README.md

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/upskillr.git
cd upskillr

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

3️⃣ Backend Setup
cd backend
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key


Run backend:

npm run dev


Backend runs at:

http://localhost:5000