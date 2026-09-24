Student Academic, Personal and Career Profiling System

A web-based system for managing student personal details, academic performance, skills, interests, and career information.

Technologies Used
HTML, CSS, JavaScript
Node.js
Express.js
MongoDB
Mongoose
bcryptjs
dotenv
Main Features
Student registration and login
Mentor login
Student profile management
Semester-wise academic details
CGPA, attendance and arrears tracking
Skills and interests
Career goals and strengths
Mentor dashboard for viewing CSE students
Execution Steps
1. Install dependencies

Open the terminal in the project folder:

cd /home/workspace/my-project
npm install
2. Configure .env

Make sure .env contains:

MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
PORT=3000
3. Start the application
node src/app.js

You should see:

MongoDB connected
Server running on port 3000
4. Open the application

Open the provided ByteXL port-3000 URL in the browser.

5. Live Demonstration

Student flow:

Home
 ↓
Student Login
 ↓
Student Dashboard
 ↓
View Personal Information
 ↓
View Academic Performance
 ↓
View Skills & Interests
 ↓
View Career Information
 ↓
Edit Profile / Manage Academics

Mentor flow:

Home
 ↓
Mentor Login
 ↓
Mentor Dashboard
 ↓
View CSE Students
 ↓
Search / Filter Students
 ↓
View Student Profile
 ↓
Edit Student Profile
Demo Mentor Account
Email: mentor@example.com
Password: mentor123

The mentor account is created automatically when the application connects to MongoDB.