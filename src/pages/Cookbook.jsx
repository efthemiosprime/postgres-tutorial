import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, BookOpen, Search, Copy, Check } from 'lucide-react';
import SQLEditor from '../components/SQLEditor';
import EducationalPanel from '../components/EducationalPanel';

const recipes = {
  'Basic Queries': [
    {
      title: 'Select with Conditions',
      description: 'Basic SELECT queries with WHERE clauses and logical operators',
      query: `-- Simple SELECT
SELECT * FROM table_name;

-- Select specific columns
SELECT id, name, email FROM users;

-- With WHERE condition
SELECT * FROM users WHERE age > 18;

-- Multiple conditions
SELECT * FROM users 
WHERE age > 18 AND status = 'active';

-- Using OR
SELECT * FROM products 
WHERE category = 'electronics' OR price < 100;

-- Using IN
SELECT * FROM users 
WHERE status IN ('active', 'pending', 'verified');

-- Using LIKE for pattern matching
SELECT * FROM users 
WHERE email LIKE '%@gmail.com';

-- Using BETWEEN
SELECT * FROM orders 
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';`
    },
    {
      title: 'Sorting Results',
      description: 'Order results using ORDER BY',
      query: `-- Sort ascending (default)
SELECT * FROM users ORDER BY name;

-- Sort descending
SELECT * FROM products ORDER BY price DESC;

-- Multiple sort columns
SELECT * FROM orders 
ORDER BY order_date DESC, total_amount DESC;

-- Sort by expression
SELECT *, price * quantity as total 
FROM order_items 
ORDER BY total DESC;

-- NULLS FIRST or LAST
SELECT * FROM users 
ORDER BY last_login NULLS LAST;`
    },
    {
      title: 'Limiting Results',
      description: 'Control the number of rows returned',
      query: `-- Limit number of rows
SELECT * FROM users LIMIT 10;

-- Limit with offset (pagination)
SELECT * FROM products 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 40;  -- Skip first 40, get next 20

-- Using FETCH (SQL standard)
SELECT * FROM users 
ORDER BY created_at DESC 
FETCH FIRST 10 ROWS ONLY;

-- Top N per group (PostgreSQL)
SELECT DISTINCT ON (category) *
FROM products
ORDER BY category, price DESC;`
    }
  ],
  'Joins': [
    {
      title: 'Inner Join',
      description: 'Combine rows from two tables where condition matches',
      query: `-- Basic INNER JOIN
SELECT u.name, o.order_date, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- Multiple JOINs
SELECT 
    u.name,
    o.order_date,
    p.product_name,
    oi.quantity,
    oi.price
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;

-- JOIN with conditions
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
  AND o.total > 100;`
    },
    {
      title: 'Left/Right/Full Outer Join',
      description: 'Include rows even when there\'s no match',
      query: `-- LEFT JOIN (all rows from left table)
SELECT u.name, o.order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Find users with no orders
SELECT u.name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;

-- RIGHT JOIN (all rows from right table)
SELECT u.name, o.order_date
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- FULL OUTER JOIN (all rows from both)
SELECT u.name, o.order_date
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;`
    },
    {
      title: 'Self Join',
      description: 'Join a table to itself',
      query: `-- Find employees and their managers
SELECT 
    e.name as employee,
    m.name as manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Find related records
SELECT 
    p1.name as product1,
    p2.name as product2
FROM products p1
JOIN products p2 ON p1.category_id = p2.category_id
WHERE p1.id < p2.id;  -- Avoid duplicates`
    },
    {
      title: 'Cross Join',
      description: 'Cartesian product of two tables',
      query: `-- All combinations
SELECT u.name, p.product_name
FROM users u
CROSS JOIN products p;

-- Useful for generating test data
SELECT 
    date::date,
    product_id
FROM generate_series('2024-01-01'::date, '2024-12-31'::date, '1 day') as date
CROSS JOIN (SELECT id FROM products) p;`
    }
  ],
  'Aggregations': [
    {
      title: 'Basic Aggregates',
      description: 'COUNT, SUM, AVG, MIN, MAX functions',
      query: `-- Count rows
SELECT COUNT(*) FROM users;

-- Count non-NULL values
SELECT COUNT(email) FROM users;

-- Sum values
SELECT SUM(total_amount) FROM orders;

-- Average
SELECT AVG(price) FROM products;

-- Min and Max
SELECT 
    MIN(price) as lowest_price,
    MAX(price) as highest_price
FROM products;

-- Multiple aggregates
SELECT 
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value
FROM orders;`
    },
    {
      title: 'GROUP BY',
      description: 'Group rows and aggregate by groups',
      query: `-- Group by single column
SELECT category, COUNT(*) as product_count
FROM products
GROUP BY category;

-- Group by multiple columns
SELECT 
    category,
    status,
    COUNT(*) as count
FROM products
GROUP BY category, status;

-- With aggregate functions
SELECT 
    user_id,
    COUNT(*) as order_count,
    SUM(total_amount) as total_spent,
    AVG(total_amount) as avg_order_value
FROM orders
GROUP BY user_id;

-- Filter groups with HAVING
SELECT 
    category,
    COUNT(*) as product_count
FROM products
GROUP BY category
HAVING COUNT(*) > 10;`
    },
    {
      title: 'Conditional Aggregates',
      description: 'Aggregate with FILTER clause (PostgreSQL specific)',
      query: `-- Count with condition
SELECT 
    COUNT(*) FILTER (WHERE status = 'active') as active_count,
    COUNT(*) FILTER (WHERE status = 'inactive') as inactive_count
FROM users;

-- Sum with condition
SELECT 
    SUM(amount) FILTER (WHERE type = 'income') as total_income,
    SUM(amount) FILTER (WHERE type = 'expense') as total_expense
FROM transactions;

-- Multiple filters
SELECT 
    COUNT(*) FILTER (WHERE age < 18) as minors,
    COUNT(*) FILTER (WHERE age >= 18 AND age < 65) as adults,
    COUNT(*) FILTER (WHERE age >= 65) as seniors
FROM users;`
    }
  ],
  'Subqueries': [
    {
      title: 'Scalar Subqueries',
      description: 'Subqueries that return a single value',
      query: `-- Subquery in SELECT
SELECT 
    name,
    price,
    (SELECT AVG(price) FROM products) as avg_price
FROM products;

-- Subquery in WHERE
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Subquery with comparison
SELECT * FROM orders
WHERE total_amount = (SELECT MAX(total_amount) FROM orders);`
    },
    {
      title: 'IN and EXISTS',
      description: 'Check if values exist in subquery results',
      query: `-- Using IN
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders);

-- Using NOT IN (be careful with NULLs)
SELECT * FROM products
WHERE category_id NOT IN (
    SELECT id FROM categories WHERE active = FALSE
);

-- Using EXISTS (often faster than IN)
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id
);

-- NOT EXISTS
SELECT * FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM order_items oi 
    WHERE oi.product_id = p.id
);`
    },
    {
      title: 'Correlated Subqueries',
      description: 'Subqueries that reference outer query',
      query: `-- Find products above category average
SELECT p1.*
FROM products p1
WHERE p1.price > (
    SELECT AVG(p2.price)
    FROM products p2
    WHERE p2.category_id = p1.category_id
);

-- Latest order per user
SELECT o1.*
FROM orders o1
WHERE o1.order_date = (
    SELECT MAX(o2.order_date)
    FROM orders o2
    WHERE o2.user_id = o1.user_id
);`
    }
  ],
  'Window Functions': [
    {
      title: 'Ranking Functions',
      description: 'ROW_NUMBER, RANK, DENSE_RANK',
      query: `-- Row number
SELECT 
    name,
    price,
    ROW_NUMBER() OVER (ORDER BY price DESC) as rank
FROM products;

-- Rank (with ties)
SELECT 
    name,
    score,
    RANK() OVER (ORDER BY score DESC) as rank
FROM students;

-- Dense rank (no gaps)
SELECT 
    name,
    score,
    DENSE_RANK() OVER (ORDER BY score DESC) as rank
FROM students;

-- Partition by category
SELECT 
    name,
    category,
    price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) as rank_in_category
FROM products;`
    },
    {
      title: 'Aggregate Window Functions',
      description: 'Running totals, moving averages',
      query: `-- Running total
SELECT 
    order_date,
    total_amount,
    SUM(total_amount) OVER (ORDER BY order_date) as running_total
FROM orders;

-- Moving average
SELECT 
    date,
    sales,
    AVG(sales) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as seven_day_avg
FROM daily_sales;

-- Partitioned running total
SELECT 
    user_id,
    order_date,
    total_amount,
    SUM(total_amount) OVER (
        PARTITION BY user_id 
        ORDER BY order_date
    ) as user_running_total
FROM orders;`
    },
    {
      title: 'LAG and LEAD',
      description: 'Access previous/next row values',
      query: `-- Compare with previous row
SELECT 
    date,
    sales,
    LAG(sales) OVER (ORDER BY date) as previous_sales,
    sales - LAG(sales) OVER (ORDER BY date) as change
FROM daily_sales;

-- Compare with next row
SELECT 
    date,
    sales,
    LEAD(sales) OVER (ORDER BY date) as next_sales
FROM daily_sales;

-- With partition
SELECT 
    product_id,
    date,
    price,
    LAG(price) OVER (PARTITION BY product_id ORDER BY date) as previous_price
FROM price_history;`
    }
  ],
  'Date & Time': [
    {
      title: 'Date Filtering',
      description: 'Query by date ranges and intervals',
      query: `-- Today's records
SELECT * FROM orders 
WHERE order_date = CURRENT_DATE;

-- Last 30 days
SELECT * FROM orders 
WHERE order_date >= CURRENT_DATE - INTERVAL '30 days';

-- This month
SELECT * FROM orders 
WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)
  AND order_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';

-- Date range
SELECT * FROM orders 
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';

-- Extract date parts
SELECT 
    EXTRACT(YEAR FROM order_date) as year,
    EXTRACT(MONTH FROM order_date) as month,
    COUNT(*) as order_count
FROM orders
GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date);`
    },
    {
      title: 'Date Formatting',
      description: 'Format dates for display',
      query: `-- Format date
SELECT TO_CHAR(order_date, 'YYYY-MM-DD') as formatted_date
FROM orders;

-- Custom format
SELECT TO_CHAR(order_date, 'Month DD, YYYY') as formatted_date
FROM orders;

-- Extract parts
SELECT 
    TO_CHAR(order_date, 'YYYY') as year,
    TO_CHAR(order_date, 'MM') as month,
    TO_CHAR(order_date, 'DD') as day
FROM orders;

-- Day of week
SELECT 
    order_date,
    TO_CHAR(order_date, 'Day') as day_name,
    EXTRACT(DOW FROM order_date) as day_of_week
FROM orders;`
    },
    {
      title: 'Date Arithmetic',
      description: 'Calculate with dates',
      query: `-- Add days
SELECT CURRENT_DATE + INTERVAL '7 days' as next_week;

-- Subtract days
SELECT CURRENT_DATE - INTERVAL '30 days' as last_month;

-- Age calculation
SELECT 
    name,
    birth_date,
    AGE(birth_date) as age,
    EXTRACT(YEAR FROM AGE(birth_date)) as age_years
FROM users;

-- Difference between dates
SELECT 
    start_date,
    end_date,
    end_date - start_date as days_between
FROM events;`
    }
  ],
  'String Operations': [
    {
      title: 'String Functions',
      description: 'Common string manipulation functions',
      query: `-- Concatenate
SELECT CONCAT(first_name, ' ', last_name) as full_name FROM users;

-- Using || operator
SELECT first_name || ' ' || last_name as full_name FROM users;

-- Upper and Lower
SELECT UPPER(name) as upper_name FROM products;
SELECT LOWER(email) as lower_email FROM users;

-- Trim whitespace
SELECT TRIM('  hello  ') as trimmed;
SELECT LTRIM('  hello') as left_trimmed;
SELECT RTRIM('hello  ') as right_trimmed;

-- Substring
SELECT SUBSTRING(email FROM 1 FOR 5) as email_start FROM users;
SELECT SUBSTRING(email FROM '@') as domain FROM users;

-- Replace
SELECT REPLACE(phone, '-', '') as phone_no_dashes FROM users;

-- Length
SELECT LENGTH(name) as name_length FROM products;`
    },
    {
      title: 'Pattern Matching',
      description: 'LIKE, ILIKE, and regular expressions',
      query: `-- LIKE (case-sensitive)
SELECT * FROM users WHERE name LIKE 'John%';

-- ILIKE (case-insensitive, PostgreSQL)
SELECT * FROM users WHERE email ILIKE '%@gmail.com';

-- Pattern matching
SELECT * FROM products 
WHERE name LIKE '%phone%';

-- Single character wildcard
SELECT * FROM users 
WHERE phone LIKE '555-___-____';

-- Regular expressions
SELECT * FROM users 
WHERE email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$';

-- Case-insensitive regex
SELECT * FROM products 
WHERE name ~* 'phone|mobile|cell';`
    }
  ],
  'JSON Operations': [
    {
      title: 'Querying JSONB',
      description: 'Extract and query JSON data',
      query: `-- Extract JSON field
SELECT 
    id,
    data->>'name' as name,
    data->>'email' as email
FROM users;

-- Extract nested field
SELECT 
    id,
    data->'address'->>'city' as city
FROM users;

-- Check if key exists
SELECT * FROM products 
WHERE metadata ? 'discount';

-- Query JSON array
SELECT 
    id,
    jsonb_array_length(tags) as tag_count
FROM products;

-- Extract array element
SELECT 
    id,
    tags->0 as first_tag
FROM products;`
    },
    {
      title: 'JSON Functions',
      description: 'Common JSON manipulation functions',
      query: `-- Convert to JSON
SELECT to_jsonb(row(name, email)) FROM users LIMIT 1;

-- Build JSON object
SELECT jsonb_build_object(
    'id', id,
    'name', name,
    'email', email
) as user_json
FROM users;

-- Merge JSON objects
SELECT jsonb_build_object('a', 1) || jsonb_build_object('b', 2);

-- Check JSON type
SELECT 
    jsonb_typeof(data->'age') as age_type
FROM users;`
    }
  ],
  'Common Patterns': [
    {
      title: 'Find Duplicates',
      description: 'Identify duplicate records',
      query: `-- Find duplicate emails
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Find duplicate rows (all columns)
SELECT *
FROM (
    SELECT *, 
           ROW_NUMBER() OVER (
               PARTITION BY column1, column2, column3 
               ORDER BY id
           ) as rn
    FROM table_name
) t
WHERE rn > 1;

-- Remove duplicates (keep one)
DELETE FROM table_name
WHERE id NOT IN (
    SELECT MIN(id)
    FROM table_name
    GROUP BY column1, column2, column3
);`
    },
    {
      title: 'Find Missing Records',
      description: 'Identify gaps or missing data',
      query: `-- Find IDs not in another table
SELECT id FROM table1
WHERE id NOT IN (SELECT id FROM table2);

-- Using NOT EXISTS (handles NULLs better)
SELECT t1.id
FROM table1 t1
WHERE NOT EXISTS (
    SELECT 1 FROM table2 t2 
    WHERE t2.id = t1.id
);

-- Find missing dates in sequence
SELECT generate_series(
    '2024-01-01'::date,
    '2024-12-31'::date,
    '1 day'::interval
)::date as missing_date
WHERE NOT EXISTS (
    SELECT 1 FROM daily_data d 
    WHERE d.date = missing_date
);`
    },
    {
      title: 'Pivot Data',
      description: 'Transform rows to columns',
      query: `-- Using CASE for pivot
SELECT 
    category,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count,
    SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_count,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count
FROM products
GROUP BY category;

-- Using FILTER (PostgreSQL)
SELECT 
    category,
    COUNT(*) FILTER (WHERE status = 'active') as active_count,
    COUNT(*) FILTER (WHERE status = 'inactive') as inactive_count
FROM products
GROUP BY category;`
    },
    {
      title: 'Hierarchical Queries',
      description: 'Query tree structures',
      query: `-- Using recursive CTE for tree
WITH RECURSIVE category_tree AS (
    -- Base case: root categories
    SELECT id, name, parent_id, 0 as level
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case: child categories
    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree;

-- Find all descendants
WITH RECURSIVE descendants AS (
    SELECT id, name, parent_id
    FROM categories
    WHERE id = 1  -- Starting category
    
    UNION ALL
    
    SELECT c.id, c.name, c.parent_id
    FROM categories c
    JOIN descendants d ON c.parent_id = d.id
)
SELECT * FROM descendants;`
    }
  ],
  'Performance': [
    {
      title: 'Query Optimization',
      description: 'Tips for faster queries',
      query: `-- Use EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';

-- Use LIMIT early
SELECT * FROM (
    SELECT * FROM orders 
    ORDER BY created_at DESC 
    LIMIT 100
) subquery
WHERE status = 'completed';

-- Avoid SELECT *
SELECT id, name, email FROM users;  -- Instead of SELECT *

-- Use EXISTS instead of COUNT
-- Faster:
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- Instead of:
SELECT * FROM users u
WHERE (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) > 0;`
    },
    {
      title: 'Index Usage',
      description: 'Queries that benefit from indexes',
      query: `-- Create index for frequent lookups
CREATE INDEX idx_users_email ON users(email);

-- Composite index for multi-column queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Partial index for filtered queries
CREATE INDEX idx_active_users ON users(email) 
WHERE status = 'active';

-- Functional index
CREATE INDEX idx_lower_email ON users(LOWER(email));

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;`
    }
  ]
};

