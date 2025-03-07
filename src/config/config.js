const mysql = require("mysql2/promise");

const config = {
  SERVER: process.env.DB_SERVER,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  DATABASE: process.env.DB_NAME,
};

// Create the MySQL connection pool and export it
const pool = mysql.createPool({
  host: config.SERVER,
  user: config.USERNAME,
  password: config.PASSWORD,
  database: config.DATABASE,
});

module.exports = { pool };
