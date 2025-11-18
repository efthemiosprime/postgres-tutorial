import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function QueryResults({ results, error }) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Query Error</h3>
            <p className="text-red-700 text-sm font-mono">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  if (results.rows && results.rows.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <p className="text-blue-900">Query executed successfully. No rows returned.</p>
        </div>
      </div>
    );
  }

  if (results.rows && results.rows.length > 0) {
    const columns = Object.keys(results.rows[0]);
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-700">
            Results ({results.rows.length} row{results.rows.length !== 1 ? 's' : ''})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-3 text-sm text-gray-900 font-mono"
                    >
                      {row[col] === null ? (
                        <span className="text-gray-400 italic">NULL</span>
                      ) : typeof row[col] === 'object' ? (
                        <pre className="text-xs">{JSON.stringify(row[col], null, 2)}</pre>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <p className="text-green-900">Query executed successfully.</p>
      </div>
    </div>
  );
}

