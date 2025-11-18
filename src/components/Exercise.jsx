import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Code } from 'lucide-react';
import SQLEditor from './SQLEditor';

export default function Exercise({ 
  title, 
  description, 
  instructions, 
  solution, 
  hints = [],
  onCheck 
}) {
  const [userSolution, setUserSolution] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleCheck = () => {
    if (onCheck) {
      const result = onCheck(userSolution);
      setIsCorrect(result);
    } else {
      // Simple check: compare normalized SQL
      const normalized = (sql) => sql.toLowerCase().replace(/\s+/g, ' ').trim();
      setIsCorrect(normalized(userSolution) === normalized(solution));
    }
  };

  const showNextHint = () => {
    if (hintIndex < hints.length - 1) {
      setHintIndex(hintIndex + 1);
    } else {
      setShowSolution(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-700 mb-3">{description}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
        <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
        <p className="text-gray-700 text-sm">{instructions}</p>
      </div>

      <div className="mb-4">
        <SQLEditor 
          initialQuery={userSolution}
          onExecute={(query) => setUserSolution(query)}
          readOnly={false}
        />
      </div>

      {hints.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              if (!showHint && hintIndex === 0) setHintIndex(0);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-lg transition-colors text-sm font-semibold"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          
          {showHint && hints[hintIndex] && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900">{hints[hintIndex]}</p>
              {hintIndex < hints.length - 1 && (
                <button
                  onClick={showNextHint}
                  className="mt-2 text-xs text-yellow-700 hover:text-yellow-900 underline"
                >
                  Next Hint →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleCheck}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Check Solution
        </button>
        
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors text-sm"
        >
          {showSolution ? 'Hide' : 'Show'} Solution
        </button>
      </div>

      {isCorrect !== null && (
        <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {isCorrect ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Correct! 🎉</p>
                <p className="text-sm text-green-700 mt-1">Great job! Your solution is correct.</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900">Not quite right</p>
                <p className="text-sm text-red-700 mt-1">Try again or check the solution for reference.</p>
              </div>
            </>
          )}
        </div>
      )}

      {showSolution && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
          <SQLEditor initialQuery={solution} readOnly={true} />
        </div>
      )}
    </div>
  );
}

