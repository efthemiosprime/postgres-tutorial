// Schema definitions for visualization
export const usersSchema = {
  name: 'users',
  columns: [
    { name: 'id', type: 'SERIAL', constraints: ['PRIMARY KEY'] },
    { name: 'name', type: 'VARCHAR(255)', constraints: ['NOT NULL'] },
    { name: 'email', type: 'VARCHAR(255)', constraints: ['UNIQUE', 'NOT NULL'] },
    { name: 'phone', type: 'VARCHAR(50)', constraints: [] },
    { name: 'is_carrier', type: 'BOOLEAN', constraints: ['DEFAULT FALSE'] },
    { name: 'is_shipper', type: 'BOOLEAN', constraints: ['DEFAULT FALSE'] },
    { name: 'created_at', type: 'TIMESTAMP', constraints: ['DEFAULT CURRENT_TIMESTAMP'] },
    { name: 'updated_at', type: 'TIMESTAMP', constraints: ['DEFAULT CURRENT_TIMESTAMP'] }
  ]
};

export const carrierTripsSchema = {
  name: 'carrier_trips',
  columns: [
    { name: 'id', type: 'SERIAL', constraints: ['PRIMARY KEY'] },
    { name: 'carrier_id', type: 'INTEGER', constraints: ['NOT NULL', 'FK → users(id)'] },
    { name: 'origin_city', type: 'VARCHAR(100)', constraints: ['NOT NULL'] },
    { name: 'origin_country', type: 'VARCHAR(100)', constraints: ['NOT NULL'] },
    { name: 'origin_lat', type: 'DECIMAL(10,8)', constraints: [] },
    { name: 'origin_lng', type: 'DECIMAL(11,8)', constraints: [] },
    { name: 'destination_city', type: 'VARCHAR(100)', constraints: ['NOT NULL'] },
    { name: 'destination_country', type: 'VARCHAR(100)', constraints: ['NOT NULL'] },
    { name: 'destination_lat', type: 'DECIMAL(10,8)', constraints: [] },
    { name: 'destination_lng', type: 'DECIMAL(11,8)', constraints: [] },
    { name: 'departure_date', type: 'DATE', constraints: ['NOT NULL'] },
    { name: 'arrival_date', type: 'DATE', constraints: ['NOT NULL'] },
    { name: 'available_weight_kg', type: 'DECIMAL(10,2)', constraints: ['NOT NULL', 'CHECK > 0'] },
    { name: 'available_space_liters', type: 'DECIMAL(10,2)', constraints: ['NOT NULL', 'CHECK > 0'] },
    { name: 'price_per_kg', type: 'DECIMAL(10,2)', constraints: ['NOT NULL', 'CHECK >= 0'] },
    { name: 'trip_status', type: 'trip_status ENUM', constraints: ['DEFAULT planning'] },
    { name: 'transportation_method', type: 'transportation_method ENUM', constraints: ['NOT NULL'] },
    { name: 'special_notes', type: 'TEXT', constraints: [] },
    { name: 'created_at', type: 'TIMESTAMP', constraints: ['DEFAULT CURRENT_TIMESTAMP'] },
    { name: 'updated_at', type: 'TIMESTAMP', constraints: ['DEFAULT CURRENT_TIMESTAMP'] }
  ]
};

