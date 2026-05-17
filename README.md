# School Management API

REST API for School Management System built with Node.js, Express.js, and MySQL.

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Error Handling](#error-handling)

## 🎯 Overview

This application provides REST APIs for managing schools with features to:
- Add new schools with geographical coordinates
- List schools sorted by nearest distance from user location
- Calculate distance using Haversine Formula
- Comprehensive error handling and validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Dependencies**:
  - `mysql2`: MySQL client for Node.js
  - `cors`: Cross-Origin Resource Sharing
  - `dotenv`: Environment variables management
  - `express`: Web framework
- **Dev Tool**: Nodemon (for development)

## 📁 Project Structure

```
school-management-api/
├── config/
│   └── db.js                      # Database connection configuration
├── controllers/
│   └── schoolController.js        # Business logic for school operations
├── routes/
│   └── schoolRoutes.js            # API route definitions
├── middleware/
│   └── errorHandler.js            # Error handling & validation middleware
├── utils/
│   └── distance.js                # Haversine formula for distance calculation
├── app.js                         # Main application file
├── package.json                   # Project dependencies & scripts
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore configuration
└── README.md                      # This file
```

## 🚀 Installation

### Prerequisites
- Node.js
- MySQL Server running
- MySQL database
- MySQL table `schools`

### Step 1: Clone/Extract Project
```bash
cd school-management-api
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_db
```

## ⚙️ Environment Setup

### Database Prerequisites
Ensure you have MySQL running and the database/table created:

```sql
SHOW DATABASES;
USE school_db;
SHOW TABLES;

DESCRIBE schools;
```

Expected table structure:
```sql
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);
```

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```
Uses Nodemon for automatic restart on file changes.

### Production Mode
```bash
npm start
```

Expected output:
```
MySQL Connected
Server running on http://localhost:5000
```

## 📚 API Documentation

### 1. Root Endpoint

**GET** `/`

Returns API information and available endpoints.

**Response:**
```json
{
  "message": "School Management API Running",
  "version": "1.0.0",
  "endpoints": {
    "addSchool": "POST /addSchool",
    "listSchools": "GET /listSchools?latitude=X&longitude=Y"
  }
}
```

### 2. Add School

**POST** `/addSchool`

Adds a new school to the database.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "ABC School",
  "address": "Pune, Maharashtra",
  "latitude": 18.5204,
  "longitude": 73.8567
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "School added successfully",
  "id": 1
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "School name is required"
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `address`: Required, non-empty string
- `latitude`: Required, number between -90 and 90
- `longitude`: Required, number between -180 and 180

### 3. List Schools (Sorted by Distance)

**GET** `/listSchools?latitude=18.5204&longitude=73.8567`

Returns all schools sorted by nearest distance from user location.

**Query Parameters:**
- `latitude` (required): User's latitude (-90 to 90)
- `longitude` (required): User's longitude (-180 to 180)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "ABC School",
    "address": "Pune",
    "latitude": 18.5204,
    "longitude": 73.8567,
    "distance": "0.00 km"
  },
  {
    "id": 2,
    "name": "XYZ School",
    "address": "Mumbai",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "distance": "125.45 km"
  }
]
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Latitude must be a valid number between -90 and 90"
}
```

## 🔄 Distance Calculation

The application uses the **Haversine Formula** to calculate accurate geographical distance between coordinates:

Formula:
```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
distance = R × c
```

Where:
- φ is latitude, λ is longitude, R is earth's radius (6,371 km)
- Distance is returned in kilometers with 2 decimal places

## 🛡️ Error Handling

The application implements centralized error handling:

### Error Types

| Error | Status | Description |
|-------|--------|-------------|
| Validation Error | 400 | Invalid input data |
| Not Found | 404 | Route/resource not found |
| Database Error | 500 | Database operation failed |
| Server Error | 500 | Internal server error |

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## 📤 Example Requests

### cURL - Add School
```bash
curl -X POST http://localhost:5000/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC School",
    "address": "Pune",
    "latitude": 18.5204,
    "longitude": 73.8567
  }'
```

### cURL - List Schools
```bash
curl -X GET "http://localhost:5000/listSchools?latitude=18.5204&longitude=73.8567"
```

### JavaScript Fetch - Add School
```javascript
fetch('http://localhost:5000/addSchool', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'ABC School',
    address: 'Pune',
    latitude: 18.5204,
    longitude: 73.8567
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### JavaScript Fetch - List Schools
```javascript
const userLat = 18.5204;
const userLon = 73.8567;

fetch(`http://localhost:5000/listSchools?latitude=${userLat}&longitude=${userLon}`)
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🚀 Deployment

### Render Deployment

1. Push code to GitHub
2. Connect repository to Render
3. Configure environment variables in Render dashboard:
   - `PORT=5000`
   - `DB_HOST=your_db_host`
   - `DB_USER=your_db_user`
   - `DB_PASSWORD=your_db_password`
   - `DB_NAME=school_db`
4. Set build command: `npm install`
5. Set start command: `npm start`

### Railway Deployment

1. Connect GitHub repository
2. Railway automatically detects Node.js project
3. Add environment variables
4. Deploy

### Local Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t school-api .
docker run -p 5000:5000 --env-file .env school-api
```

## Support

For issues or questions:
1. Check `.env` file configuration
2. Verify MySQL is running and database exists
3. Check logs for error messages
4. Verify Node.js version