export default function Cookbook() {
  const [selectedCategory, setSelectedCategory] = useState('Basic Queries');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedRecipe, setCopiedRecipe] = useState(null);

  const handleCopy = (recipeTitle) => {
    const recipe = recipes[selectedCategory].find(r => r.title === recipeTitle);
    if (recipe) {
      navigator.clipboard.writeText(recipe.query);
      setCopiedRecipe(recipeTitle);
      setTimeout(() => setCopiedRecipe(null), 2000);
    }
  };

  const filteredRecipes = recipes[selectedCategory]?.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2 flex items-center gap-3">
                <BookOpen className="w-10 h-10" />
                PostgreSQL SQL Cookbook
              </h1>
              <p className="text-lg text-gray-700">
                Ready-to-use SQL recipes for common PostgreSQL tasks
              </p>
            </div>
            <Link to="/" className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Home className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </div>

        <EducationalPanel title="About the Cookbook" type="info" defaultOpen={true}>
          <p className="text-gray-700 mb-4">
            This cookbook contains general PostgreSQL SQL recipes that work with any database. 
            Each recipe includes working SQL queries you can copy and adapt for your specific needs.
          </p>
          <p className="text-gray-700">
            <strong>How to use:</strong> Browse by category, search for specific queries, copy the SQL, 
            and modify table/column names and values to match your database schema.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Note:</strong> Replace generic table names (like <code className="bg-gray-100 px-1 rounded">users</code>, 
            <code className="bg-gray-100 px-1 rounded">orders</code>, <code className="bg-gray-100 px-1 rounded">products</code>) 
            with your actual table names.
          </p>
        </EducationalPanel>

        {/* Category Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(recipes).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchTerm('');
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Recipes */}
        <div className="space-y-6">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{recipe.title}</h3>
                    <p className="text-orange-100 text-sm mt-1">{recipe.description}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(recipe.title)}
                    className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                    title="Copy query"
                  >
                    {copiedRecipe === recipe.title ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Copy className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
                <div className="p-6">
                  <SQLEditor initialQuery={recipe.query} readOnly={true} />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500">No recipes found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link to="/" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
