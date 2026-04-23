-- Mendos Database Schema
-- MySQL Database

DROP DATABASE IF EXISTS mendos_db;
CREATE DATABASE mendos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mendos_db;

-- Tabla de Usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(180) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    roles JSON NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Tabla de Platos (Sistema de Stock Individual)
CREATE TABLE dishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(20) NULL COMMENT 'Opcional: solo informativo (starter, main, dessert)',
    allergens JSON,
    price DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    available_date DATE NOT NULL COMMENT 'Fecha específica de disponibilidad del plato',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_available_date (available_date)
) ENGINE=InnoDB;

-- TABLA ELIMINADA: weekly_menus
-- Ya no es necesaria en el modelo de platos individuales
-- Los platos se gestionan por available_date en la tabla dishes

-- Tabla de Reservas
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    dish_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_date (reservation_date),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Tabla de Valoraciones
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dish_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_rating (user_id, dish_id),
    INDEX idx_dish (dish_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB;

-- Tabla de Inventario
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    minimum_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_stock (quantity, minimum_stock)
) ENGINE=InnoDB;

