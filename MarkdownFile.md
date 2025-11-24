# Student Information System - API Documentation

**Version:** 2.0

**Status:** Live on AWS

**Base URL:** http://Student-system-env.eba-24yuymwa.us-west-2.elasticbeanstalk.com/api/v1

## Authentication (Read First)

The system uses **JWT (JSON Web Tokens)** for security.

1.  **Login:** Send email/password to /auth/login. You will receive a token.
2.  **Storage:** Save this token locally (localStorage for Web, SharedPreferences for Android).
3.  **Authorization:** For **ALL** other requests, you must send this token in the header:  
    Authorization: Bearer <your\_token\_string>  
    

## 📡 API Endpoints Master List

### 1\. Authentication (Public)

| Action | Method | Endpoint | Body (JSON) | Response |
| --- | --- | --- | --- | --- |
| Register | POST | /auth/register | {"name": "...", "email": "...", "password": "...", "role": "student"} | User Object |
| Login | POST | /auth/login | {"email": "...", "password": "..."} | { "token": "...", "user": {...} } |

### 2\. User Profiles

| Action | Role | Method | Endpoint | Description |
| --- | --- | --- | --- | --- |
| Get My Profile | Any | GET | /users/me | Returns logged-in user's profile. |
| Update Profile | Any | POST | /users/me/profile | {"bio": "...", "enrollmentYear": 2025} |
| Get All Users | Admin | GET | /users/all | Lists all users (no passwords). |

### 3\. Courses

| Action | Role | Method | Endpoint | Description |
| --- | --- | --- | --- | --- |
| View All | Any | GET | /courses | Returns list of all available courses. |
| Create | Admin | POST | /courses | {"name": "...", "startDate": "...", ...} |
| Delete | Admin | DELETE | /courses/{id} | Deletes a specific course. |

### 4\. Enrollments

| Action | Role | Method | Endpoint | Description |
| --- | --- | --- | --- | --- |
| Request | Student | POST | /enrollments/request | Body: {"courseId": "uuid..."} |
| My Status | Student | GET | /enrollments/my-requests | View my courses and status (Pending/Approved). |
| View Pending | Admin | GET | /enrollments/pending | View all requests waiting for approval. |
| Approve | Admin | POST | /enrollments/approve | Body: {"enrollmentId": "uuid..."} |
| Reject | Admin | POST | /enrollments/reject | Body: {"enrollmentId": "uuid..."} |

## 📦 Response Format (Important!)

Except for Login/Register, **ALL** responses are wrapped in a data object.

**Example Response:**

{  
"data": \[  
{  
"id": "123",  
"name": "Java Course",  
...  
}  
\]  
}  

_Make sure your frontend code unwraps this data field!_

## 💻 Integration Guide: React Portal

**1\. Install Axios:** npm install axios

**2\. Create api.js (The Central Handler):**

import axios from 'axios';  
  
const BASE\_URL = '\[http://Student-system-env.eba-24yuymwa.us-west-2.elasticbeanstalk.com/api/v1\](http://Student-system-env.eba-24yuymwa.us-west-2.elasticbeanstalk.com/api/v1)';  
  
// Create Axios instance  
const api = axios.create({  
baseURL: BASE\_URL,  
headers: { 'Content-Type': 'application/json' }  
});  
  
// Automatically add Token to every request  
api.interceptors.request.use((config) => {  
const token = localStorage.getItem('auth\_token');  
if (token) {  
config.headers.Authorization = \`Bearer ${token}\`;  
}  
return config;  
});  
  
export const login = async (creds) => {  
const res = await api.post('/auth/login', creds);  
// Login returns raw object, not wrapped in data  
localStorage.setItem('auth\_token', res.data.token);  
return res.data;  
};  
  
export const getCourses = async () => {  
const res = await api.get('/courses');  
// Other endpoints ARE wrapped in data  
return res.data.data;  
};  
  
export const requestEnrollment = async (courseId) => {  
return await api.post('/enrollments/request', { courseId });  
};  
  
export default api;  

## ⚠️ Troubleshooting

| Error Code | Meaning | Fix |
| --- | --- | --- |
| 403 Forbidden | You are logged in, but don't have permission. | Are you a Student trying to do Admin work? Check your role. |
| 401 Unauthorized | Token is missing or invalid. | Log out and Log in again to get a fresh token. |
| 500 Server Error | Something crashed on the backend. | Check if you are sending the correct JSON fields (e.g., courseId vs id). |