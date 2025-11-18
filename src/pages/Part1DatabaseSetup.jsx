import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SQLEditor from '../components/SQLEditor';
import QueryResults from '../components/QueryResults';
import EducationalPanel, { 
  Prerequisites, 
  KeyConcept, 
  CommonMistakes, 
  StepByStep, 
  RealWorldExample 
} from '../components/EducationalPanel';
import SchemaVisualization from '../components/SchemaVisualization';
import ERDDiagram from '../components/ERDDiagram';
import CheatSheet from '../components/CheatSheet';
import Exercise from '../components/Exercise';
import QueryExplainer from '../components/QueryExplainer';
import { GlossaryTerm } from '../components/Glossary';
import { part1Queries } from '../utils/sqlQueries';
import { usersSchema } from '../utils/schemas';

export default function Part1DatabaseSetup() {
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const handleExecuteQuery = (query) => {
    // In a real implementation, this would connect to PostgreSQL
    // For now, we'll simulate results
    setQueryError(null);
    
    if (query.toLowerCase().includes('select * from users')) {
      setQueryResults({
        rows: [
          { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1-555-0101', is_carrier: true, is_shipper: false, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
          { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '+1-555-0102', is_carrier: false, is_shipper: true, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
          { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1-555-0103', is_carrier: true, is_shipper: true, created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' }
        ]
      });
    } else if (query.toLowerCase().includes('where is_carrier')) {
      setQueryResults({
        rows: [
          { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1-555-0101' },
          { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1-555-0103' }
        ]
      });
    } else if (query.toLowerCase().includes('create table') || query.toLowerCase().includes('insert into')) {
      setQueryResults({ success: true });
    } else {
      setQueryError('Note: This is a demo. In a real environment, connect to PostgreSQL to execute queries.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                Part 1: Database Setup and Users Table
              </h1>
              <p className="text-lg text-gray-700">
                Create PostgreSQL database and design users table with role support
              </p>
            </div>
            <Link
              to="/"
              className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <Home className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Educational Content */}
        <div className="space-y-6 mb-8">
          <EducationalPanel title="Learning Objectives" type="default" defaultOpen={true}>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Create a PostgreSQL database</li>
              <li>Design a users table with dual role support (carrier and/or shipper)</li>
              <li>Add constraints (unique email, check constraints for roles)</li>
              <li>Insert sample users with different role combinations</li>
              <li>Query users based on their roles</li>
            </ul>
          </EducationalPanel>

          <EducationalPanel title="Before You Start" type="info" defaultOpen={true}>
            <Prerequisites 
              items={[
                "PostgreSQL installed on your computer (version 12 or higher)",
                "Basic understanding of SQL (SELECT, INSERT, CREATE TABLE)",
                "Access to psql command line or a PostgreSQL GUI tool (like pgAdmin)",
                "A database where you can create tables (or permission to create a new database)"
              ]}
            />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>💡 Tip:</strong> If you're new to PostgreSQL, make sure you can connect to your database 
                before starting. You can test your connection by running: <code className="bg-blue-100 px-1 rounded">psql -U your_username -d postgres</code>
              </p>
            </div>
          </EducationalPanel>

          <EducationalPanel title="Database Design: Multi-Role Users" type="concept" defaultOpen={true}>
            <KeyConcept 
              term="Multi-Role User System"
              definition="A design pattern where a single user can have multiple roles or responsibilities in the system. Instead of creating separate tables for each role, we use boolean flags to indicate which roles a user has."
              example="is_carrier = TRUE, is_shipper = TRUE means the user can both carry packages and send packages"
            />
            
            <div className="space-y-4 mt-4">
              <p className="text-gray-700">
                In our peer-to-peer delivery platform, users can have multiple roles:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Carriers:</strong> People making trips who can carry packages</li>
                <li><strong>Shippers:</strong> People who need to send packages</li>
                <li><strong>Both:</strong> Users who can be both carriers and shippers</li>
              </ul>
              
              <RealWorldExample 
                title="Real-World Analogy"
                description="Think of it like a LinkedIn profile - one person can be both a 'Software Engineer' and a 'Freelancer' at the same time. Similarly, one user in our system can be both a carrier and a shipper."
                example="Alice travels frequently for work (carrier) but also needs to send packages to clients (shipper). She has both roles enabled."
              />

              <p className="text-gray-700">
                Instead of creating separate tables, we use boolean flags (<code className="bg-gray-100 px-1 rounded">is_carrier</code> and <code className="bg-gray-100 px-1 rounded">is_shipper</code>) 
                to support multiple roles in a single table. This approach:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Reduces data duplication</li>
                <li>Simplifies user management</li>
                <li>Allows users to switch roles easily</li>
                <li>Maintains referential integrity</li>
              </ul>
            </div>
          </EducationalPanel>

          <EducationalPanel title="Common Mistakes to Avoid" type="warning" defaultOpen={false}>
            <CommonMistakes 
              mistakes={[
                {
                  wrong: "Creating separate tables: carriers_table and shippers_table",
                  correct: "Use a single users table with boolean flags (is_carrier, is_shipper)",
                  explanation: "Separate tables would require duplicate user information and make it hard to handle users with multiple roles."
                },
                {
                  wrong: "Forgetting the CHECK constraint for roles",
                  correct: "Always ensure at least one role is TRUE: CHECK (is_carrier = TRUE OR is_shipper = TRUE)",
                  explanation: "Without this constraint, you might accidentally create users with no role, which doesn't make sense in our system."
                },
                {
                  wrong: "Not making email UNIQUE",
                  correct: "Add UNIQUE constraint: email VARCHAR(255) UNIQUE NOT NULL",
                  explanation: "Email addresses should be unique to prevent duplicate accounts and ensure proper authentication."
                },
                {
                  wrong: "Using VARCHAR without length limit",
                  correct: "Specify length: VARCHAR(255) instead of just VARCHAR",
                  explanation: "PostgreSQL allows unlimited VARCHAR, but specifying length helps with database planning and prevents accidentally storing huge strings."
                }
              ]}
            />
          </EducationalPanel>

          <EducationalPanel title="Table Schema: Users" defaultOpen={false}>
            <SchemaVisualization schema={[usersSchema]} />
            <div className="mt-4 space-y-3 text-gray-700">
              <div>
                <strong className="text-gray-900">Key Design Decisions:</strong>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li><GlossaryTerm term="SERIAL">SERIAL PRIMARY KEY</GlossaryTerm> for auto-incrementing IDs</li>
                  <li><GlossaryTerm term="UNIQUE Constraint">UNIQUE</GlossaryTerm> constraint on email to prevent duplicates</li>
                  <li><GlossaryTerm term="CHECK Constraint">CHECK</GlossaryTerm> constraint ensures users have at least one role</li>
                  <li>Timestamps track when records are created and updated</li>
                </ul>
              </div>
            </div>
          </EducationalPanel>

          <EducationalPanel title="Database Schema Overview" type="info" defaultOpen={false}>
            <p className="text-gray-700 mb-4">
              This diagram shows how all tables in our database relate to each other. The users table is central, 
              connecting to all other tables through foreign keys.
            </p>
            <ERDDiagram highlightTable="users" />
            <div className="mt-4">
              <CheatSheet category="Data Types" />
            </div>
          </EducationalPanel>
        </div>

        {/* Step 1: Create Database */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Create the Database</h2>
          <p className="text-gray-700 mb-4">
            First, create a new PostgreSQL database for our platform. If you're using psql command line, 
            connect to PostgreSQL and run:
          </p>
          <SQLEditor initialQuery={part1Queries.createDatabase} readOnly={true} />
          <EducationalPanel title="Understanding This Step" type="info" defaultOpen={false}>
            <StepByStep 
              steps={[
                {
                  title: "Connect to PostgreSQL",
                  description: "Open your terminal and connect to PostgreSQL. The default superuser is usually 'postgres'.",
                  code: "psql -U postgres"
                },
                {
                  title: "Create the Database",
                  description: "The CREATE DATABASE command creates a new database. Database names are case-insensitive in PostgreSQL.",
                  code: "CREATE DATABASE p2p_delivery;"
                },
                {
                  title: "Connect to Your New Database",
                  description: "The \\c command connects you to a specific database. Now all your commands will run in this database.",
                  code: "\\c p2p_delivery"
                }
              ]}
            />
            <RealWorldExample 
              title="Why Create a Separate Database?"
              description="Creating a separate database keeps our tutorial project isolated from other databases. It's like creating a new folder for a project - everything stays organized and you can easily drop it later if needed."
            />
          </EducationalPanel>
        </div>

        {/* Step 2: Create Users Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Create Users Table</h2>
          <p className="text-gray-700 mb-4">
            Create the users table with proper constraints. Notice the CHECK constraint that ensures 
            every user has at least one role (carrier or shipper).
          </p>
          <SQLEditor initialQuery={part1Queries.createUsersTable} readOnly={true} />
          
          <EducationalPanel title="Breaking Down the Table Definition" type="info" defaultOpen={false}>
            <StepByStep 
              steps={[
                {
                  title: "Primary Key",
                  description: "id SERIAL PRIMARY KEY creates an auto-incrementing unique identifier for each user. SERIAL is PostgreSQL's way of creating auto-incrementing integers.",
                  code: "id SERIAL PRIMARY KEY"
                },
                {
                  title: "User Information",
                  description: "name, email, and phone store basic user contact information. Email has UNIQUE constraint to prevent duplicates.",
                  code: "email VARCHAR(255) UNIQUE NOT NULL"
                },
                {
                  title: "Role Flags",
                  description: "Boolean flags indicate which roles the user has. Both default to FALSE, so you must set at least one to TRUE when inserting.",
                  code: "is_carrier BOOLEAN DEFAULT FALSE"
                },
                {
                  title: "CHECK Constraint",
                  description: "This ensures every user has at least one role. Without this, you could create a user who is neither a carrier nor a shipper, which doesn't make sense.",
                  code: "CONSTRAINT at_least_one_role CHECK (is_carrier = TRUE OR is_shipper = TRUE)"
                },
                {
                  title: "Timestamps",
                  description: "created_at and updated_at automatically track when records are created and modified. CURRENT_TIMESTAMP uses the current date and time.",
                  code: "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                }
              ]}
            />
          </EducationalPanel>

          <EducationalPanel title="Key Concepts Explained" type="concept" defaultOpen={false}>
            <KeyConcept 
              term="SERIAL"
              definition="A PostgreSQL data type that automatically generates sequential integers. It's equivalent to AUTO_INCREMENT in MySQL. Each new row gets the next number automatically."
              example="First user gets id=1, second gets id=2, etc."
            />
            <KeyConcept 
              term="PRIMARY KEY"
              definition="A constraint that uniquely identifies each row in a table. Only one PRIMARY KEY per table. It automatically creates an index for fast lookups."
              example="id is the PRIMARY KEY, so no two users can have the same id"
            />
            <KeyConcept 
              term="CHECK Constraint"
              definition="A constraint that ensures data meets certain conditions. PostgreSQL will reject any INSERT or UPDATE that violates the CHECK condition."
              example="CHECK (is_carrier = TRUE OR is_shipper = TRUE) ensures at least one role is TRUE"
            />
          </EducationalPanel>
        </div>

        {/* Step 3: Insert Sample Data */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Insert Sample Users</h2>
          <p className="text-gray-700 mb-4">
            Insert sample users with different role combinations. Try modifying the query to add your own users.
          </p>
          <SQLEditor 
            initialQuery={part1Queries.insertSampleUsers} 
            onExecute={handleExecuteQuery}
          />
          <QueryResults results={queryResults} error={queryError} />
        </div>

        {/* Step 4: Query Users */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Query Users</h2>
          <p className="text-gray-700 mb-4">
            Practice querying users based on their roles. Try these queries:
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Query All Users</h3>
              <QueryExplainer 
                query={part1Queries.queryUsers}
                explanation={{
                  purpose: "Retrieves all columns and rows from the users table",
                  keywords: ["SELECT", "FROM"],
                  steps: [
                    "SELECT * means 'select all columns'",
                    "FROM users specifies the table to query",
                    "The result shows every user in the database"
                  ]
                }}
              />
              <SQLEditor 
                initialQuery={part1Queries.queryUsers} 
                onExecute={handleExecuteQuery}
              />
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Query Only Carriers</h3>
              <SQLEditor 
                initialQuery={part1Queries.queryCarriers} 
                onExecute={handleExecuteQuery}
              />
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Query Users Who Are Both</h3>
              <SQLEditor 
                initialQuery={part1Queries.queryBothRoles} 
                onExecute={handleExecuteQuery}
              />
            </div>
          </div>
          
          <QueryResults results={queryResults} error={queryError} />
        </div>

        {/* Practice Exercise */}
        <div className="mb-6">
          <Exercise
            title="Practice: Create Your Own User"
            description="Test your understanding by creating a user table and inserting a user"
            instructions="Write a SQL query to insert a new user named 'John Doe' with email 'john@example.com' who is both a carrier and a shipper."
            solution="INSERT INTO users (name, email, is_carrier, is_shipper) VALUES ('John Doe', 'john@example.com', TRUE, TRUE);"
            hints={[
              "Start with INSERT INTO users",
              "List the columns you want to insert: (name, email, is_carrier, is_shipper)",
              "Use VALUES to specify the data",
              "Remember: both is_carrier and is_shipper should be TRUE"
            ]}
            onCheck={(solution) => {
              const normalized = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
              const userSolution = normalized(solution);
              const correct = normalized("INSERT INTO users (name, email, is_carrier, is_shipper) VALUES ('John Doe', 'john@example.com', TRUE, TRUE);");
              return userSolution.includes('insert into users') && 
                     userSolution.includes('john doe') && 
                     userSolution.includes('john@example.com') &&
                     userSolution.includes('true') &&
                     userSolution.includes('true');
            }}
          />
        </div>

        {/* Key Takeaways */}
        <EducationalPanel title="Key Takeaways" defaultOpen={false}>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Use <GlossaryTerm term="SERIAL">SERIAL</GlossaryTerm> for auto-incrementing primary keys</li>
            <li>Use <GlossaryTerm term="UNIQUE Constraint">UNIQUE</GlossaryTerm> constraints to prevent duplicate values</li>
            <li>Use <GlossaryTerm term="CHECK Constraint">CHECK</GlossaryTerm> constraints to enforce business rules</li>
            <li>Boolean flags can efficiently represent multiple roles in a single table</li>
            <li>Timestamps help track when records are created and modified</li>
          </ul>
        </EducationalPanel>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <div></div>
          <Link
            to="/part-2-carrier-trips"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Next: Part 2 - Carrier Trips →
          </Link>
        </div>
      </div>
    </div>
  );
}

