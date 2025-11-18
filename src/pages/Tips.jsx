import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Lightbulb, CheckCircle, AlertTriangle, Zap, BookOpen } from 'lucide-react';
import EducationalPanel, { KeyConcept, RealWorldExample } from '../components/EducationalPanel';
import { GlossaryTerm } from '../components/Glossary';

const tips = {
  'Performance': [
    {
      icon: Zap,
      title: 'Use EXPLAIN ANALYZE',
      category: 'Performance',
      content: 'Always use EXPLAIN ANALYZE before optimizing queries. It shows the actual execution plan and timing, helping you identify bottlenecks.',
      example: `EXPLAIN ANALYZE
SELECT * FROM carrier_trips 
WHERE origin_city = 'New York';`
    },
    {
      icon: Zap,
      title: 'Index Foreign Keys',
      category: 'Performance',
      content: 'Foreign key columns are frequently used in JOINs. Always create indexes on foreign key columns to improve query performance.',
      example: `CREATE INDEX idx_carrier_trips_carrier ON carrier_trips(carrier_id);`
    },
    {
      icon: Zap,
      title: 'Use Partial Indexes',
      category: 'Performance',
      content: 'If you frequently query a subset of rows (e.g., only active trips), create a partial index. It\'s smaller and faster than a full index.',
      example: `CREATE INDEX idx_active_trips ON carrier_trips(carrier_id, origin_city)
WHERE trip_status IN ('planning', 'active');`
    },
    {
      icon: Zap,
      title: 'Avoid SELECT *',
      category: 'Performance',
      content: 'Only select columns you need. SELECT * retrieves unnecessary data and can prevent index-only scans.',
      example: `-- Instead of: SELECT * FROM users
-- Use: SELECT id, name, email FROM users`
    }
  ],
  'Data Integrity': [
    {
      icon: CheckCircle,
      title: 'Always Use Constraints',
      category: 'Data Integrity',
      content: 'Constraints (UNIQUE, CHECK, FOREIGN KEY) prevent invalid data at the database level, not just in your application.',
      example: `-- Prevent invalid data
CHECK (age >= 0 AND age <= 150)
UNIQUE (email)
FOREIGN KEY (user_id) REFERENCES users(id)`
    },
    {
      icon: CheckCircle,
      title: 'Use ENUMs for Fixed Values',
      category: 'Data Integrity',
      content: 'For status fields and categorical data, use ENUMs instead of VARCHAR. They\'re faster, use less space, and prevent typos.',
      example: `CREATE TYPE status AS ENUM ('active', 'inactive');
-- Better than: status VARCHAR(20)`
    },
    {
      icon: CheckCircle,
      title: 'Validate Dates',
      category: 'Data Integrity',
      content: 'Use CHECK constraints to ensure logical date relationships (e.g., arrival_date >= departure_date).',
      example: `CHECK (arrival_date >= departure_date)
CHECK (delivery_date_needed >= pickup_date_preferred)`
    }
  ],
  'Best Practices': [
    {
      icon: BookOpen,
      title: 'Use Meaningful Names',
      category: 'Best Practices',
      content: 'Table and column names should be clear and descriptive. Use snake_case for consistency.',
      example: `-- Good: carrier_trips, package_requests, delivery_matches
-- Bad: ct, pr, dm, tbl1`
    },
    {
      icon: BookOpen,
      title: 'Document Complex Queries',
      category: 'Best Practices',
      content: 'Add comments to complex queries explaining the logic. Future you (and your team) will thank you.',
      example: `-- Find compatible trips for a package
-- Match criteria: route, capacity, dates, status
-- Score by route match quality (100=perfect, 50=partial)
SELECT ...`
    },
    {
      icon: BookOpen,
      title: 'Use Transactions',
      category: 'Best Practices',
      content: 'Wrap related operations in transactions to ensure atomicity. Either all operations succeed or all fail.',
      example: `BEGIN;
  INSERT INTO delivery_matches ...;
  UPDATE carrier_trips ...;
  UPDATE package_requests ...;
COMMIT;`
    },
    {
      icon: BookOpen,
      title: 'Normalize Your Data',
      category: 'Best Practices',
      content: 'Follow normalization principles to avoid data duplication and maintain consistency. Don\'t store calculated values unless necessary.',
      example: `-- Store: origin_city, destination_city
-- Don't store: route (can be calculated)
-- Exception: Store if calculation is expensive`
    }
  ],
  'Common Pitfalls': [
    {
      icon: AlertTriangle,
      title: 'N+1 Query Problem',
      category: 'Common Pitfalls',
      content: 'Avoid querying in loops. Use JOINs or subqueries to fetch related data in a single query.',
      example: `-- Bad: Query in loop
FOR each user:
  SELECT * FROM trips WHERE carrier_id = user.id

-- Good: Single query with JOIN
SELECT u.*, ct.* FROM users u
LEFT JOIN carrier_trips ct ON u.id = ct.carrier_id`
    },
    {
      icon: AlertTriangle,
      title: 'Case Sensitivity',
      category: 'Common Pitfalls',
      content: 'PostgreSQL string comparisons are case-sensitive by default. Use LOWER() or ILIKE for case-insensitive searches.',
      example: `-- Case-sensitive (may miss results)
WHERE city = 'New York'

-- Case-insensitive
WHERE LOWER(city) = LOWER('new york')
-- OR
WHERE city ILIKE 'new york'`
    },
    {
      icon: AlertTriangle,
      title: 'NULL Handling',
      category: 'Common Pitfalls',
      content: 'Remember that NULL != NULL in SQL. Use IS NULL or IS NOT NULL for NULL checks. Use COALESCE() for default values.',
      example: `-- Check for NULL
WHERE column IS NULL
WHERE column IS NOT NULL

-- Provide default
COALESCE(column, 'default_value')`
    },
    {
      icon: AlertTriangle,
      title: 'Date Comparisons',
      category: 'Common Pitfalls',
      content: 'Be careful with date comparisons. Use proper date functions and consider time zones if needed.',
      example: `-- Today's trips
WHERE departure_date = CURRENT_DATE

-- Date range
WHERE departure_date BETWEEN '2024-01-01' AND '2024-12-31'

-- Next 30 days
WHERE departure_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'`
    }
  ],
  'PostgreSQL Specific': [
    {
      icon: Zap,
      title: 'Use JSONB, Not JSON',
      category: 'PostgreSQL Specific',
      content: 'JSONB is binary format, faster for queries, and supports indexing. Use JSON only if you need to preserve exact formatting.',
      example: `-- Use JSONB
package_dimensions JSONB

-- Not JSON (unless you need exact formatting)
package_dimensions JSON`
    },
    {
      icon: Zap,
      title: 'Use SERIAL for Auto-Increment',
      category: 'PostgreSQL Specific',
      content: 'SERIAL automatically creates a sequence and sets the default. It\'s PostgreSQL\'s equivalent to AUTO_INCREMENT.',
      example: `id SERIAL PRIMARY KEY
-- Automatically creates sequence and default value`
    },
    {
      icon: Zap,
      title: 'Use FILTER for Conditional Aggregates',
      category: 'PostgreSQL Specific',
      content: 'FILTER clause is cleaner than CASE WHEN in aggregate functions. PostgreSQL-specific but very useful.',
      example: `-- Using FILTER
COUNT(*) FILTER (WHERE status = 'active')

-- Instead of
SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`
    },
    {
      icon: Zap,
      title: 'Use DISTINCT ON',
      category: 'PostgreSQL Specific',
      content: 'DISTINCT ON returns the first row for each unique value. Great for getting the latest record per group.',
      example: `-- Latest trip per carrier
SELECT DISTINCT ON (carrier_id) *
FROM carrier_trips
ORDER BY carrier_id, departure_date DESC;`
    }
  ]
};

