import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  ArrowRight, 
  Users, 
  Truck, 
  Package, 
  Link2, 
  Star,
  Search,
  Zap,
  Layers,
  BookOpen,
  Lightbulb
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4">
            PostgreSQL Tutorial
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-2">
            Building a Peer-to-Peer Delivery Platform Database
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Learn PostgreSQL from beginner to advanced by building a real-world database system 
            that connects carriers with shippers. Master database design, SQL queries, indexing, 
            and performance optimization.
          </p>
        </div>

        {/* Learning Objectives */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-t-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Objectives</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="text-gray-700">Design normalized database schemas for multi-role user systems</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="text-gray-700">Create tables with proper relationships (foreign keys, constraints)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="text-gray-700">Use PostgreSQL-specific features (ENUMs, JSON columns, indexes)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="text-gray-700">Write complex queries for matching algorithms</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="text-gray-700">Implement proper indexing strategies for performance</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">✓</span>
              <span className="text-gray-700">Handle status tracking and state management in databases</span>
            </div>
          </div>
        </div>

        {/* Tutorial Parts */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Tutorial Parts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Part 1 */}
            <Link
              to="/part-1-database-setup"
              className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors">
                    Part 1: Database Setup
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create PostgreSQL database and Users table with role support
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Start</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Part 2 */}
            <Link
              to="/part-2-carrier-trips"
              className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-indigo-900 mb-2 group-hover:text-indigo-700 transition-colors">
                    Part 2: Carrier Trips
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create carrier_trips table with ENUMs and indexes
                  </p>
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Learn</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Part 3 */}
            <Link
              to="/part-3-package-requests"
              className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-purple-900 mb-2 group-hover:text-purple-700 transition-colors">
                    Part 3: Package Requests
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create package_requests table with JSON columns
                  </p>
                  <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Learn</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Part 4 */}
            <Link
              to="/part-4-delivery-matches"
              className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-pink-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Link2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-pink-900 mb-2 group-hover:text-pink-700 transition-colors">
                    Part 4: Delivery Matches
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Connect trips with packages using delivery_matches table
                  </p>
                  <div className="flex items-center gap-2 text-pink-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Learn</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Part 5 */}
            <Link
              to="/part-5-ratings"
              className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-yellow-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-yellow-900 mb-2 group-hover:text-yellow-700 transition-colors">
                    Part 5: Ratings
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create ratings table with proper relationships
                  </p>
                  <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Learn</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Part 6 */}
            <Link
              to="/part-6-matching-algorithm"
              className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-green-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                    Part 6: Matching Algorithm
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Write complex queries to match trips with packages
                  </p>
                  <div className="flex items-center gap-2 text-green-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Learn</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Part 7 */}
            <Link
              to="/part-7-indexing-performance"
              className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-teal-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-teal-900 mb-2 group-hover:text-teal-700 transition-colors">
                    Part 7: Indexing & Performance
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Optimize queries with composite and partial indexes
                  </p>
                  <div className="flex items-center gap-2 text-teal-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Learn</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Part 8 */}
            <Link
              to="/part-8-advanced-features"
              className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-violet-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-violet-900 mb-2 group-hover:text-violet-700 transition-colors">
                    Part 8: Advanced Features
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Views, functions, triggers, and database-level validation
                  </p>
                  <div className="flex items-center gap-2 text-violet-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Learn</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-orange-600" />
            Resources & Reference
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cookbook */}
            <Link
              to="/cookbook"
              className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-300"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-orange-900 mb-3 group-hover:text-orange-700 transition-colors">
                    SQL Cookbook
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    General PostgreSQL SQL recipes for common tasks. Copy, paste, and adapt queries for joins, 
                    aggregations, subqueries, window functions, date operations, JSON queries, and more.
                  </p>
                  <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-4 transition-all">
                    <span>Browse Recipes</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        Joins, Aggregations & Subqueries
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        Window Functions & Date Operations
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        JSON, String Ops & Performance
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Tips */}
            <Link
              to="/tips"
              className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-yellow-300"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-yellow-900 mb-3 group-hover:text-yellow-700 transition-colors">
                    Tips & Best Practices
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Expert tips for performance optimization, data integrity, best practices, common pitfalls, 
                    and PostgreSQL-specific features. Learn from real-world experience.
                  </p>
                  <div className="flex items-center gap-2 text-yellow-600 font-semibold group-hover:gap-4 transition-all">
                    <span>View Tips</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                        Performance Optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                        Data Integrity & Best Practices
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                        Common Pitfalls & Solutions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Database Schema Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-500">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Database Schema Overview</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            This tutorial builds a complete database for a peer-to-peer delivery platform with the following core tables:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Users
              </h4>
              <p className="text-sm text-gray-600">Multi-role users (carriers and/or shippers)</p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                Carrier Trips
              </h4>
              <p className="text-sm text-gray-600">Trips that carriers are making</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Package Requests
              </h4>
              <p className="text-sm text-gray-600">Delivery requests from shippers</p>
            </div>
            <div className="border-l-4 border-pink-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-pink-600" />
                Delivery Matches
              </h4>
              <p className="text-sm text-gray-600">Connections between trips and packages</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Ratings
              </h4>
              <p className="text-sm text-gray-600">User ratings and reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

