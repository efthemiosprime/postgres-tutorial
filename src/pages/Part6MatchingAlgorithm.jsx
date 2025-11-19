import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SQLEditor from '../components/SQLEditor';
import QueryResults from '../components/QueryResults';
import EducationalPanel, { KeyConcept, StepByStep, RealWorldExample } from '../components/EducationalPanel';
import QueryExplainer from '../components/QueryExplainer';
import { GlossaryTerm } from '../components/Glossary';
import PSQLReminder from '../components/PSQLReminder';

export default function Part6MatchingAlgorithm() {
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const handleExecuteQuery = (query) => {
    setQueryError(null);
    setQueryResults({ success: true });
  };

  const findCompatibleTrips = `-- Find compatible trips for a package request
-- Match criteria: route, capacity, dates, status
SELECT 
    ct.id as trip_id,
    ct.carrier_id,
    u.name as carrier_name,
    ct.origin_city,
    ct.destination_city,
    ct.departure_date,
    ct.arrival_date,
    ct.available_weight_kg,
    ct.available_space_liters,
    ct.price_per_kg,
    pr.package_weight_kg,
    (ct.available_weight_kg - pr.package_weight_kg) as remaining_capacity,
    CASE 
        WHEN ct.origin_city = pr.pickup_city AND ct.destination_city = pr.delivery_city THEN 100
        WHEN ct.origin_city = pr.pickup_city THEN 50
        WHEN ct.destination_city = pr.delivery_city THEN 30
        ELSE 0
    END as route_match_score
FROM carrier_trips ct
JOIN users u ON ct.carrier_id = u.id
CROSS JOIN package_requests pr
WHERE pr.id = 1  -- Replace with package request ID
  AND ct.trip_status IN ('planning', 'active')
  AND pr.request_status = 'open'
  AND ct.available_weight_kg >= pr.package_weight_kg
  AND ct.departure_date <= pr.pickup_date_preferred
  AND ct.arrival_date <= pr.delivery_date_needed
ORDER BY route_match_score DESC, ct.price_per_kg ASC;`;

  const findCompatiblePackages = `-- Find compatible packages for a trip
SELECT 
    pr.id as package_id,
    pr.shipper_id,
    u.name as shipper_name,
    pr.pickup_city,
    pr.delivery_city,
    pr.package_weight_kg,
    pr.package_dimensions,
    pr.urgency_level,
    pr.max_price_budget,
    ct.price_per_kg * pr.package_weight_kg as estimated_cost
FROM package_requests pr
JOIN users u ON pr.shipper_id = u.id
CROSS JOIN carrier_trips ct
WHERE ct.id = 1  -- Replace with trip ID
  AND ct.trip_status IN ('planning', 'active')
  AND pr.request_status = 'open'
  AND ct.available_weight_kg >= pr.package_weight_kg
  AND ct.origin_city = pr.pickup_city
  AND ct.destination_city = pr.delivery_city
  AND ct.departure_date <= pr.pickup_date_preferred
  AND ct.arrival_date <= pr.delivery_date_needed
  AND (pr.max_price_budget IS NULL OR ct.price_per_kg * pr.package_weight_kg <= pr.max_price_budget)
ORDER BY pr.urgency_level DESC, estimated_cost ASC;`;

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
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
                Part 6: Matching Algorithm Queries
              </h1>
              <p className="text-lg text-gray-700">
                Write complex queries to match trips with packages
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
              <li>Write complex queries to find compatible trips for packages</li>
              <li>Match criteria: route, capacity, dates, status</li>
              <li>Use <GlossaryTerm term="INDEX">JOINs</GlossaryTerm>, WHERE clauses, and subqueries</li>
              <li>Calculate compatibility scores using CASE statements</li>
              <li>Find compatible packages for trips</li>
            </ul>
          </EducationalPanel>

          <EducationalPanel title="Matching Algorithm" type="concept" defaultOpen={true}>
            <KeyConcept 
              term="Matching Algorithm"
              definition="A query that finds compatible pairs by evaluating multiple criteria simultaneously. Uses JOINs, WHERE filters, and scoring to rank matches by compatibility."
              example="Finds trips where: route matches, capacity is sufficient, dates work, status is active, and price fits budget"
            />
            <p className="text-gray-700 mb-4 mt-4">
              Our matching algorithm considers multiple factors:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Route Matching:</strong> Origin and destination cities must align</li>
              <li><strong>Capacity Matching:</strong> Available weight must be {'>='} package weight</li>
              <li><strong>Date Matching:</strong> Trip dates must accommodate package pickup and delivery deadlines</li>
              <li><strong>Status Filtering:</strong> Only 'planning' or 'active' trips, only 'open' packages</li>
              <li><strong>Budget Matching:</strong> Estimated cost must be within shipper's budget</li>
            </ul>
            <RealWorldExample 
              title="Real-World Analogy"
              description="Like a dating app matching algorithm - it considers multiple factors (location, age, interests) and scores compatibility. Our algorithm does the same for trips and packages."
              example="Package needs NYC to LA delivery. Algorithm finds trips going NYC to LA (perfect match = 100 points), NYC to Chicago (partial = 50 points), or Chicago to LA (partial = 30 points)."
            />
          </EducationalPanel>
        </div>

        <PSQLReminder>
          <p className="text-sm text-gray-700">
            Run matching queries inside the <code className="bg-gray-100 px-1 rounded">p2p_delivery</code> database. Connect with{' '}
            <code className="bg-gray-100 px-1 rounded">psql -U postgres -d p2p_delivery</code> before executing the SQL below.
          </p>
        </PSQLReminder>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Compatible Trips for a Package</h2>
          <p className="text-gray-700 mb-4">
            This query finds all trips that could carry a specific package, ordered by route match score.
          </p>
          <QueryExplainer 
            query={findCompatibleTrips}
            explanation={{
              purpose: "Finds all trips compatible with a package request, scoring them by route match quality",
              keywords: ["SELECT", "JOIN", "CROSS JOIN", "WHERE", "CASE", "ORDER BY"],
              steps: [
                "CROSS JOIN creates all possible trip-package combinations",
                "WHERE filters to compatible matches (route, capacity, dates, status)",
                "CASE statement calculates route_match_score (100=perfect, 50=origin match, 30=destination match)",
                "ORDER BY sorts by score (best matches first), then price (cheapest first)"
              ]
            }}
          />
          <SQLEditor initialQuery={findCompatibleTrips} onExecute={handleExecuteQuery} />
          <QueryResults results={queryResults} error={queryError} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Compatible Packages for a Trip</h2>
          <p className="text-gray-700 mb-4">
            This query finds all packages that could be carried on a specific trip, ordered by urgency and cost.
          </p>
          <QueryExplainer 
            query={findCompatiblePackages}
            explanation={{
              purpose: "Finds all packages that could be carried on a specific trip",
              keywords: ["SELECT", "JOIN", "CROSS JOIN", "WHERE", "ORDER BY"],
              steps: [
                "CROSS JOIN creates all possible trip-package combinations",
                "WHERE filters to compatible matches (exact route match, capacity, dates, status, budget)",
                "Calculates estimated_cost = price_per_kg × package_weight",
                "ORDER BY sorts by urgency (most urgent first), then cost (cheapest first)"
              ]
            }}
          />
          <SQLEditor initialQuery={findCompatiblePackages} onExecute={handleExecuteQuery} />
          <QueryResults results={queryResults} error={queryError} />
        </div>

        <div className="mt-8 flex justify-between">
          <Link to="/part-5-ratings" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
            ← Previous: Part 5
          </Link>
          <Link to="/part-7-indexing-performance" className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl">
            Next: Part 7 - Indexing & Performance →
          </Link>
        </div>
      </div>
    </div>
  );
}

