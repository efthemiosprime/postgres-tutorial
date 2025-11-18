import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SQLEditor from '../components/SQLEditor';
import QueryResults from '../components/QueryResults';
import EducationalPanel, { KeyConcept, CommonMistakes, RealWorldExample } from '../components/EducationalPanel';
import { GlossaryTerm } from '../components/Glossary';

export default function Part8AdvancedFeatures() {
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const handleExecuteQuery = (query) => {
    setQueryError(null);
    setQueryResults({ success: true });
  };

  const createViews = `-- Create views for common queries

-- View: Active matches with user details
CREATE VIEW active_matches AS
SELECT 
    dm.id,
    dm.match_status,
    dm.agreed_price,
    ct.origin_city as trip_origin,
    ct.destination_city as trip_destination,
    pr.pickup_city as package_pickup,
    pr.delivery_city as package_delivery,
    carrier.name as carrier_name,
    shipper.name as shipper_name,
    dm.created_at,
    dm.confirmed_at,
    dm.picked_up_at,
    dm.delivered_at
FROM delivery_matches dm
JOIN carrier_trips ct ON dm.carrier_trip_id = ct.id
JOIN package_requests pr ON dm.package_request_id = pr.id
JOIN users carrier ON dm.carrier_id = carrier.id
JOIN users shipper ON dm.shipper_id = shipper.id
WHERE dm.match_status NOT IN ('cancelled', 'delivered');

-- View: User statistics
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.is_carrier,
    u.is_shipper,
    COUNT(DISTINCT CASE WHEN u.id = ct.carrier_id THEN ct.id END) as total_trips,
    COUNT(DISTINCT CASE WHEN u.id = pr.shipper_id THEN pr.id END) as total_packages,
    COUNT(DISTINCT CASE WHEN u.id = dm.carrier_id THEN dm.id END) as carrier_matches,
    COUNT(DISTINCT CASE WHEN u.id = dm.shipper_id THEN dm.id END) as shipper_matches,
    ROUND(AVG(CASE WHEN r.rated_user_id = u.id THEN r.rating END)::numeric, 2) as avg_rating
FROM users u
LEFT JOIN carrier_trips ct ON u.id = ct.carrier_id
LEFT JOIN package_requests pr ON u.id = pr.shipper_id
LEFT JOIN delivery_matches dm ON u.id = dm.carrier_id OR u.id = dm.shipper_id
LEFT JOIN ratings r ON u.id = r.rated_user_id
GROUP BY u.id, u.name, u.email, u.is_carrier, u.is_shipper;`;

  const createFunctions = `-- Function: Update match status with validation
CREATE OR REPLACE FUNCTION update_match_status(
    match_id INTEGER,
    new_status match_status
) RETURNS BOOLEAN AS $$
DECLARE
    current_status match_status;
BEGIN
    -- Get current status
    SELECT match_status INTO current_status
    FROM delivery_matches
    WHERE id = match_id;
    
    -- Validate status transition
    IF current_status = 'cancelled' OR current_status = 'delivered' THEN
        RAISE EXCEPTION 'Cannot change status from %', current_status;
    END IF;
    
    -- Update status and timestamps
    UPDATE delivery_matches
    SET match_status = new_status,
        updated_at = CURRENT_TIMESTAMP,
        confirmed_at = CASE WHEN new_status = 'confirmed' THEN CURRENT_TIMESTAMP ELSE confirmed_at END,
        picked_up_at = CASE WHEN new_status = 'picked_up' THEN CURRENT_TIMESTAMP ELSE picked_up_at END,
        delivered_at = CASE WHEN new_status = 'delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END
    WHERE id = match_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;`;

  const createTriggers = `-- Trigger: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carrier_trips_updated_at
    BEFORE UPDATE ON carrier_trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_package_requests_updated_at
    BEFORE UPDATE ON package_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_matches_updated_at
    BEFORE UPDATE ON delivery_matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at
    BEFORE UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();`;

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
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-2">
                Part 8: Advanced Features
              </h1>
              <p className="text-lg text-gray-700">
                Views, functions, triggers, and database-level validation
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
              <li>Create <GlossaryTerm term="VIEW">views</GlossaryTerm> for common queries</li>
              <li>Write functions for status updates and business logic</li>
              <li>Implement <GlossaryTerm term="TRIGGER">triggers</GlossaryTerm> for automatic timestamp updates</li>
              <li>Add database-level validation</li>
              <li>Understand when to use views vs. functions vs. triggers</li>
            </ul>
          </EducationalPanel>

          <EducationalPanel title="Advanced PostgreSQL Features" type="concept" defaultOpen={true}>
            <KeyConcept 
              term="Database Views"
              definition="Virtual tables based on SQL queries. They don't store data but provide a simplified interface to complex queries. Like a saved query you can query like a table."
              example="CREATE VIEW active_users AS SELECT * FROM users WHERE is_active = TRUE"
            />
            <KeyConcept 
              term="Stored Functions"
              definition="Reusable code blocks written in PL/pgSQL (PostgreSQL's procedural language). Can accept parameters, perform complex logic, and return values."
              example="Functions can validate data, calculate values, or perform multi-step operations atomically."
            />
            <KeyConcept 
              term="Triggers"
              definition="Automatically executed functions that run before or after INSERT, UPDATE, or DELETE operations. Used for maintaining data consistency and automatic updates."
              example="A trigger can automatically update updated_at timestamp whenever a row is modified."
            />
            <div className="space-y-4 mt-4">
              <div>
                <strong className="text-gray-900">When to Use Views:</strong>
                <p className="text-gray-700 text-sm mt-1">
                  Simplify complex queries, provide consistent data access, hide complexity from applications.
                </p>
              </div>
              <div>
                <strong className="text-gray-900">When to Use Functions:</strong>
                <p className="text-gray-700 text-sm mt-1">
                  Business logic, data validation, complex calculations, atomic multi-step operations.
                </p>
              </div>
              <div>
                <strong className="text-gray-900">When to Use Triggers:</strong>
                <p className="text-gray-700 text-sm mt-1">
                  Automatic updates (timestamps), maintaining referential integrity, audit logging, data transformation.
                </p>
              </div>
            </div>
            <RealWorldExample 
              title="Real-World Analogy"
              description="Views are like shortcuts on your desktop - they point to complex locations but make access simple. Functions are like recipes - reusable instructions for specific tasks. Triggers are like automatic reminders - they do things automatically when certain events happen."
              example="View: 'Active Matches' shortcut to complex JOIN query. Function: 'Update Status' recipe that validates before updating. Trigger: Auto-update timestamp reminder when data changes."
            />
          </EducationalPanel>

          <EducationalPanel title="Common Mistakes to Avoid" type="warning" defaultOpen={false}>
            <CommonMistakes 
              mistakes={[
                {
                  wrong: "Putting too much business logic in triggers",
                  correct: "Use triggers for simple, automatic tasks. Use functions for complex logic.",
                  explanation: "Triggers should be simple and fast. Complex logic in triggers can cause performance issues and make debugging difficult."
                },
                {
                  wrong: "Creating views that are too complex",
                  correct: "Keep views simple. Break complex views into multiple simpler views.",
                  explanation: "Complex views can be slow and hard to maintain. Simpler views are easier to optimize and understand."
                },
                {
                  wrong: "Not handling errors in functions",
                  correct: "Always include error handling: BEGIN...EXCEPTION...END blocks",
                  explanation: "Functions without error handling can cause transactions to fail unexpectedly. Always handle potential errors gracefully."
                }
              ]}
            />
          </EducationalPanel>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Views</h2>
          <p className="text-gray-700 mb-4">
            Views simplify complex queries and provide a consistent interface for common data access patterns.
          </p>
          <SQLEditor initialQuery={createViews} readOnly={true} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Functions</h2>
          <p className="text-gray-700 mb-4">
            Functions encapsulate business logic and ensure consistent status transitions.
          </p>
          <SQLEditor initialQuery={createFunctions} readOnly={true} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Triggers</h2>
          <p className="text-gray-700 mb-4">
            Triggers automatically update timestamps whenever records are modified, ensuring data consistency.
          </p>
          <SQLEditor initialQuery={createTriggers} readOnly={true} />
        </div>

        <EducationalPanel title="Congratulations!" defaultOpen={true}>
          <p className="text-gray-700 mb-4">
            You've completed the PostgreSQL tutorial! You've learned:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Database design and normalization</li>
            <li>PostgreSQL-specific features (ENUMs, JSONB, indexes)</li>
            <li>Complex query writing and optimization</li>
            <li>Performance tuning with indexes</li>
            <li>Advanced features (views, functions, triggers)</li>
          </ul>
          <p className="text-gray-700 mt-4">
            You now have a complete, production-ready database schema for a peer-to-peer delivery platform!
          </p>
        </EducationalPanel>

        <div className="mt-8 flex justify-between">
          <Link to="/part-7-indexing-performance" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
            ← Previous: Part 7
          </Link>
          <Link to="/" className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg hover:shadow-xl">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

