# Zoura Backend API Documentation

Complete reference for all API endpoints in the Zoura platform.

**Base URL:** `http://localhost:8080`

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
   - [User Auth](#user-authentication)
   - [Vendor Auth](#vendor-authentication)
   - [Admin Auth](#admin-authentication)
2. [Product APIs](#product-apis)
3. [Shopping Cart APIs](#shopping-cart-apis)
4. [Admin Management APIs](#admin-management-apis)

---

## Authentication APIs

### User Authentication

#### Register User (Mobile App)
**Endpoint:** `POST /auth/register`  
**Access:** Public  
**Description:** Register a new mobile app user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "nic": "123456789V"  // Optional
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "nic": "123456789V",
    "subscription_tier": "FREE",
    "created_at": "2026-01-14T10:00:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

---

#### Login User (Mobile App)
**Endpoint:** `POST /auth/login`  
**Access:** Public  
**Description:** Login as a mobile app user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

#### Get User Profile
**Endpoint:** `GET /auth/profile`  
**Access:** Protected (Requires JWT)  
**Description:** Get current user profile

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "USER"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Vendor Authentication

#### Register Vendor
**Endpoint:** `POST /vendor-auth/register`  
**Access:** Public  
**Description:** Register a new vendor (shop owner)

**Request Body:**
```json
{
  "email": "vendor@shop.com",
  "password": "VendorPass123!",
  "name": "Jane Smith",
  "shop_name": "Jane's Electronics",
  "bank_details": "Bank Account: 1234567890"  // Optional
}
```

**Response (201):**
```json
{
  "message": "Vendor registered successfully. Pending approval.",
  "vendor": {
    "id": "uuid",
    "email": "vendor@shop.com",
    "name": "Jane Smith",
    "shop_name": "Jane's Electronics",
    "approval_status": "PENDING",
    "created_at": "2026-01-14T10:00:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/vendor-auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@shop.com",
    "password": "VendorPass123!",
    "name": "Jane Smith",
    "shop_name": "Janes Electronics"
  }'
```

---

#### Login Vendor
**Endpoint:** `POST /vendor-auth/login`  
**Access:** Public  
**Description:** Login as a vendor

**Request Body:**
```json
{
  "email": "vendor@shop.com",
  "password": "VendorPass123!"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/vendor-auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@shop.com",
    "password": "VendorPass123!"
  }'
```

---

#### Get Vendor Profile
**Endpoint:** `GET /vendor-auth/profile`  
**Access:** Protected (Requires Vendor JWT)  
**Description:** Get current vendor profile

**Headers:**
```
Authorization: Bearer {vendor_access_token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "vendor@shop.com",
  "role": "VENDOR"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/vendor-auth/profile \
  -H "Authorization: Bearer YOUR_VENDOR_TOKEN"
```

---

### Admin Authentication

#### Login Admin
**Endpoint:** `POST /auth/admin/login`  
**Access:** Public  
**Description:** Login as an admin (credentials from .env)

**Request Body:**
```json
{
  "email": "admin@zoura.com",
  "password": "ZouraAdmin@2026"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@zoura.com",
    "password": "ZouraAdmin@2026"
  }'
```

---

## Product APIs

### Get All Products (Public)
**Endpoint:** `GET /products`  
**Access:** Public  
**Description:** Get all APPROVED products (for mobile app customers)

**Query Parameters:**
- `limit` (optional, default: 20) - Number of products per page
- `offset` (optional, default: 0) - Pagination offset
- `category` (optional) - Filter by category
- `search` (optional) - Search by product name (partial match)

**Response (200):**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Samsung Galaxy S24",
      "price": 999.99,
      "stock": 50,
      "images": ["url1", "url2"],
      "category": "Electronics",
      "is_zoura_mall": false,
      "approval_status": "APPROVED",
      "vendor": {
        "id": "uuid",
        "shop_name": "Jane's Electronics",
        "email": "vendor@shop.com"
      },
      "created_at": "2026-01-14T10:00:00Z",
      "updated_at": "2026-01-14T10:00:00Z"
    }
  ],
  "total": 45
}
```

**cURL Examples:**
```bash
# Get first 20 products
curl http://localhost:8080/products

# Get with pagination
curl "http://localhost:8080/products?limit=10&offset=20"

# Filter by category
curl "http://localhost:8080/products?category=Electronics"

# Search by name
curl "http://localhost:8080/products?search=samsung"

# Combined
curl "http://localhost:8080/products?limit=10&category=Electronics&search=galaxy"
```

---

### Get Single Product
**Endpoint:** `GET /products/:id`  
**Access:** Public  
**Description:** Get a specific product by ID

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Samsung Galaxy S24",
  "price": 999.99,
  "stock": 50,
  "images": ["url1", "url2"],
  "vendor": { ... },
  "created_at": "2026-01-14T10:00:00Z"
}
```

**cURL Example:**
```bash
curl http://localhost:8080/products/PRODUCT_UUID
```

---

### Create Product
**Endpoint:** `POST /products`  
**Access:** Protected (Vendor only)  
**Description:** Create a new product (submitted for approval)

**Headers:**
```
Authorization: Bearer {vendor_access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "price": 1299.99,
  "stock": 30,
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
}
```

**Response (201):**
```json
{
  "message": "Product created successfully and submitted for approval",
  "product": {
    "id": "uuid",
    "name": "iPhone 15 Pro",
    "price": 1299.99,
    "stock": 30,
    "approval_status": "PENDING",
    "created_at": "2026-01-14T10:00:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/products \
  -H "Authorization: Bearer YOUR_VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "price": 1299.99,
    "stock": 30,
    "images": ["https://example.com/image1.jpg"]
  }'
```

---

### Get My Products
**Endpoint:** `GET /products/my-products`  
**Access:** Protected (Vendor only)  
**Description:** Get all products created by the authenticated vendor

**Headers:**
```
Authorization: Bearer {vendor_access_token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Product 1",
    "price": 99.99,
    "approval_status": "APPROVED",
    ...
  },
  {
    "id": "uuid",
    "name": "Product 2",
    "price": 149.99,
    "approval_status": "PENDING",
    ...
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/products/my-products \
  -H "Authorization: Bearer YOUR_VENDOR_TOKEN"
```

---

## Shopping Cart APIs

### Add Item to Cart
**Endpoint:** `POST /cart`  
**Access:** Protected (User only)  
**Description:** Add a product to user's cart or update quantity if already exists

**Headers:**
```
Authorization: Bearer {user_access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 2
}
```

**Response (201):**
```json
{
  "message": "Item added to cart successfully",
  "cart": {
    "id": "uuid",
    "total_price": 299.98,
    "items": [
      {
        "id": "uuid",
        "quantity": 2,
        "price_at_add": 149.99,
        "product": {
          "id": "uuid",
          "name": "Samsung Galaxy S24",
          "price": 149.99,
          "stock": 48,
          "vendor": {
            "shop_name": "Jane's Electronics"
          }
        }
      }
    ],
    "created_at": "2026-01-14T10:00:00Z",
    "updated_at": "2026-01-14T10:05:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/cart \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_UUID",
    "quantity": 2
  }'
```

---

### Get User Cart
**Endpoint:** `GET /cart`  
**Access:** Protected (User only)  
**Description:** Get current user's cart with all items and total price

**Headers:**
```
Authorization: Bearer {user_access_token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "total_price": 449.97,
  "items": [
    {
      "id": "uuid",
      "quantity": 2,
      "price_at_add": 149.99,
      "product": {
        "id": "uuid",
        "name": "Samsung Galaxy S24",
        "price": 149.99,
        "stock": 48,
        "images": ["url1", "url2"],
        "vendor": {
          "id": "uuid",
          "shop_name": "Jane's Electronics"
        }
      }
    },
    {
      "id": "uuid",
      "quantity": 1,
      "price_at_add": 149.99,
      "product": {
        "id": "uuid",
        "name": "iPhone 15 Pro",
        "price": 149.99,
        "stock": 29
      }
    }
  ],
  "created_at": "2026-01-14T10:00:00Z",
  "updated_at": "2026-01-14T10:10:00Z"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/cart \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

---

### Update Cart Item Quantity
**Endpoint:** `PATCH /cart/:itemId`  
**Access:** Protected (User only)  
**Description:** Update the quantity of a specific cart item

**Headers:**
```
Authorization: Bearer {user_access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response (200):**
```json
{
  "message": "Cart item updated successfully",
  "cart": {
    "id": "uuid",
    "total_price": 749.95,
    "items": [...],
    "updated_at": "2026-01-14T10:15:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:8080/cart/CART_ITEM_UUID \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'
```

---

### Remove Item from Cart
**Endpoint:** `DELETE /cart/:itemId`  
**Access:** Protected (User only)  
**Description:** Remove a specific item from the cart

**Headers:**
```
Authorization: Bearer {user_access_token}
```

**Response (200):**
```json
{
  "message": "Item removed from cart",
  "cart": {
    "id": "uuid",
    "total_price": 149.99,
    "items": [...],
    "updated_at": "2026-01-14T10:20:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8080/cart/CART_ITEM_UUID \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

---

### Clear Cart
**Endpoint:** `DELETE /cart`  
**Access:** Protected (User only)  
**Description:** Remove all items from the cart

**Headers:**
```
Authorization: Bearer {user_access_token}
```

**Response (200):**
```json
{
  "message": "Cart cleared successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8080/cart \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

---

## Admin Management APIs

### Get Pending Vendors
**Endpoint:** `GET /admin/approvals/vendors`  
**Access:** Protected (Admin only)  
**Description:** Get all vendors pending approval

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "email": "vendor@shop.com",
    "name": "Jane Smith",
    "shop_name": "Jane's Electronics",
    "approval_status": "PENDING",
    "created_at": "2026-01-14T10:00:00Z"
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/admin/approvals/vendors \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### Get Pending Products
**Endpoint:** `GET /admin/approvals/products`  
**Access:** Protected (Admin only)  
**Description:** Get all products pending approval

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "iPhone 15 Pro",
    "price": 1299.99,
    "approval_status": "PENDING",
    "vendor": {
      "id": "uuid",
      "shop_name": "Jane's Electronics"
    },
    "created_at": "2026-01-14T10:00:00Z"
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/admin/approvals/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### Approve Vendor
**Endpoint:** `PATCH /admin/vendors/:id/approve`  
**Access:** Protected (Admin only)  
**Description:** Approve a pending vendor

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200):**
```json
{
  "message": "Vendor approved successfully",
  "vendor": {
    "id": "uuid",
    "email": "vendor@shop.com",
    "approval_status": "APPROVED",
    ...
  }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:8080/admin/vendors/VENDOR_UUID/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### Approve Product
**Endpoint:** `PATCH /admin/products/:id/approve`  
**Access:** Protected (Admin only)  
**Description:** Approve a pending product

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200):**
```json
{
  "message": "Product approved successfully",
  "product": {
    "id": "uuid",
    "name": "iPhone 15 Pro",
    "approval_status": "APPROVED",
    ...
  }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:8080/admin/products/PRODUCT_UUID/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### Reject Product
**Endpoint:** `PATCH /admin/products/:id/reject`  
**Access:** Protected (Admin only)  
**Description:** Reject a pending product

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200):**
```json
{
  "message": "Product rejected successfully",
  "product": {
    "id": "uuid",
    "name": "iPhone 15 Pro",
    "approval_status": "REJECTED",
    ...
  }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:8080/admin/products/PRODUCT_UUID/reject \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### Get All Vendors
**Endpoint:** `GET /admin/vendors`  
**Access:** Protected (Admin only)  
**Description:** Get all vendors (all statuses)

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "email": "vendor@shop.com",
    "name": "Jane Smith",
    "shop_name": "Jane's Electronics",
    "approval_status": "APPROVED",
    ...
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/admin/vendors \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### Get All Products (Admin View)
**Endpoint:** `GET /admin/products`  
**Access:** Protected (Admin only)  
**Description:** Get all products (all statuses, including PENDING and REJECTED)

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Product Name",
    "approval_status": "PENDING | APPROVED | REJECTED",
    ...
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/admin/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You must be an approved vendor to add products."
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "User with this email already exists"
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- JWT tokens expire after 7 days (configurable in `.env`)
- CORS is enabled for development (`origin: '*'`)
- All endpoints return `Content-Type: application/json`

---

**Last Updated:** January 14, 2026
