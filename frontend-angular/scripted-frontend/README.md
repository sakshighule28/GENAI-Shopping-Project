# Scripted - Women's Fashion Frontend

A beautiful Angular frontend for the Scripted clothing store, inspired by H&M's design.

## Features

### Customer Features
- **Authentication**: Login/Register with JWT tokens
- **Product Browsing**: Browse products with filters (category, brand, price)
- **Search**: Search products by name
- **Shopping Cart**: Add/remove products, update quantities
- **Checkout**: Complete order placement with payment options
- **Order Management**: View order history, request exchanges/replacements
- **Product Reviews**: View and add product reviews

### Admin Features
- **Dashboard**: Overview of products, categories, and orders
- **Product Management**: CRUD operations for products
- **Category Management**: CRUD operations for categories
- **Discount Management**: Apply discounts to products
- **Order Management**: Update order statuses
- **Stock Management**: Update product stock levels

## Design

- **H&M Inspired**: Clean, minimalist design with monochrome color scheme
- **Responsive**: Mobile-first responsive design
- **Modern UI**: Contemporary typography and spacing
- **User Experience**: Intuitive navigation and interactions

## Technology Stack

- **Frontend**: Angular 17
- **Styling**: SCSS with custom design system
- **HTTP Client**: Angular HttpClient for API communication
- **Forms**: Reactive Forms with validation
- **Icons**: Font Awesome icons

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   ng serve
   ```

3. **Access Application**:
   - Open browser to `http://localhost:4200`
   - Backend should be running on `http://localhost:8080`

## Default Credentials

### Admin User
- Username: `admin`
- Password: `admin123`

### Customer User
- Username: `customer`
- Password: `customer123`

## API Integration

The frontend integrates with the Spring Boot backend:
- **Authentication**: JWT token-based authentication
- **Products**: Full CRUD operations
- **Categories**: Management and filtering
- **Orders**: Complete order lifecycle
- **Cart**: Shopping cart functionality
- **Reviews**: Product review system

## Project Structure

```
src/
├── app/
│   ├── models/          # TypeScript interfaces
│   ├── services/        # API services
│   ├── app.component.*  # Main application component
│   └── app.module.ts    # App module configuration
├── assets/              # Static assets
└── styles.scss          # Global styles
```

## Features Implemented

✅ User Authentication (Login/Register)
✅ Product Catalog with Filters
✅ Shopping Cart Functionality
✅ Order Management
✅ Admin Dashboard
✅ Product Management (CRUD)
✅ Category Management
✅ Discount System
✅ Responsive Design
✅ Modern UI/UX

## Future Enhancements

- Product image upload
- Advanced search filters
- Wishlist functionality
- User profile management
- Order tracking
- Email notifications
- Payment gateway integration