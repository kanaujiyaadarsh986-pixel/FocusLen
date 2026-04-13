const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "focuslens",
  password: "9369906443", 
  port: 5432,
});

module.exports = pool;