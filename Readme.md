# 🏠 Real Estate Platform - Backend API

A comprehensive real estate platform backend built with Node.js, Express, and MongoDB. Similar to 99acres, this platform allows users to list properties, search for properties, and connect with property owners directly.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Testing APIs](#testing-apis)
- [Security Features](#security-features)

---

## ✨ Features

### User Features
- ✅ User registration and authentication
- ✅ Create, update, and delete property listings
- ✅ Search and filter properties by multiple criteria
- ✅ Save/bookmark favorite properties
- ✅ Contact property owners directly (99acres style)
- ✅ View own property listings
- ✅ Update personal profile

### Property Features
- ✅ **Auto-active listings** (No admin approval required)
- ✅ Advanced search with filters (city, price, type, bedrooms, etc.)
- ✅ Pagination support
- ✅ View counter
- ✅ Soft delete (properties can be deactivated)
- ✅ Property images support

### Admin Features
- ✅ View all properties (including flagged)
- ✅ Flag/unflag inappropriate properties
- ✅ User management (block/unblock users)
- ✅ View all user contacts

### Contact System (99acres Style)
- ✅ Direct contact logging
- ✅ Owner details visible immediately
- ✅ Simple tracking system
- ✅ No complex status management

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Mongoose validators

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd real-estate-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
touch .env
```

4. **Start the server**
```bash
npm start
```

Server will run on `http://localhost:5000`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/real-estate
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` in production!

---

## 📊 Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  password: String (required, hashed),
  role: String (enum: ["admin", "user"], default: "user"),
  avatar: String,
  isBlocked: Boolean (default: false),
  savedProperties: [ObjectId] (ref: Property),
  lastLogin: Date,
  timestamps: true
}
```

### Property Model
```javascript
{
  title: String (required),
  description: String,
  purpose: String (enum: ["sell", "rent"], required),
  propertyType: String (enum: ["flat", "house", "plot", "shop", "office"], required),
  price: Number (required),
  area: {
    size: Number,
    unit: String (default: "sqft")
  },
  bedrooms: Number,
  bathrooms: Number,
  furnishing: String (enum: ["furnished", "semi-furnished", "unfurnished"]),
  address: {
    city: String,
    state: String,
    locality: String,
    pincode: String
  },
  images: [String],
  owner: ObjectId (ref: User, required),
  views: Number (default: 0),
  isActive: Boolean (default: true),
  isFlagged: Boolean (default: false),
  flagReason: String,
  timestamps: true
}
```

### Contact Model
```javascript
{
  property: ObjectId (ref: Property, required),
  buyer: ObjectId (ref: User, required),
  owner: ObjectId (ref: User, required),
  message: String,
  timestamps: true
}
```

---

## 🚀 API Endpoints

### Base URL
```
http://localhost:5000/api
```

---

## 1️⃣ Authentication APIs

### 1.1 Register User
**POST** `/api/auth/register`

**Auth Required**: No

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Registration successful"
}
```

**Error Response** (409):
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 1.2 Login User
**POST** `/api/auth/login`

**Auth Required**: No

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:
- 401: Invalid credentials
- 403: User account is blocked

---

### 1.3 Get Profile
**GET** `/api/auth/profile`

**Auth Required**: Yes

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile fetched",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user",
    "savedProperties": [...],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 1.4 Update Profile
**PUT** `/api/auth/profile`

**Auth Required**: Yes

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "John Updated",
  "phone": "9999999999",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile updated",
  "data": { /* updated user object */ }
}
```

---

## 2️⃣ Property APIs

### 2.1 Create Property (Auto-Active)
**POST** `/api/properties`

**Auth Required**: Yes

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "title": "Spacious 3BHK Apartment",
  "description": "Beautiful apartment with modern amenities",
  "purpose": "sell",
  "propertyType": "flat",
  "price": 5000000,
  "area": {
    "size": 1500,
    "unit": "sqft"
  },
  "bedrooms": 3,
  "bathrooms": 2,
  "furnishing": "semi-furnished",
  "address": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "locality": "Andheri West",
    "pincode": "400053"
  },
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Property posted successfully",
  "data": {
    "_id": "...",
    "title": "Spacious 3BHK Apartment",
    "isActive": true,
    "owner": "...",
    /* all property fields */
  }
}
```

**Note**: Property is automatically active - no admin approval needed!

---

### 2.2 Get All Properties (Public + Filters)
**GET** `/api/properties`

**Auth Required**: No

**Query Parameters**:
- `search` - Search in title, description, locality
- `city` - Filter by city
- `purpose` - Filter by purpose (sell/rent)
- `propertyType` - Filter by type (flat/house/plot/shop/office)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `bedrooms` - Number of bedrooms
- `furnishing` - Furnishing type
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort field (default: -createdAt)

**Example Request**:
```
GET /api/properties?city=Mumbai&purpose=sell&minPrice=3000000&maxPrice=8000000&bedrooms=3&page=1&limit=10
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Properties fetched successfully",
  "data": {
    "properties": [
      {
        "_id": "...",
        "title": "Spacious 3BHK Apartment",
        "price": 5000000,
        "address": { /* address object */ },
        "owner": {
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "9876543210"
        },
        /* other fields */
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "pages": 5,
      "limit": 10
    }
  }
}
```

---

### 2.3 Get Single Property (Owner Details Visible)
**GET** `/api/properties/:id`

**Auth Required**: No

**Example Request**:
```
GET /api/properties/507f1f77bcf86cd799439011
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Property fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Spacious 3BHK Apartment",
    "description": "Beautiful apartment...",
    "price": 5000000,
    "views": 125,
    "owner": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    /* all property details */
  }
}
```

**Note**: Owner details are directly visible (99acres style)

---

### 2.4 Get My Properties
**GET** `/api/properties/my/properties`

**Auth Required**: Yes

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Your properties fetched successfully",
  "data": [
    { /* property 1 */ },
    { /* property 2 */ }
  ]
}
```