export default function Tips() {
  const [selectedCategory, setSelectedCategory] = useState('Performance');
  const [expandedTip, setExpandedTip] = useState(null);

  const filteredTips = tips[selectedCategory] || [];

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
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-2 flex items-center gap-3">
                <Lightbulb className="w-10 h-10" />
                PostgreSQL Tips & Best Practices
              </h1>
              <p className="text-lg text-gray-700">
                Expert tips to improve your PostgreSQL skills
              </p>
            </div>
            <Link to="/" className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Home className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </div>

        <EducationalPanel title="About These Tips" type="info" defaultOpen={true}>
          <p className="text-gray-700 mb-4">
            These tips are collected from real-world PostgreSQL development experience. They cover performance optimization, 
            data integrity, best practices, common pitfalls, and PostgreSQL-specific features.
          </p>
          <p className="text-gray-700">
            <strong>Tip:</strong> Bookmark this page and refer to it when writing queries. Following these tips will help 
            you write faster, more reliable, and more maintainable SQL.
          </p>
        </EducationalPanel>

        {/* Category Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {Object.keys(tips).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setExpandedTip(null);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'Performance' && <Zap className="w-4 h-4" />}
                {category === 'Data Integrity' && <CheckCircle className="w-4 h-4" />}
                {category === 'Best Practices' && <BookOpen className="w-4 h-4" />}
                {category === 'Common Pitfalls' && <AlertTriangle className="w-4 h-4" />}
                {category === 'PostgreSQL Specific' && <Zap className="w-4 h-4" />}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTips.map((tip, idx) => {
            const IconComponent = tip.icon;
            const isExpanded = expandedTip === idx;
            
            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-yellow-500 hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
                      <p className="text-gray-700 mb-4">{tip.content}</p>
                      
                      {tip.example && (
                        <div>
                          <button
                            onClick={() => setExpandedTip(isExpanded ? null : idx)}
                            className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm flex items-center gap-2 mb-2"
                          >
                            {isExpanded ? 'Hide' : 'Show'} Example
                            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                              ▼
                            </span>
                          </button>
                          
                          {isExpanded && (
                            <div className="bg-gray-900 rounded-lg p-4 mt-2">
                              <pre className="text-green-400 text-sm overflow-x-auto">
                                <code>{tip.example}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

