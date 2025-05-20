const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      lastname TEXT NOT NULL,
      birthdate TEXT,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      country TEXT,
      password TEXT,
      theme BOOLEAN DEFAULT 0
    );
  `);
});

module.exports = db;
