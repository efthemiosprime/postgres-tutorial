import React from 'react';
import { Database, Users, Truck, Package, Link2, Star } from 'lucide-react';

export default function ERDDiagram({ highlightTable = null }) {
  const tables = [
    { name: 'users', icon: Users, color: 'blue', position: { top: '10%', left: '50%' } },
    { name: 'carrier_trips', icon: Truck, color: 'indigo', position: { top: '35%', left: '20%' } },
    { name: 'package_requests', icon: Package, color: 'purple', position: { top: '35%', left: '80%' } },
    { name: 'delivery_matches', icon: Link2, color: 'pink', position: { top: '60%', left: '50%' } },
    { name: 'ratings', icon: Star, color: 'yellow', position: { top: '85%', left: '50%' } }
  ];

  const relationships = [
    { from: 'users', to: 'carrier_trips', label: 'carrier_id' },
    { from: 'users', to: 'package_requests', label: 'shipper_id' },
    { from: 'carrier_trips', to: 'delivery_matches', label: 'carrier_trip_id' },
    { from: 'package_requests', to: 'delivery_matches', label: 'package_request_id' },
    { from: 'users', to: 'delivery_matches', label: 'carrier_id, shipper_id' },
    { from: 'delivery_matches', to: 'ratings', label: 'match_id' },
    { from: 'users', to: 'ratings', label: 'rater_id, rated_user_id' }
  ];

  const getColorClasses = (color, isHighlighted) => {
    const colors = {
      blue: isHighlighted ? 'bg-blue-600 text-white border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-300',
      indigo: isHighlighted ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-indigo-100 text-indigo-700 border-indigo-300',
      purple: isHighlighted ? 'bg-purple-600 text-white border-purple-700' : 'bg-purple-100 text-purple-700 border-purple-300',
      pink: isHighlighted ? 'bg-pink-600 text-white border-pink-700' : 'bg-pink-100 text-pink-700 border-pink-300',
      yellow: isHighlighted ? 'bg-yellow-600 text-white border-yellow-700' : 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Database className="w-6 h-6 text-blue-600" />
        Database Schema Diagram
      </h3>
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 min-h-[500px]">
        {/* Relationship Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {relationships.map((rel, idx) => {
            const fromTable = tables.find(t => t.name === rel.from);
            const toTable = tables.find(t => t.name === rel.to);
            if (!fromTable || !toTable) return null;

            // Simple line drawing (can be enhanced with proper SVG paths)
            const fromX = parseFloat(fromTable.position.left);
            const fromY = parseFloat(fromTable.position.top);
            const toX = parseFloat(toTable.position.left);
            const toY = parseFloat(toTable.position.top);

            return (
              <g key={idx}>
                <line
                  x1={`${fromX}%`}
                  y1={`${fromY}%`}
                  x2={`${toX}%`}
                  y2={`${toY}%`}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={`${(fromX + toX) / 2}%`}
                  y={`${(fromY + toY) / 2 - 2}%`}
                  className="text-xs fill-gray-600"
                  textAnchor="middle"
                  fontSize="10"
                >
                  {rel.label}
                </text>
              </g>
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
            </marker>
          </defs>
        </svg>

        {/* Tables */}
        {tables.map((table) => {
          const isHighlighted = highlightTable === table.name;
          return (
            <div
              key={table.name}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 border-2 rounded-lg p-3 shadow-lg transition-all ${
                isHighlighted ? 'scale-110 z-10' : 'z-0'
              } ${getColorClasses(table.color, isHighlighted)}`}
              style={table.position}
            >
              <div className="flex items-center gap-2 mb-2">
                <table.icon className="w-5 h-5" />
                <span className="font-bold text-sm">{table.name}</span>
              </div>
              <div className="text-xs opacity-75">
                {table.name === 'users' && 'id, name, email, roles'}
                {table.name === 'carrier_trips' && 'id, carrier_id, origin, destination'}
                {table.name === 'package_requests' && 'id, shipper_id, pickup, delivery'}
                {table.name === 'delivery_matches' && 'id, trip_id, package_id, status'}
                {table.name === 'ratings' && 'id, match_id, rating, review'}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2"><strong>Legend:</strong></p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
            <span>Users Table</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-100 border-2 border-indigo-300 rounded"></div>
            <span>Carrier Trips</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
            <span>Package Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-100 border-2 border-pink-300 rounded"></div>
            <span>Delivery Matches</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
            <span>Ratings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

