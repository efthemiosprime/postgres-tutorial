import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GlossaryPanel } from './components/Glossary';
import Home from './pages/Home';
import Part1DatabaseSetup from './pages/Part1DatabaseSetup';
import Part2CarrierTrips from './pages/Part2CarrierTrips';
import Part3PackageRequests from './pages/Part3PackageRequests';
import Part4DeliveryMatches from './pages/Part4DeliveryMatches';
import Part5Ratings from './pages/Part5Ratings';
import Part6MatchingAlgorithm from './pages/Part6MatchingAlgorithm';
import Part7IndexingPerformance from './pages/Part7IndexingPerformance';
import Part8AdvancedFeatures from './pages/Part8AdvancedFeatures';
import Cookbook from './pages/Cookbook';
import Tips from './pages/Tips';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/part-1-database-setup" element={<Part1DatabaseSetup />} />
        <Route path="/part-2-carrier-trips" element={<Part2CarrierTrips />} />
        <Route path="/part-3-package-requests" element={<Part3PackageRequests />} />
        <Route path="/part-4-delivery-matches" element={<Part4DeliveryMatches />} />
        <Route path="/part-5-ratings" element={<Part5Ratings />} />
        <Route path="/part-6-matching-algorithm" element={<Part6MatchingAlgorithm />} />
        <Route path="/part-7-indexing-performance" element={<Part7IndexingPerformance />} />
        <Route path="/part-8-advanced-features" element={<Part8AdvancedFeatures />} />
        <Route path="/cookbook" element={<Cookbook />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
      <GlossaryPanel />
    </div>
  );
}

export default App;

