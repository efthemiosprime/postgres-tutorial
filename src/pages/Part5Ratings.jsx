import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SQLEditor from '../components/SQLEditor';
import QueryResults from '../components/QueryResults';
import EducationalPanel, { KeyConcept, CommonMistakes, RealWorldExample } from '../components/EducationalPanel';
import QueryExplainer from '../components/QueryExplainer';
import { GlossaryTerm } from '../components/Glossary';
import PSQLReminder from '../components/PSQLReminder';

export default function Part5Ratings() {
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const handleExecuteQuery = (query) => {
    setQueryError(null);
    setQueryResults({ success: true });
  };

  const createRatingsTable = `-- Create ENUM type for rating type
CREATE TYPE rating_type AS ENUM ('carrier_performance', 'shipper_accuracy', 'communication', 'timeliness', 'overall');

-- Create ratings table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    match_id INTEGER NOT NULL REFERENCES delivery_matches(id) ON DELETE CASCADE,
    rater_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rated_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    rating_type rating_type NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT prevent_self_rating CHECK (rater_id != rated_user_id),
    CONSTRAINT unique_rating_per_match_type UNIQUE (match_id, rater_id, rating_type)
);

-- Create indexes
CREATE INDEX idx_ratings_rated_user ON ratings(rated_user_id, rating_type);
CREATE INDEX idx_ratings_match ON ratings(match_id);
CREATE INDEX idx_ratings_public ON ratings(is_public) WHERE is_public = TRUE;`;

  const queryAverageRatings = `-- Calculate average rating for a user
SELECT 
    u.id,
    u.name,
    r.rating_type,
    ROUND(AVG(r.rating)::numeric, 2) as average_rating,
    COUNT(r.id) as rating_count
FROM users u
JOIN ratings r ON u.id = r.rated_user_id
WHERE u.id = 1  -- Replace with user ID
GROUP BY u.id, u.name, r.rating_type
ORDER BY r.rating_type;`;

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
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-600 mb-2">
                Part 5: Ratings Table
              </h1>
              <p className="text-lg text-gray-700">
                Create ratings table with proper relationships
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
              <li>Create ratings table with proper <GlossaryTerm term="FOREIGN KEY">relationships</GlossaryTerm></li>
              <li>Implement <GlossaryTerm term="UNIQUE Constraint">unique constraint</GlossaryTerm> to prevent duplicate ratings</li>
              <li>Use ENUM for rating types</li>
              <li>Insert sample ratings</li>
              <li>Calculate average ratings per user using aggregate functions</li>
            </ul>
          </EducationalPanel>

          <EducationalPanel title="Rating System Design" type="concept" defaultOpen={true}>
            <KeyConcept 
              term="Multi-Dimensional Rating System"
              definition="A rating system that allows users to rate different aspects of an experience separately, providing more detailed and useful feedback than a single overall rating."
              example="Instead of just '5 stars', users can rate: performance (5), communication (4), timeliness (5), accuracy (5)"
            />
            <p className="text-gray-700 mb-4 mt-4">
              Our rating system allows multiple types of ratings per match, enabling detailed feedback:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>carrier_performance:</strong> How well the carrier performed</li>
              <li><strong>shipper_accuracy:</strong> Accuracy of package description and requirements</li>
              <li><strong>communication:</strong> Quality of communication</li>
              <li><strong>timeliness:</strong> Punctuality of pickup/delivery</li>
              <li><strong>overall:</strong> Overall experience rating</li>
            </ul>
            <p className="text-gray-700 mt-4">
              The unique constraint ensures a user can only rate each aspect once per match.
            </p>
            <RealWorldExample 
              title="Real-World Analogy"
              description="Like restaurant reviews on Yelp - you can rate food quality, service, ambiance, and value separately, giving a more complete picture than just an overall rating."
              example="A carrier might be great at communication (5 stars) but sometimes late (3 stars). Multi-dimensional ratings capture this nuance."
            />
          </EducationalPanel>

          <EducationalPanel title="Common Mistakes to Avoid" type="warning" defaultOpen={false}>
            <CommonMistakes 
              mistakes={[
                {
                  wrong: "Allowing self-ratings",
                  correct: "Add CHECK constraint: CHECK (rater_id != rated_user_id)",
                  explanation: "Users shouldn't be able to rate themselves - it defeats the purpose of a rating system."
                },
                {
                  wrong: "Not preventing duplicate ratings per type",
                  correct: "Use UNIQUE constraint: UNIQUE (match_id, rater_id, rating_type)",
                  explanation: "Without this, a user could rate the same aspect multiple times, skewing averages."
                },
                {
                  wrong: "Not indexing rated_user_id",
                  correct: "Create index: CREATE INDEX idx_ratings_rated_user ON ratings(rated_user_id)",
                  explanation: "Calculating average ratings requires frequent lookups by rated_user_id. Indexes make this fast."
                }
              ]}
            />
          </EducationalPanel>
        </div>

        <PSQLReminder>
          <p className="text-sm text-gray-700">
            All rating queries run inside the <code className="bg-gray-100 px-1 rounded">p2p_delivery</code> database. Connect with&nbsp;
            <code className="bg-gray-100 px-1 rounded">psql -U postgres -d p2p_delivery</code> before executing the commands below.
          </p>
        </PSQLReminder>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Ratings Table</h2>
          <SQLEditor initialQuery={createRatingsTable} readOnly={true} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Query Average Ratings</h2>
          <QueryExplainer 
            query={queryAverageRatings}
            explanation={{
              purpose: "Calculates the average rating for each rating type for a specific user",
              keywords: ["SELECT", "JOIN", "AVG", "COUNT", "GROUP BY", "ORDER BY"],
              steps: [
                "SELECT u.id, u.name gets user information",
                "JOIN ratings r connects users with their ratings",
                "AVG(r.rating) calculates average rating",
                "COUNT(r.id) counts number of ratings",
                "GROUP BY groups results by user and rating type",
                "ORDER BY sorts by rating type"
              ]
            }}
          />
          <SQLEditor initialQuery={queryAverageRatings} onExecute={handleExecuteQuery} />
          <QueryResults results={queryResults} error={queryError} />
        </div>

        <div className="mt-8 flex justify-between">
          <Link to="/part-4-delivery-matches" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
            ← Previous: Part 4
          </Link>
          <Link to="/part-6-matching-algorithm" className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl">
            Next: Part 6 - Matching Algorithm →
          </Link>
        </div>
      </div>
    </div>
  );
}

