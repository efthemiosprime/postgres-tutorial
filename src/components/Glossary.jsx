import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const glossaryTerms = {
  'SERIAL': {
    definition: 'A PostgreSQL data type that automatically generates sequential integers. Equivalent to AUTO_INCREMENT in MySQL.',
    example: 'id SERIAL PRIMARY KEY creates an auto-incrementing ID'
  },
  'PRIMARY KEY': {
    definition: 'A constraint that uniquely identifies each row in a table. Only one PRIMARY KEY per table.',
    example: 'id SERIAL PRIMARY KEY ensures each user has a unique identifier'
  },
  'FOREIGN KEY': {
    definition: 'A constraint that links a column in one table to a PRIMARY KEY in another table, ensuring referential integrity.',
    example: 'carrier_id INTEGER REFERENCES users(id) links carrier_trips to users'
  },
  'ENUM': {
    definition: 'A PostgreSQL data type that restricts values to a predefined set of options.',
    example: "CREATE TYPE status AS ENUM ('active', 'inactive')"
  },
  'JSONB': {
    definition: 'Binary JSON format in PostgreSQL. Stores structured data without a fixed schema and supports indexing.',
    example: 'package_dimensions JSONB can store {"length": 30, "width": 20, "height": 15}'
  },
  'CHECK Constraint': {
    definition: 'A constraint that ensures data meets certain conditions. PostgreSQL rejects INSERT/UPDATE that violates it.',
    example: "CHECK (age >= 0) ensures age is never negative"
  },
  'UNIQUE Constraint': {
    definition: 'Ensures all values in a column are different. Prevents duplicate entries.',
    example: 'email VARCHAR(255) UNIQUE prevents duplicate email addresses'
  },
  'INDEX': {
    definition: 'A database structure that improves query performance by allowing faster data retrieval.',
    example: 'CREATE INDEX idx_email ON users(email) speeds up email lookups'
  },
  'VIEW': {
    definition: 'A virtual table based on the result of a SQL query. Simplifies complex queries.',
    example: 'CREATE VIEW active_users AS SELECT * FROM users WHERE is_active = TRUE'
  },
  'TRIGGER': {
    definition: 'A function that automatically executes when a specified event occurs (INSERT, UPDATE, DELETE).',
    example: 'A trigger can automatically update updated_at timestamp when a row changes'
  }
};

export function GlossaryTerm({ term, children }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const termData = glossaryTerms[term];

  if (!termData) {
    return <span className="font-semibold text-blue-600">{children || term}</span>;
  }

  return (
    <span className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-dotted cursor-help"
      >
        {children || term}
      </button>
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white rounded-lg shadow-xl p-4 text-sm">
          <div className="flex items-start justify-between mb-2">
            <strong className="text-white font-bold">{term}</strong>
            <button onClick={() => setShowTooltip(false)}>
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>
          <p className="text-gray-200 mb-2">{termData.definition}</p>
          {termData.example && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Example:</p>
              <code className="text-xs text-green-300">{termData.example}</code>
            </div>
          )}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </span>
  );
}

export function GlossaryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = Object.entries(glossaryTerms).filter(([term]) =>
    term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-40"
        title="Open Glossary"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">PostgreSQL Glossary</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-4">
                {filteredTerms.map(([term, data]) => (
                  <div key={term} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">{term}</h3>
                    <p className="text-gray-700 text-sm mb-2">{data.definition}</p>
                    {data.example && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Example:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">{data.example}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {filteredTerms.length === 0 && (
                <p className="text-center text-gray-500 py-8">No terms found matching "{searchTerm}"</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

