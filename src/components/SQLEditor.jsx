import React, { useState } from 'react';
import { Play, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function SQLEditor({ initialQuery = '', onExecute, readOnly = false }) {
  const [query, setQuery] = useState(initialQuery);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    if (onExecute && query.trim()) {
      onExecute(query);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <span className="text-white text-sm font-semibold">SQL Query</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Copy query"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          {!readOnly && onExecute && (
            <button
              onClick={handleExecute}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
            >
              <Play className="w-4 h-4" />
              Execute
            </button>
          )}
        </div>
      </div>
      {readOnly ? (
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language="sql"
            style={vscDarkPlus}
            customStyle={{ margin: 0, borderRadius: 0 }}
          >
            {query}
          </SyntaxHighlighter>
        </div>
      ) : (
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 font-mono text-sm border-0 focus:outline-none resize-none"
          rows={query.split('\n').length + 2}
          placeholder="Enter your SQL query here..."
        />
      )}
    </div>
  );
}

