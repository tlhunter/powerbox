// Save configuration to SQLite DB
const sqlite3 = require('sqlite3');
const fs = require('fs');

const DB = "../data/powerbox.db";

const db = new sqlite3.Database(DB);

module.exports = {
  path: DB,
  db: {},
  config: {},
  banks: {}
};

/**
 * Check to see if the Database file exists
 */
module.exports.db.exists = (callback) => {
  fs.access(
    DB,
    fs.constants.R_OK | fs.constants.W_OK,
    (err) => {
      callback(null, !err);
    }
  );
};

/**
 * Create the Database file and schema
 */
module.exports.db.create = (callback) => {
  fs.read("../schemas/powerbox.sql", (err, schema) => {
    if (err) return void callback(err);

    db.run(schema, (err) => {
      callback(err);
    });
  });
};

/**
 * Get a configuration key
 */
module.exports.config.get = (key, callback) => {
  db.get("SELECT value FROM config WHERE key = (?)", key, (err, data) => {
    callback(err, data);
  });
};

/**
 * Set a configuration key
 */
module.exports.config.set = (key, value, callback) => {
  db.run("UPDATE config SET value = (?) WHERE key = (?)", [value, key], (err) => {
    callback(err);
  });
};

/**
 * Get bank data
 */
module.exports.banks.get = (bank_id, callback) => {
  db.get("SELECT schedule FROM banks WHERE id = (?)", bank_id, (err, data) => {
    callback(err, data);
  });
};

/**
 * Set bank data
 */
module.exports.banks.set = (bank_id, schedule, callback) => {
  db.run("UPDATE banks SET schedule = (?) WHERE id = (?)", [schedule, bank_id], (err) => {
    callback(err);
  });
};
