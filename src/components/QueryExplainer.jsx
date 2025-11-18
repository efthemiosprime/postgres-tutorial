import React, { useState } from 'react';
import { Info, ChevronRight } from 'lucide-react';

export default function QueryExplainer({ query, explanation }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!explanation) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Query Explanation</span>
        </div>
        <ChevronRight className={`w-5 h-5 text-blue-600 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-4 space-y-3">
          {explanation.steps && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Step-by-step:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                {explanation.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          
          {explanation.keywords && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key SQL Keywords:</h4>
              <div className="flex flex-wrap gap-2">
                {explanation.keywords.map((keyword, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {explanation.purpose && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Purpose:</h4>
              <p className="text-sm text-gray-700">{explanation.purpose}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

