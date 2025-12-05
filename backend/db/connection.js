const sql = require('mssql');
const config = require('../config');

const dbConfig = {
  server: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  options: config.database.options,
  pool: config.database.pool
};

let pool = null;

const getPool = async () => {
  if (!pool) {
    try {
      pool = await sql.connect(dbConfig);
      console.log('Connected to MS SQL Server');
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  }
  return pool;
};

const closePool = async () => {
  if (pool) {
    await pool.close();
    pool = null;
  }
};

module.exports = {
  sql,
  getPool,
  closePool,
  dbConfig
};
