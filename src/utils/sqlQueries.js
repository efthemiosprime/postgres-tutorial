// SQL queries for Part 1: Database Setup
export const part1Queries = {
  createDatabase: `-- Create the database
CREATE DATABASE p2p_delivery;

-- Connect to the database
\\c p2p_delivery;`,

  createUsersTable: `-- Create users table with role support
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    is_carrier BOOLEAN DEFAULT FALSE,
    is_shipper BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT at_least_one_role CHECK (is_carrier = TRUE OR is_shipper = TRUE)
);

-- Add comment to table
COMMENT ON TABLE users IS 'Stores user information with dual roles (carrier and/or shipper)';`,

  insertSampleUsers: `-- Insert sample users
INSERT INTO users (name, email, phone, is_carrier, is_shipper) VALUES
('Alice Johnson', 'alice@example.com', '+1-555-0101', TRUE, FALSE),
('Bob Smith', 'bob@example.com', '+1-555-0102', FALSE, TRUE),
('Charlie Brown', 'charlie@example.com', '+1-555-0103', TRUE, TRUE),
('Diana Prince', 'diana@example.com', '+1-555-0104', TRUE, FALSE),
('Eve Wilson', 'eve@example.com', '+1-555-0105', FALSE, TRUE),
('Frank Miller', 'frank@example.com', '+1-555-0106', TRUE, TRUE),
('Grace Lee', 'grace@example.com', '+1-555-0107', TRUE, FALSE),
('Henry Davis', 'henry@example.com', '+1-555-0108', FALSE, TRUE),
('Iris Chen', 'iris@example.com', '+1-555-0109', TRUE, TRUE),
('Jack Taylor', 'jack@example.com', '+1-555-0110', TRUE, FALSE);`,

  queryUsers: `-- Query all users
SELECT * FROM users;`,

  queryCarriers: `-- Query only carriers
SELECT id, name, email, phone 
FROM users 
WHERE is_carrier = TRUE;`,

  queryShippers: `-- Query only shippers
SELECT id, name, email, phone 
FROM users 
WHERE is_shipper = TRUE;`,

  queryBothRoles: `-- Query users who are both carriers and shippers
SELECT id, name, email, phone 
FROM users 
WHERE is_carrier = TRUE AND is_shipper = TRUE;`
};

// SQL queries for Part 2: Carrier Trips
export const part2Queries = {
  createEnums: `-- Create ENUM types for trip status and transportation method
CREATE TYPE trip_status AS ENUM ('planning', 'active', 'in_transit', 'completed', 'cancelled');
CREATE TYPE transportation_method AS ENUM ('flight', 'bus', 'train', 'car', 'other');`,

  createCarrierTripsTable: `-- Create carrier_trips table
CREATE TABLE carrier_trips (
    id SERIAL PRIMARY KEY,
    carrier_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    origin_city VARCHAR(100) NOT NULL,
    origin_country VARCHAR(100) NOT NULL,
    origin_lat DECIMAL(10, 8),
    origin_lng DECIMAL(11, 8),
    destination_city VARCHAR(100) NOT NULL,
    destination_country VARCHAR(100) NOT NULL,
    destination_lat DECIMAL(10, 8),
    destination_lng DECIMAL(11, 8),
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    available_weight_kg DECIMAL(10, 2) NOT NULL CHECK (available_weight_kg > 0),
    available_space_liters DECIMAL(10, 2) NOT NULL CHECK (available_space_liters > 0),
    price_per_kg DECIMAL(10, 2) NOT NULL CHECK (price_per_kg >= 0),
    trip_status trip_status DEFAULT 'planning',
    transportation_method transportation_method NOT NULL,
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (arrival_date >= departure_date)
);

-- Create indexes for common queries
CREATE INDEX idx_carrier_trips_carrier_status ON carrier_trips(carrier_id, trip_status);
CREATE INDEX idx_carrier_trips_origin ON carrier_trips(origin_city, origin_country);
CREATE INDEX idx_carrier_trips_destination ON carrier_trips(destination_city, destination_country);
CREATE INDEX idx_carrier_trips_dates ON carrier_trips(departure_date, arrival_date);`,

  insertSampleTrips: `-- Insert sample carrier trips
INSERT INTO carrier_trips (
    carrier_id, origin_city, origin_country, origin_lat, origin_lng,
    destination_city, destination_country, destination_lat, destination_lng,
    departure_date, arrival_date, available_weight_kg, available_space_liters,
    price_per_kg, trip_status, transportation_method, special_notes
) VALUES
(1, 'New York', 'USA', 40.7128, -74.0060, 'Los Angeles', 'USA', 34.0522, -118.2437,
 '2024-03-15', '2024-03-16', 50.00, 100.00, 2.50, 'planning', 'flight', 'Direct flight'),
(1, 'London', 'UK', 51.5074, -0.1278, 'Paris', 'France', 48.8566, 2.3522,
 '2024-04-01', '2024-04-01', 30.00, 60.00, 1.80, 'active', 'train', 'Eurostar'),
(3, 'Tokyo', 'Japan', 35.6762, 139.6503, 'Osaka', 'Japan', 34.6937, 135.5023,
 '2024-03-20', '2024-03-20', 40.00, 80.00, 3.00, 'planning', 'train', 'Shinkansen'),
(4, 'Berlin', 'Germany', 52.5200, 13.4050, 'Munich', 'Germany', 48.1351, 11.5820,
 '2024-03-25', '2024-03-25', 25.00, 50.00, 2.00, 'active', 'car', 'Road trip'),
(3, 'Sydney', 'Australia', -33.8688, 151.2093, 'Melbourne', 'Australia', -37.8136, 144.9631,
 '2024-04-05', '2024-04-06', 35.00, 70.00, 2.20, 'planning', 'bus', 'Overnight bus'),
(6, 'Toronto', 'Canada', 43.6532, -79.3832, 'Montreal', 'Canada', 45.5017, -73.5673,
 '2024-03-18', '2024-03-18', 20.00, 40.00, 1.50, 'in_transit', 'car', NULL),
(7, 'Barcelona', 'Spain', 41.3851, 2.1734, 'Madrid', 'Spain', 40.4168, -3.7038,
 '2024-03-22', '2024-03-22', 45.00, 90.00, 2.80, 'active', 'train', 'High-speed rail'),
(1, 'Dubai', 'UAE', 25.2048, 55.2708, 'Singapore', 'Singapore', 1.3521, 103.8198,
 '2024-04-10', '2024-04-10', 60.00, 120.00, 4.00, 'planning', 'flight', 'Long-haul flight');`,

  queryActiveTrips: `-- Find all active trips from a specific city
SELECT ct.*, u.name as carrier_name
FROM carrier_trips ct
JOIN users u ON ct.carrier_id = u.id
WHERE ct.origin_city = 'New York' 
  AND ct.trip_status IN ('planning', 'active')
ORDER BY ct.departure_date;`
};

// Add more query sets for other parts as needed
export const part3Queries = {};
export const part4Queries = {};
export const part5Queries = {};
export const part6Queries = {};
export const part7Queries = {};
export const part8Queries = {};

