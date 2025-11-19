import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SQLEditor from '../components/SQLEditor';
import QueryResults from '../components/QueryResults';
import EducationalPanel, { KeyConcept, CommonMistakes, RealWorldExample } from '../components/EducationalPanel';
import { GlossaryTerm } from '../components/Glossary';
import PSQLReminder from '../components/PSQLReminder';

export default function Part7IndexingPerformance() {
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const handleExecuteQuery = (query) => {
    setQueryError(null);
    setQueryResults({ success: true });
  };

  const compositeIndexes = `-- Composite indexes for multi-column queries
-- These indexes help queries that filter on multiple columns

-- For carrier trips: carrier + status (most common query pattern)
CREATE INDEX idx_carrier_trips_carrier_status ON carrier_trips(carrier_id, trip_status);

-- For package requests: route matching (pickup + delivery cities)
CREATE INDEX idx_package_requests_route ON package_requests(pickup_city, delivery_city);

-- For delivery matches: user + status (find user's matches)
CREATE INDEX idx_delivery_matches_carrier_status ON delivery_matches(carrier_id, match_status);
CREATE INDEX idx_delivery_matches_shipper_status ON delivery_matches(shipper_id, match_status);`;

  const partialIndexes = `-- Partial indexes for filtered queries
-- These indexes only include rows matching a condition, saving space

-- Only index active trips (most queries filter by status)
CREATE INDEX idx_carrier_trips_active ON carrier_trips(carrier_id, origin_city, destination_city)
WHERE trip_status IN ('planning', 'active');

-- Only index open package requests
CREATE INDEX idx_package_requests_open ON package_requests(pickup_city, delivery_city, delivery_date_needed)
WHERE request_status = 'open';

-- Only index public ratings
CREATE INDEX idx_ratings_public ON ratings(rated_user_id, rating_type, rating)
WHERE is_public = TRUE;`;

  const functionalIndexes = `-- Functional indexes for case-insensitive searches
-- These indexes help with case-insensitive city matching

CREATE INDEX idx_carrier_trips_origin_ci ON carrier_trips(LOWER(origin_city), LOWER(origin_country));
CREATE INDEX idx_carrier_trips_dest_ci ON carrier_trips(LOWER(destination_city), LOWER(destination_country));
CREATE INDEX idx_package_requests_pickup_ci ON package_requests(LOWER(pickup_city), LOWER(pickup_country));
CREATE INDEX idx_package_requests_delivery_ci ON package_requests(LOWER(delivery_city), LOWER(delivery_country));`;

  const explainQuery = `-- Use EXPLAIN ANALYZE to see query execution plan
EXPLAIN ANALYZE
SELECT ct.*, u.name
FROM carrier_trips ct
JOIN users u ON ct.carrier_id = u.id
WHERE ct.origin_city = 'New York'
  AND ct.trip_status IN ('planning', 'active')
ORDER BY ct.departure_date;`;

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
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mb-2">
                Part 7: Indexing and Performance
              </h1>
              <p className="text-lg text-gray-700">
                Optimize queries with composite, partial, and functional indexes
              </p>
            </div>
            <Link to="/" className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Home className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <EducationalPanel title="Learning Objectives" type="default" defaultOpen={true}>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Add composite <GlossaryTerm term="INDEX">indexes</GlossaryTerm> for multi-column queries</li>
              <li>Create partial indexes for filtered queries</li>
              <li>Use functional indexes for case-insensitive searches</li>
              <li>Explain query execution plans using EXPLAIN ANALYZE</li>
              <li>Optimize slow queries based on execution plans</li>
            </ul>
          </EducationalPanel>

          <EducationalPanel title="Index Types in PostgreSQL" type="concept" defaultOpen={true}>
            <KeyConcept 
              term="Database Index"
              definition="A data structure that improves the speed of data retrieval operations. Like an index in a book, it helps PostgreSQL find data quickly without scanning every row."
              example="Without index: scans 1 million rows. With index: finds data in ~10 rows."
            />
            <div className="space-y-4 mt-4">
              <div>
                <strong className="text-gray-900">Composite Indexes:</strong>
                <p className="text-gray-700 text-sm mt-1">
                  Index multiple columns together. Most efficient when query filters match the index column order.
                </p>
              </div>
              <div>
                <strong className="text-gray-900">Partial Indexes:</strong>
                <p className="text-gray-700 text-sm mt-1">
                  Only index rows matching a condition. Saves space and improves performance for filtered queries.
                </p>
              </div>
              <div>
                <strong className="text-gray-900">Functional Indexes:</strong>
                <p className="text-gray-700 text-sm mt-1">
                  Index the result of a function (e.g., LOWER()). Enables efficient case-insensitive searches.
                </p>
              </div>
            </div>
            <RealWorldExample 
              title="Real-World Analogy"
              description="Think of indexes like a phone book. Without an index, you'd read every page to find a name. With an index (alphabetical order), you jump straight to the right section. Database indexes work the same way."
              example="Searching for 'New York' trips: Without index = check all 100,000 trips. With index on origin_city = check ~1,000 New York trips."
            />
          </EducationalPanel>

          <EducationalPanel title="Common Mistakes to Avoid" type="warning" defaultOpen={false}>
            <CommonMistakes 
              mistakes={[
                {
                  wrong: "Creating too many indexes",
                  correct: "Only index columns used in WHERE, JOIN, and ORDER BY clauses",
                  explanation: "Indexes speed up reads but slow down writes (INSERT/UPDATE/DELETE). Too many indexes hurt write performance."
                },
                {
                  wrong: "Wrong column order in composite indexes",
                  correct: "Put most selective column first: CREATE INDEX idx ON table(most_selective, less_selective)",
                  explanation: "PostgreSQL uses composite indexes left-to-right. Put the column that filters out most rows first."
                },
                {
                  wrong: "Not using EXPLAIN ANALYZE before optimizing",
                  correct: "Always run EXPLAIN ANALYZE first to see actual query performance",
                  explanation: "You can't optimize what you don't measure. EXPLAIN ANALYZE shows where queries are slow."
                }
              ]}
            />
          </EducationalPanel>
        </div>

        <PSQLReminder>
          <p className="text-sm text-gray-700">
            Connect to <code className="bg-gray-100 px-1 rounded">p2p_delivery</code> before creating or inspecting indexes: run{' '}
            <code className="bg-gray-100 px-1 rounded">psql -U postgres -d p2p_delivery</code>.
          </p>
        </PSQLReminder>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Composite Indexes</h2>
          <SQLEditor initialQuery={compositeIndexes} readOnly={true} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Partial Indexes</h2>
          <SQLEditor initialQuery={partialIndexes} readOnly={true} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Functional Indexes</h2>
          <SQLEditor initialQuery={functionalIndexes} readOnly={true} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Query Execution Plans</h2>
          <p className="text-gray-700 mb-4">
            Use EXPLAIN ANALYZE to see how PostgreSQL executes your queries and identify optimization opportunities.
          </p>
          <SQLEditor initialQuery={explainQuery} onExecute={handleExecuteQuery} />
          <QueryResults results={queryResults} error={queryError} />
        </div>

        <div className="mt-8 flex justify-between">
          <Link to="/part-6-matching-algorithm" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
            ← Previous: Part 6
          </Link>
          <Link to="/part-8-advanced-features" className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl">
            Next: Part 8 - Advanced Features →
          </Link>
        </div>
      </div>
    </div>
  );
}