---

### 2.5 Update Property
**PUT** `/api/properties/:id`

**Auth Required**: Yes (Owner only)

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "price": 5500000,
  "description": "Updated description",
  "furnishing": "furnished"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": { /* updated property */ }
}
```

**Error Response** (403):
```json
{
  "success": false,
  "message": "You can update only your own property"
}
```

---

### 2.6 Delete Property (Soft Delete)
**DELETE** `/api/properties/:id`

**Auth Required**: Yes (Owner only)

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

**Note**: This is a soft delete - property.isActive becomes false

---

### 2.7 Save/Unsave Property (Wishlist)
**POST** `/api/properties/:id/save`

**Auth Required**: Yes

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Property saved successfully"
}
```
or
```json
{
  "success": true,
  "message": "Property removed from saved"
}
```

---

### 2.8 Get Saved Properties
**GET** `/api/properties/my/saved`

**Auth Required**: Yes

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Saved properties fetched",
  "data": [
    { /* saved property 1 with owner details */ },
    { /* saved property 2 with owner details */ }
  ]
}
```

---

### 2.9 Get All Properties (Admin)
**GET** `/api/properties/admin/all`

**Auth Required**: Yes (Admin only)

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "All properties fetched successfully",
  "data": [
    { /* property 1 - including flagged */ },
    { /* property 2 */ }
  ]
}
```

---

### 2.10 Flag/Unflag Property (Admin)
**PATCH** `/api/properties/:id/flag`

**Auth Required**: Yes (Admin only)

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "reason": "Inappropriate content/images"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Property flagged successfully",
  "data": {
    /* property with isFlagged: true */
  }
}
```

**Note**: To unflag, send another request without reason

---

## 3️⃣ Contact APIs (99acres Style)

### 3.1 Create Contact (Get Owner Details)
**POST** `/api/contacts`

**Auth Required**: Yes

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "propertyId": "507f1f77bcf86cd799439011",
  "message": "I'm interested in this property. Please share more details."
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Contact request sent. Here are owner details:",
  "data": {
    "contact": {
      "_id": "...",
      "property": "507f1f77bcf86cd799439011",
      "buyer": "...",
      "owner": "...",
      "message": "I'm interested...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "ownerDetails": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    }
  }
}
```

**Note**: Owner details are returned immediately (99acres style)

---

### 3.2 Get My Contacts
**GET** `/api/contacts`

