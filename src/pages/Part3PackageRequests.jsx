import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SQLEditor from '../components/SQLEditor';
import QueryResults from '../components/QueryResults';
import EducationalPanel, { KeyConcept, CommonMistakes, RealWorldExample } from '../components/EducationalPanel';
import { GlossaryTerm } from '../components/Glossary';

export default function Part3PackageRequests() {
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const handleExecuteQuery = (query) => {
    setQueryError(null);
    setQueryResults({ success: true });
  };

  const createPackageRequestsTable = `-- Create ENUM types for urgency and status
CREATE TYPE urgency_level AS ENUM ('flexible', 'normal', 'urgent', 'express');
CREATE TYPE request_status AS ENUM ('open', 'matched', 'picked_up', 'in_transit', 'delivered', 'cancelled');

-- Create package_requests table
CREATE TABLE package_requests (
    id SERIAL PRIMARY KEY,
    shipper_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pickup_address TEXT NOT NULL,
    pickup_city VARCHAR(100) NOT NULL,
    pickup_country VARCHAR(100) NOT NULL,
    pickup_lat DECIMAL(10, 8),
    pickup_lng DECIMAL(11, 8),
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_country VARCHAR(100) NOT NULL,
    delivery_lat DECIMAL(10, 8),
    delivery_lng DECIMAL(11, 8),
    package_weight_kg DECIMAL(10, 2) NOT NULL CHECK (package_weight_kg > 0),
    package_dimensions JSONB,
    package_type VARCHAR(50),
    package_value DECIMAL(10, 2),
    urgency_level urgency_level DEFAULT 'normal',
    pickup_date_preferred DATE,
    delivery_date_needed DATE NOT NULL,
    pickup_date_flexible BOOLEAN DEFAULT TRUE,
    max_price_budget DECIMAL(10, 2),
    request_status request_status DEFAULT 'open',
    package_description TEXT,
    special_handling_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_delivery_date CHECK (delivery_date_needed >= pickup_date_preferred)
);

-- Create indexes for matching queries
CREATE INDEX idx_package_requests_shipper ON package_requests(shipper_id, request_status);
CREATE INDEX idx_package_requests_route ON package_requests(pickup_city, delivery_city);
CREATE INDEX idx_package_requests_status ON package_requests(request_status);
CREATE INDEX idx_package_requests_dates ON package_requests(pickup_date_preferred, delivery_date_needed);`;

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
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                Part 3: Package Requests Table
              </h1>
              <p className="text-lg text-gray-700">
                Create package_requests table with JSON columns and ENUMs
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
              <li>Use <GlossaryTerm term="JSONB">JSONB</GlossaryTerm> columns for flexible data storage</li>
              <li>Create ENUMs for urgency and status</li>
              <li>Add indexes optimized for matching queries</li>
              <li>Insert sample package requests</li>
              <li>Query open requests by route</li>
            </ul>
          </EducationalPanel>

          <EducationalPanel title="PostgreSQL JSONB Columns" type="concept" defaultOpen={true}>
            <KeyConcept 
              term="JSONB"
              definition="PostgreSQL's binary JSON format. Stores structured data without a fixed schema, supports indexing, and is more efficient than regular JSON (text format)."
              example='package_dimensions JSONB can store {"length": 30, "width": 20, "height": 15, "unit": "cm"}'
            />
            <p className="text-gray-700 mb-4 mt-4">
              We use JSONB for <code className="bg-gray-100 px-1 rounded">package_dimensions</code> 
              because package sizes vary and we need flexibility. JSONB:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Stores structured data without a fixed schema</li>
              <li>Supports indexing and querying</li>
              <li>Validates JSON syntax</li>
              <li>Is more efficient than JSON (text format)</li>
            </ul>
            <RealWorldExample 
              title="Why JSONB for Package Dimensions?"
              description="Different packages have different dimensions. A book might need length/width/height, while a tube might need length/diameter. JSONB lets us store flexible structures without creating multiple columns."
              example='Small box: {"length": 20, "width": 15, "height": 10, "unit": "cm"} | Tube: {"length": 100, "diameter": 5, "unit": "cm"}'
            />
          </EducationalPanel>

          <EducationalPanel title="Common Mistakes to Avoid" type="warning" defaultOpen={false}>
            <CommonMistakes 
              mistakes={[
                {
                  wrong: "Using JSON instead of JSONB",
                  correct: "Use JSONB: package_dimensions JSONB",
                  explanation: "JSONB is binary format, faster for queries and supports indexing. JSON is just text storage."
                },
                {
                  wrong: "Not validating JSON structure in application",
                  correct: "Validate JSON structure before inserting",
                  explanation: "While PostgreSQL validates JSON syntax, it doesn't validate structure. Ensure your application validates the JSON structure."
                },
                {
                  wrong: "Storing too much data in JSONB",
                  correct: "Use JSONB for flexible, variable data only",
                  explanation: "If data structure is always the same, use regular columns. JSONB is best for truly variable structures."
                }
              ]}
            />
          </EducationalPanel>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Package Requests Table</h2>
          <SQLEditor initialQuery={createPackageRequestsTable} readOnly={true} />
        </div>

        <div className="mt-8 flex justify-between">
          <Link to="/part-2-carrier-trips" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
            ← Previous: Part 2
          </Link>
          <Link to="/part-4-delivery-matches" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl">
            Next: Part 4 - Delivery Matches →
          </Link>
        </div>
      </div>
    </div>
  );
}

