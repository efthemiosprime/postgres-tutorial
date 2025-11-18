import React, { useState } from 'react';
import { BookOpen, X, Copy, Check } from 'lucide-react';

const cheatSheets = {
  'Data Types': {
    content: `-- Numeric Types
INTEGER          -- Whole numbers: -2147483648 to 2147483647
SERIAL           -- Auto-incrementing integer (1, 2, 3...)
BIGINT           -- Large whole numbers
DECIMAL(10,2)    -- Exact numeric: 12345.67
REAL             -- Floating point number

-- Text Types
VARCHAR(255)     -- Variable length string (max 255 chars)
TEXT             -- Unlimited length string
CHAR(10)         -- Fixed length string (10 chars)

-- Date/Time Types
DATE             -- Date only: '2024-03-15'
TIMESTAMP        -- Date and time: '2024-03-15 10:30:00'
TIME             -- Time only: '10:30:00'

-- Boolean
BOOLEAN          -- TRUE or FALSE

-- JSON
JSONB            -- Binary JSON (indexed, faster)
JSON             -- Text JSON (not indexed)`
  },
  'Constraints': {
    content: `-- Primary Key (unique identifier)
id SERIAL PRIMARY KEY

-- Foreign Key (reference another table)
carrier_id INTEGER REFERENCES users(id)

-- Unique (no duplicates)
email VARCHAR(255) UNIQUE

-- Not Null (required field)
name VARCHAR(255) NOT NULL

-- Check (validate condition)
age INTEGER CHECK (age >= 0)
price DECIMAL CHECK (price > 0)

-- Default Value
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
status VARCHAR(20) DEFAULT 'active'`
  },
  'Common Queries': {
    content: `-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- Filter rows
SELECT * FROM users WHERE is_carrier = TRUE;

-- Sort results
SELECT * FROM users ORDER BY name ASC;
SELECT * FROM users ORDER BY created_at DESC;

-- Limit results
SELECT * FROM users LIMIT 10;

-- Count rows
SELECT COUNT(*) FROM users;

-- Aggregate functions
SELECT AVG(price) FROM products;
SELECT MAX(price), MIN(price) FROM products;
SELECT SUM(total) FROM orders;

-- Group by
SELECT status, COUNT(*) 
FROM orders 
GROUP BY status;

-- Join tables
SELECT u.name, ct.origin_city
FROM users u
JOIN carrier_trips ct ON u.id = ct.carrier_id;`
  },
  'Table Operations': {
    content: `-- Create table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
);

-- Add column
ALTER TABLE users ADD COLUMN phone VARCHAR(50);

-- Modify column
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(500);

-- Drop column
ALTER TABLE users DROP COLUMN phone;

-- Add constraint
ALTER TABLE users ADD CONSTRAINT check_email 
    CHECK (email LIKE '%@%');

-- Drop table
DROP TABLE users;

-- Truncate (delete all rows)
TRUNCATE TABLE users;`
  },
  'Indexes': {
    content: `-- Create index
CREATE INDEX idx_email ON users(email);

-- Composite index
CREATE INDEX idx_name_email ON users(name, email);

-- Unique index
CREATE UNIQUE INDEX idx_unique_email ON users(email);

-- Partial index (only index matching rows)
CREATE INDEX idx_active_users ON users(email) 
WHERE is_active = TRUE;

-- Functional index (case-insensitive)
CREATE INDEX idx_lower_name ON users(LOWER(name));

-- Drop index
DROP INDEX idx_email;

-- List indexes
\\di users  -- In psql`
  },
  'ENUMs': {
    content: `-- Create ENUM type
CREATE TYPE status AS ENUM ('active', 'inactive', 'pending');

-- Use in table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status status DEFAULT 'pending'
);

-- Insert with ENUM
INSERT INTO orders (status) VALUES ('active');

-- Query ENUM
SELECT * FROM orders WHERE status = 'active';

-- Add value to ENUM (PostgreSQL 9.1+)
ALTER TYPE status ADD VALUE 'cancelled';

-- Drop ENUM
DROP TYPE status;`
  }
};

export default function CheatSheet({ category = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category || 'Data Types');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cheatSheets[selectedCategory].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <BookOpen className="w-4 h-4" />
        <span>Quick Reference</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                PostgreSQL Cheat Sheet
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex border-b border-gray-200">
              <div className="w-48 border-r border-gray-200 overflow-y-auto">
                {Object.keys(cheatSheets).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selectedCategory === cat
                        ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedCategory}</h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">Copy</span>
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{cheatSheets[selectedCategory].content}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