**Auth Required**: Yes

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Contacts fetched successfully",
  "data": [
    {
      "_id": "...",
      "property": {
        "title": "Spacious 3BHK",
        "price": 5000000,
        "address": { /* address */ },
        "images": [...]
      },
      "buyer": {
        "name": "Buyer Name",
        "email": "buyer@example.com",
        "phone": "9999999999"
      },
      "owner": {
        "name": "Owner Name",
        "email": "owner@example.com",
        "phone": "9876543210"
      },
      "message": "I'm interested...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Note**: 
- If you're a **buyer**, you'll see contacts you sent
- If you're an **owner**, you'll see contacts received
- If you're **admin**, you'll see all contacts

---

### 3.3 Get Single Contact
**GET** `/api/contacts/:id`

**Auth Required**: Yes (Buyer, Owner, or Admin)

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Contact fetched successfully",
  "data": {
    "_id": "...",
    "property": { /* full property details */ },
    "buyer": { /* buyer details */ },
    "owner": { /* owner details */ },
    "message": "I'm interested...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3.4 Delete Contact
**DELETE** `/api/contacts/:id`

**Auth Required**: Yes (Buyer or Admin)

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

---

## 4️⃣ User Management APIs (Admin Only)

### 4.1 Get All Users
**GET** `/api/users`

**Auth Required**: Yes (Admin only)

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "user",
      "isBlocked": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4.2 Get Single User
**GET** `/api/users/:id`

**Auth Required**: Yes (Admin only)

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": { /* user details */ }
}
```

---

### 4.3 Update User
**PUT** `/api/users/:id`

**Auth Required**: Yes (Admin only)

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "Updated Name",
  "phone": "9999999999",
  "role": "admin"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { /* updated user */ }
}
```

---

### 4.4 Delete User
**DELETE** `/api/users/:id`

**Auth Required**: Yes (Admin only)

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 4.5 Block/Unblock User
**PATCH** `/api/users/:id/block`

**Auth Required**: Yes (Admin only)

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "User blocked successfully",
  "data": {
    /* user with isBlocked: true */
  }
}
```

or

```json
{
  "success": true,
  "message": "User unblocked successfully",
  "data": {
    /* user with isBlocked: false */
  }
}
```

---

## 🔑 Authentication

All protected routes require JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### How to Get Token:
1. Register a new user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Copy the token from response
4. Add to headers in subsequent requests

---

## 🧪 Testing APIs

### Using Postman

#### 1. Set up Environment Variables
Create a new environment in Postman with:
- `baseURL`: `http://localhost:5000/api`
- `token`: (will be set after login)

#### 2. Test Flow

**Step 1: Register User**
```
POST {{baseURL}}/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "password": "test123"
}
```

**Step 2: Login**
```
POST {{baseURL}}/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "test123"
}

// Copy the token from response
// Set it in environment: token = <received_token>
```

**Step 3: Create Property**
```
POST {{baseURL}}/properties
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "Test Property",
  "purpose": "sell",
  "propertyType": "flat",
  "price": 3000000,
  "address": {
    "city": "Mumbai",
    "state": "Maharashtra"
  }
}
```

**Step 4: Search Properties**
```
GET {{baseURL}}/properties?city=Mumbai&purpose=sell&minPrice=2000000
```

**Step 5: Contact Owner**
```
POST {{baseURL}}/contacts
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "propertyId": "<property_id_from_step_3>",
  "message": "Interested in this property"
}
```

---

### Using cURL

**Register**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "test123"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Create Property**:
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Property",
    "purpose": "sell",
    "propertyType": "flat",
    "price": 3000000,
    "address": {
      "city": "Mumbai",
      "state": "Maharashtra"
    }
  }'
```

**Search Properties**:
```bash
curl -X GET "http://localhost:5000/api/properties?city=Mumbai&purpose=sell"
```

---

## 🔒 Security Features

### Implemented Security Measures:

1. **Password Hashing**: bcryptjs (10 salt rounds)
2. **JWT Authentication**: 7-day expiry
3. **Role-Based Access Control**: Admin vs User
4. **Owner Validation**: Users can only modify their own properties
5. **Blocked User Check**: Blocked users cannot login
6. **Soft Delete**: Properties are deactivated, not deleted
7. **Input Validation**: Mongoose validators
8. **Protected Routes**: Middleware authentication
9. **Authorization**: Role-based endpoint access

### Best Practices:
- Always use HTTPS in production
- Change JWT_SECRET in production
- Implement rate limiting (use express-rate-limit)
- Add request validation (use express-validator)
- Implement CORS properly
- Add helmet.js for security headers
- Use environment variables for sensitive data
- Implement file upload size limits
- Add input sanitization

---

## 📝 Additional Notes

### Property Auto-Active Feature
- Properties are **automatically active** upon creation
- No admin approval required (unlike some platforms)
- Admin can flag inappropriate content later
- Flagged properties won't show in public listings

### Contact System (99acres Style)
- When a user contacts a property, owner details are **immediately visible**
- No complex status management
- Simple logging system for tracking
- Both buyer and owner can see contact history

### Soft Delete
- Properties use `isActive: false` instead of deletion
- Allows data recovery
- Owner can reactivate properties

### Performance Optimizations
- Database indexes on frequently queried fields
- Pagination support
- Lean queries where possible
- Population only when needed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Support

For issues and questions, please create an issue in the repository.

---

**Made with ❤️ for Real Estate Platform**