const postgres = require("postgres");

const connectionOptions = {
  host: process.env.DB_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'postgres',
  username: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'pass',
  port: process.env.POSGTRESS_PORT || 5432,
}

const sql = postgres(connectionOptions);

module.exports = sql;