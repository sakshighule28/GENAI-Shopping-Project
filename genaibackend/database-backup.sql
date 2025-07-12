-- Clothing Store Database Backup Script
-- Generated for existing data structure

-- Create Database
CREATE DATABASE IF NOT EXISTS clothing_store;
USE clothing_store;

-- Create Tables
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0.00,
    discounted_price DECIMAL(10,2),
    units_in_stock INT NOT NULL,
    image_url VARCHAR(500),
    brand VARCHAR(255),
    sizes VARCHAR(255),
    average_rating DOUBLE DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL,
    address VARCHAR(500),
    city VARCHAR(255),
    state VARCHAR(255),
    pincode VARCHAR(10),
    phone VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_date DATETIME NOT NULL,
    delivery_date DATETIME,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'EXCHANGED', 'REQUEST_CANCEL', 'REQUEST_EXCHANGE', 'REQUEST_REPLACE') DEFAULT 'PLACED',
    shipping_address VARCHAR(500),
    city VARCHAR(255),
    state VARCHAR(255),
    pincode VARCHAR(10),
    phone VARCHAR(15),
    status_reason VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_date DATETIME NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample Data Inserts (Based on your Postman testing)

-- Categories
INSERT INTO categories (name) VALUES 
('Sarees'),
('dresses'),
('tops'),
('bottoms'),
('shirts'),
('rings'),
('earrings'),
('neck pendants'),
('hand jewellery'),
('bags'),
('shoes'),
('heels'),
('hair accessories');

-- Sample Products
INSERT INTO products (name, description, base_price, discount_percent, discounted_price, units_in_stock, image_url, brand, sizes, category_id) VALUES 
('Banarasi Silk Saree', 'Handwoven Banarasi silk saree with golden zari work', 8999.00, 0.00, 8999.00, 25, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', 'Mitera', '', 1),
('Kanchipuram silk red', 'Red silk saree, traditional saree', 5999.00, 0.00, 5999.00, 100, 'https://tse3.mm.bing.net/th/id/OIP.0ptX3ldbf59pTfnQDjWLnAHaLI?w=202&h=305&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3', 'Golden Threads', 'free size', 1),
('Floral Maxi Dress', 'Cotton maxi dress with floral print perfect for summer', 1899.00, 0.00, 1899.00, 40, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800', 'H&M', 'XS,S,M,L,XL', 2),
('Crop Top', 'Trendy crop top with tie-up detail', 799.00, 0.00, 799.00, 60, 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800', 'Forever 21', 'XS,S,M,L,XL', 3),
('High Waist Jeans', 'Stretchable denim high waist skinny jeans', 2499.00, 0.00, 2499.00, 50, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', 'Levis', '28,30,32,34', 4);

-- Sample Users
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$encrypted_password_here', 'admin@store.com', 'ADMIN'),
('customer', '$2a$10$encrypted_password_here', 'customer@store.com', 'CUSTOMER');

-- Note: Replace encrypted_password_here with actual BCrypt hashed passwords

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_cart_user ON cart(user_id);

-- End of Script