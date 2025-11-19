import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SQLEditor from '../components/SQLEditor';
import QueryResults from '../components/QueryResults';
import EducationalPanel, { KeyConcept, CommonMistakes, StepByStep, RealWorldExample } from '../components/EducationalPanel';
import SchemaVisualization from '../components/SchemaVisualization';
import QueryExplainer from '../components/QueryExplainer';
import { GlossaryTerm } from '../components/Glossary';
import PSQLReminder from '../components/PSQLReminder';
import { part2Queries } from '../utils/sqlQueries';
import { carrierTripsSchema } from '../utils/schemas';

export default function Part2CarrierTrips() {
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const handleExecuteQuery = (query) => {
    setQueryError(null);
    if (query.toLowerCase().includes('select')) {
      setQueryResults({
        rows: [
          { id: 1, carrier_name: 'Alice Johnson', origin_city: 'New York', destination_city: 'Los Angeles', trip_status: 'planning', departure_date: '2024-03-15' }
        ]
      });
    } else {
      setQueryResults({ success: true });
    }
  };

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
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                Part 2: Carrier Trips Table
              </h1>
              <p className="text-lg text-gray-700">
                Create carrier_trips table with ENUMs, foreign keys, and indexes
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
              <li>Create <GlossaryTerm term="ENUM">ENUM</GlossaryTerm> types for status and transportation method</li>
              <li>Create carrier_trips table with <GlossaryTerm term="FOREIGN KEY">foreign key</GlossaryTerm> to users</li>
              <li>Add indexes for common query patterns</li>
              <li>Insert sample trip data</li>
              <li>Write queries to find active trips by city</li>
            </ul>
          </EducationalPanel>

          <EducationalPanel title="PostgreSQL ENUM Types" type="concept" defaultOpen={true}>
            <KeyConcept 
              term="ENUM"
              definition="A PostgreSQL data type that restricts values to a predefined set of options. Unlike VARCHAR with CHECK constraints, ENUMs are stored more efficiently and provide better error messages."
              example="CREATE TYPE trip_status AS ENUM ('planning', 'active', 'completed')"
            />
            <p className="text-gray-700 mb-4 mt-4">
              ENUMs are perfect for status fields and categorical data because they:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Ensure data integrity by preventing invalid values</li>
              <li>Improve query performance with better indexing</li>
              <li>Make the schema self-documenting</li>
              <li>Provide better error messages than VARCHAR constraints</li>
            </ul>
            <RealWorldExample 
              title="Real-World Analogy"
              description="Think of ENUMs like a dropdown menu - users can only select from predefined options. Just like a form that only allows 'Mr.', 'Mrs.', or 'Ms.' for titles, ENUMs restrict database values to specific choices."
              example="A trip_status ENUM ensures trips can only be 'planning', 'active', 'in_transit', 'completed', or 'cancelled' - nothing else!"
            />
          </EducationalPanel>

          <EducationalPanel title="Common Mistakes to Avoid" type="warning" defaultOpen={false}>
            <CommonMistakes 
              mistakes={[
                {
                  wrong: "Using VARCHAR for status fields: status VARCHAR(20)",
                  correct: "Use ENUM: CREATE TYPE status AS ENUM ('active', 'inactive')",
                  explanation: "ENUMs provide better data integrity, performance, and error messages than VARCHAR with CHECK constraints."
                },
                {
                  wrong: "Forgetting to create ENUM before using it in table",
                  correct: "Always CREATE TYPE before CREATE TABLE",
                  explanation: "PostgreSQL requires ENUM types to exist before they can be used in table definitions."
                },
                {
                  wrong: "Not adding indexes on foreign keys",
                  correct: "Create index: CREATE INDEX idx_carrier_trips_carrier ON carrier_trips(carrier_id)",
                  explanation: "Foreign key columns are frequently used in JOINs. Indexes significantly improve query performance."
                }
              ]}
            />
          </EducationalPanel>

          <EducationalPanel title="Table Schema: Carrier Trips" defaultOpen={false}>
            <SchemaVisualization schema={[carrierTripsSchema]} />
          </EducationalPanel>
        </div>

        <PSQLReminder>
          <p className="text-sm text-gray-700">
            Connect to the tutorial database you created earlier:
            <code className="bg-gray-100 px-1 rounded ml-2">psql -U postgres -d p2p_delivery</code>. Stay in this database for the rest
            of the tutorial.
          </p>
        </PSQLReminder>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Create ENUM Types</h2>
          <EducationalPanel title="Understanding ENUM Creation" type="info" defaultOpen={false}>
            <StepByStep 
              steps={[
                {
                  title: "Define the ENUM type name",
                  description: "Choose a descriptive name that indicates what values it will hold.",
                  code: "CREATE TYPE trip_status AS ENUM"
                },
                {
                  title: "List all possible values",
                  description: "Enclose each value in single quotes and separate with commas. Order matters - this is the sort order.",
                  code: "('planning', 'active', 'in_transit', 'completed', 'cancelled')"
                },
                {
                  title: "Use in table definition",
                  description: "Once created, use the ENUM type like any other data type in your table.",
                  code: "trip_status trip_status DEFAULT 'planning'"
                }
              ]}
            />
          </EducationalPanel>
          <SQLEditor initialQuery={part2Queries.createEnums} readOnly={true} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Create Carrier Trips Table</h2>
          <p className="text-gray-700 mb-4">
            Notice the foreign key constraint, CHECK constraints for dates and positive values, 
            and multiple indexes for common query patterns.
          </p>
          <SQLEditor initialQuery={part2Queries.createCarrierTripsTable} readOnly={true} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Insert Sample Trips</h2>
          <SQLEditor initialQuery={part2Queries.insertSampleTrips} onExecute={handleExecuteQuery} />
          <QueryResults results={queryResults} error={queryError} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Query Active Trips</h2>
          <QueryExplainer 
            query={part2Queries.queryActiveTrips}
            explanation={{
              purpose: "Finds all trips from a specific city that are currently planning or active",
              keywords: ["SELECT", "FROM", "JOIN", "WHERE", "IN", "ORDER BY"],
              steps: [
                "SELECT ct.*, u.name retrieves all trip columns plus the carrier's name",
                "JOIN users u connects trips with their carriers",
                "WHERE filters by origin city and status",
                "IN ('planning', 'active') matches multiple status values",
                "ORDER BY sorts results by departure date"
              ]
            }}
          />
          <SQLEditor initialQuery={part2Queries.queryActiveTrips} onExecute={handleExecuteQuery} />
          <QueryResults results={queryResults} error={queryError} />
        </div>

        <div className="mt-8 flex justify-between">
          <Link to="/part-1-database-setup" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
            ← Previous: Part 1
          </Link>
          <Link to="/part-3-package-requests" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
            Next: Part 3 - Package Requests →
          </Link>
        </div>
      </div>
    </div>
  );
}

