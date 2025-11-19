# PostgreSQL Complete Tutorial: From Beginner to Advanced

An interactive educational platform for learning PostgreSQL from beginner to advanced by building a real-world database system. Built with React, Vite, and TailwindCSS.

## Overview

This tutorial teaches database design and SQL skills by building a **peer-to-peer delivery platform** database schema that connects carriers (people making trips) with shippers (people needing to send packages).

## Features

### 📚 Comprehensive Tutorial Structure

- **Part 1: Database Setup** - Create PostgreSQL database and Users table with role support
- **Part 2: Carrier Trips** - Create carrier_trips table with ENUMs and indexes
- **Part 3: Package Requests** - Create package_requests table with JSON columns
- **Part 4: Delivery Matches** - Connect trips with packages using delivery_matches table
- **Part 5: Ratings** - Create ratings table with proper relationships
- **Part 6: Matching Algorithm** - Write complex queries to match trips with packages
- **Part 7: Indexing & Performance** - Optimize queries with composite and partial indexes
- **Part 8: Advanced Features** - Views, functions, triggers, and database-level validation

### 🎯 Learning Objectives

By the end of this tutorial, you will be able to:

- Design normalized database schemas for multi-role user systems
- Create tables with proper relationships (foreign keys, constraints)
- Use PostgreSQL-specific features (ENUMs, JSON columns, indexes)
- Write complex queries for matching algorithms
- Implement proper indexing strategies for performance
- Handle status tracking and state management in databases

### 🛠️ Key PostgreSQL Features Covered

- **ENUM Types** - For status fields and categorical data
- **JSON/JSONB Columns** - For flexible data storage
- **Foreign Keys** - Proper referential integrity
- **Composite Indexes** - For multi-column queries
- **Partial Indexes** - For filtered queries
- **Functional Indexes** - For case-insensitive searches
- **Check Constraints** - For data validation
- **Unique Constraints** - Prevent duplicate matches
- **Views** - Simplify complex queries
- **Functions** - Encapsulate business logic
- **Triggers** - Automatic data updates

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL (for running queries locally)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
postgres_tutorial/
├── src/
│   ├── components/
│   │   ├── SQLEditor.jsx          # SQL query editor component
│   │   ├── QueryResults.jsx       # Query results display
│   │   ├── EducationalPanel.jsx   # Collapsible educational content
│   │   └── SchemaVisualization.jsx # Table schema visualization
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── Part1DatabaseSetup.jsx # Part 1 tutorial
│   │   ├── Part2CarrierTrips.jsx  # Part 2 tutorial
│   │   └── ...                    # Parts 3-8
│   ├── utils/
│   │   ├── sqlQueries.js          # SQL query templates
│   │   └── schemas.js             # Schema definitions
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # Entry point
├── package.json
└── vite.config.js
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Syntax Highlighter** - SQL syntax highlighting

## Database Schema

The tutorial builds a complete database with 5 core tables:

1. **users** - Multi-role users (carriers and/or shippers)
2. **carrier_trips** - Trips that carriers are making
3. **package_requests** - Delivery requests from shippers
4. **delivery_matches** - Connections between trips and packages
5. **ratings** - User ratings and reviews

## Educational Approach

Each tutorial part includes:

- **Step-by-step instructions** - Clear guidance through each concept
- **SQL examples** - Ready-to-use queries with explanations
- **Educational panels** - Comprehensive theory and best practices
- **Schema visualizations** - Visual representation of table structures
- **Interactive SQL editor** - Practice queries directly in the browser
- **Key takeaways** - Summary of important concepts

## Usage Notes

- The SQL editor in this tutorial is for demonstration purposes
- To execute queries, connect to your PostgreSQL database using psql or a GUI tool
- Copy the SQL queries from the tutorial and run them in your PostgreSQL environment
- Sample data is provided for testing queries

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

