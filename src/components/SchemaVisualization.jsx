import React from 'react';

export default function SchemaVisualization({ schema }) {
  if (!schema) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Table Schema</h3>
      <div className="space-y-4">
        {schema.map((table, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2">
              <h4 className="text-white font-bold">{table.name}</h4>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Column</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Constraints</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col, colIdx) => (
                    <tr key={colIdx} className="border-b border-gray-100">
                      <td className="py-2 px-2 font-mono text-gray-900">{col.name}</td>
                      <td className="py-2 px-2 text-gray-700">{col.type}</td>
                      <td className="py-2 px-2 text-gray-600">
                        {col.constraints?.map((c, cIdx) => (
                          <span
                            key={cIdx}
                            className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs mr-1"
                          >
                            {c}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

