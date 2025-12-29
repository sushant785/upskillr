#  UpSkillr – MERN Learning Management System (LMS)

UpSkillr is a full-stack Learning Management System built using the MERN stack.  
It enables instructors to create, manage, and publish courses, while learners can browse courses, enroll, track their progress, and provide feedback.

The platform is designed with role-based authentication, scalable architecture, and a modern user interface using React and Tailwind CSS.
## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Instructor / Learner)
- Protected routes on frontend and backend

### 👨‍🏫 Instructor Module
- Create, edit, and delete courses
- Publish and unpublish courses
- Add sections and lessons
- Manage course content
- View instructor dashboard and course analytics

### 👨‍🎓 Learner Module
- Browse published courses
- Enroll in courses
- View enrolled courses
- Track lesson-wise progress

### 📈 Progress Tracking
- Mark lessons as completed
- Automatic progress percentage calculation
- Course completion status

### ⭐ Feedback & Ratings
- Rate courses after completion
- Write course reviews
- Display average ratings


## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router
- Tailwind CSS
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js

### Tools
- Git & GitHub
- Postman
- MongoDB Atlas

## 📸 Screenshots

- Instructor Dashboard  
- Course Creation Page  
- Learner Course View  
- Progress Tracking UI  

### Login Page
![Login Page](screenshots/loginpage.png)


### Instructor Courses
![Instructor Dashboard](screenshots/instructorCourses.png)

### Course Creation
![Course Creation](screenshots/createCourse.png)

### Edit Course
![Edit Course](screenshots/editCourse.png)




## 📦 Installation

Clone the repository and install dependencies:

git clone https://github.com/sushant785/upskillr.git

cd upskillr

## ⚙️ Environment Variables

Create a `.env` file inside the backend directory and add:

PORT=5000  
MONGO_URI=your_mongodb_atlas_connection_string  
JWT_SECRET=your_jwt_secret


## 🏃 Run Locally

### Start Backend
cd backend  
npm install  
npm run dev  

Backend runs at:  
http://localhost:5000

### Start Frontend
cd frontend  
npm install  
npm run dev  

Frontend runs at:  
http://localhost:5174

## 🔗 API Reference


### Authentication

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login user and return JWT |

### Instructor – Courses

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/instructor/courses | Create a new course |
| GET | /api/instructor/my-courses | Get instructor’s courses |
| PUT | /api/instructor/courses/:id | Update course details |
| PATCH | /api/instructor/courses/:id/publish | Publish / Unpublish course |
| DELETE | /api/instructor/courses/:id | Delete course |
| GET | /api/instructor/courses/:id | Get course details |

### Instructor – Curriculum

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | /api/instructor/courses/:id/curriculum | Get course curriculum |
| POST | /api/instructor/courses/:courseId/sections | Create a new section |
| DELETE | /api/instructor/courses/:courseId/sections/:sectionId | Delete a section |

### Instructor – Dashboard

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | /api/instructor/dashboard | Get instructor dashboard data |
| GET | /api/instructor/courses/:courseId/enrollments | Get course enrollments |

### Learner – Courses

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | /api/learner/browse | Browse all published courses |
| POST | /api/learner/enroll | Enroll in a course |
| GET | /api/learner/my-courses | Get enrolled courses |
| GET | /api/learner/course/:courseId | Get course details |
| GET | /api/learner/course/:courseId/lessons | Get course lessons |

### Learner – Progress

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/learner/update-progress | Update lesson progress |
| GET | /api/learner/dashboard | Get learner dashboard |


### User Profile

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | /api/user/profile | Get user profile |
| PUT | /api/user/profile | Update user profile |


### Media & Video

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/media/video-upload-url | Generate video upload URL |
| POST | /api/media/update-upload | Update uploaded video |
| POST | /api/media/update-delete | Delete uploaded video |
| DELETE | /api/media/videos/:videoId | Delete video permanently |

## Deployment



- Frontend will be deployed on Vercel
- Backend will be deployed on Render
- Database hosted on MongoDB Atlas



## Documentation

Documentation will be available via Postman once published.


##  Support

If you encounter any issues or have suggestions, feel free to open an issue on GitHub.
