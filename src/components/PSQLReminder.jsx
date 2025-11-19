import React from 'react';
import { Terminal } from 'lucide-react';

export default function PSQLReminder({ database = 'p2p_delivery', children, footnote }) {
  return (
    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
          <Terminal className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h4 className="text-gray-900 font-semibold">PSQL Reminder</h4>
          <p className="text-sm text-gray-700">
            Before running the SQL below, open your terminal and connect to PostgreSQL using the{' '}
            <code className="bg-gray-100 px-1 rounded">psql</code> interactive shell.
          </p>
        </div>
      </div>
      <pre className="text-sm text-green-200 bg-gray-900 rounded-lg p-3 overflow-x-auto mb-3">
psql -U postgres -d {database}
      </pre>
      <p className="text-xs text-gray-600 mb-2">
        Tip: If your server runs on a different host or port, add{' '}
        <code className="bg-gray-100 px-1 rounded">-h your_host -p 5432</code>. Exit psql anytime with{' '}
        <code className="bg-gray-100 px-1 rounded">\q</code>.
      </p>
      {children && <div className="text-sm text-gray-700">{children}</div>}
      {footnote && <div className="text-xs text-gray-500 mt-2">{footnote}</div>}
    </div>
  );
}


