import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SQLEditor from '../components/SQLEditor';
import QueryResults from '../components/QueryResults';
import EducationalPanel, { KeyConcept, CommonMistakes, RealWorldExample } from '../components/EducationalPanel';
import { GlossaryTerm } from '../components/Glossary';
import PSQLReminder from '../components/PSQLReminder';

export default function Part4DeliveryMatches() {
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const handleExecuteQuery = (query) => {
    setQueryError(null);
    setQueryResults({ success: true });
  };

  const createDeliveryMatchesTable = `-- Create ENUM type for match status
CREATE TYPE match_status AS ENUM ('pending', 'confirmed', 'picked_up', 'in_transit', 'delivered', 'cancelled');

-- Create delivery_matches table
CREATE TABLE delivery_matches (
    id SERIAL PRIMARY KEY,
    carrier_trip_id INTEGER NOT NULL REFERENCES carrier_trips(id) ON DELETE CASCADE,
    package_request_id INTEGER NOT NULL REFERENCES package_requests(id) ON DELETE CASCADE,
    carrier_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shipper_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agreed_price DECIMAL(10, 2) NOT NULL CHECK (agreed_price >= 0),
    match_status match_status DEFAULT 'pending',
    pickup_confirmation_code VARCHAR(6),
    delivery_confirmation_code VARCHAR(6),
    tracking_notes JSONB,
    pickup_photo TEXT,
    delivery_photo TEXT,
    confirmed_at TIMESTAMP,
    picked_up_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_trip_package UNIQUE (carrier_trip_id, package_request_id),
    CONSTRAINT valid_lifecycle CHECK (
        (picked_up_at IS NULL OR confirmed_at IS NOT NULL) AND
        (delivered_at IS NULL OR picked_up_at IS NOT NULL)
    )
);

-- Create indexes
CREATE INDEX idx_delivery_matches_carrier ON delivery_matches(carrier_id, match_status);
CREATE INDEX idx_delivery_matches_shipper ON delivery_matches(shipper_id, match_status);
CREATE INDEX idx_delivery_matches_status ON delivery_matches(match_status);`;

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
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 mb-2">
                Part 4: Delivery Matches Table
              </h1>
              <p className="text-lg text-gray-700">
                Connect carrier trips with package requests
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
              <li>Create delivery_matches table with multiple <GlossaryTerm term="FOREIGN KEY">foreign keys</GlossaryTerm></li>
              <li>Implement <GlossaryTerm term="UNIQUE Constraint">unique constraint</GlossaryTerm> on trip + package combination</li>
              <li>Use ENUM for match status</li>
              <li>Add lifecycle timestamp columns</li>
              <li>Track delivery progress through status changes</li>
            </ul>
          </EducationalPanel>

          <EducationalPanel title="Junction Table Design" type="concept" defaultOpen={true}>
            <KeyConcept 
              term="Junction Table"
              definition="A table that connects two other tables in a many-to-many relationship. Also called a 'bridge table' or 'linking table'. It contains foreign keys to both tables it connects."
              example="delivery_matches connects carrier_trips and package_requests, allowing one trip to carry multiple packages and one package to be matched with multiple trips."
            />
            <p className="text-gray-700 mb-4 mt-4">
              The <code className="bg-gray-100 px-1 rounded">delivery_matches</code> table is a junction table that connects 
              carrier trips with package requests. Key design features:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Unique Constraint:</strong> Prevents the same trip-package pair from being matched twice</li>
              <li><strong>Lifecycle Timestamps:</strong> Track when matches are confirmed, picked up, and delivered</li>
              <li><strong>Confirmation Codes:</strong> 6-character codes for pickup and delivery verification</li>
              <li><strong>CHECK Constraint:</strong> Ensures logical progression of status (confirmed → picked up → delivered)</li>
            </ul>
            <RealWorldExample 
              title="Real-World Analogy"
              description="Think of delivery_matches like a booking system. A flight (carrier_trip) can have multiple passengers (packages), and each passenger has one booking (delivery_match) that tracks their specific journey details."
              example="Trip #123 from NYC to LA can carry Package A and Package B. Each gets its own delivery_match record with unique confirmation codes and timestamps."
            />
          </EducationalPanel>

          <EducationalPanel title="Common Mistakes to Avoid" type="warning" defaultOpen={false}>
            <CommonMistakes 
              mistakes={[
                {
                  wrong: "Not using UNIQUE constraint on trip+package combination",
                  correct: "Add: CONSTRAINT unique_trip_package UNIQUE (carrier_trip_id, package_request_id)",
                  explanation: "Without this, the same trip and package could be matched multiple times, causing data inconsistency."
                },
                {
                  wrong: "Missing lifecycle timestamp columns",
                  correct: "Include: confirmed_at, picked_up_at, delivered_at TIMESTAMP",
                  explanation: "These timestamps are crucial for tracking delivery progress and generating reports."
                },
                {
                  wrong: "Not validating status progression",
                  correct: "Use CHECK constraint to ensure: delivered_at requires picked_up_at, picked_up_at requires confirmed_at",
                  explanation: "Prevents invalid state transitions like marking something as delivered before it's picked up."
                }
              ]}
            />
          </EducationalPanel>
        </div>

        <PSQLReminder>
          <p className="text-sm text-gray-700">
            Connect to the <code className="bg-gray-100 px-1 rounded">p2p_delivery</code> database so the delivery matching tables are
            available: <code className="bg-gray-100 px-1 rounded">psql -U postgres -d p2p_delivery</code>.
          </p>
        </PSQLReminder>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Delivery Matches Table</h2>
          <SQLEditor initialQuery={createDeliveryMatchesTable} readOnly={true} />
        </div>

        <div className="mt-8 flex justify-between">
          <Link to="/part-3-package-requests" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
            ← Previous: Part 3
          </Link>
          <Link to="/part-5-ratings" className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl">
            Next: Part 5 - Ratings →
          </Link>
        </div>
      </div>
    </div>
  );
}

