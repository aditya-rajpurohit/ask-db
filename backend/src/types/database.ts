export interface DatabaseConnection {
  id: string;
  name: string; // User-friendly name for the connection
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  db_type: 'postgresql' | 'mysql' | 'sqlite';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseConnectionRequest {
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  db_type: 'postgresql' | 'mysql' | 'sqlite';
}

export interface DatabaseTestResult {
  success: boolean;
  message: string;
  schema_info?: {
    tables: string[];
    total_tables: number;
  };
}

export interface QueryResult {
  success: boolean;
  data?: any[];
  columns?: string[];
  row_count?: number;
  execution_time?: number;
  error?: string;
}