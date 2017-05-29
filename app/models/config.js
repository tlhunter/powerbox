/**
 * Handles the management of configuration data via sqlite3
 */
const fs = require('fs');
const path = require('path');

const sqlite3 = require('sqlite3');

const DB = path.join(__dirname, "../../data/powerbox.db");
const SCHEMA = path.join(__dirname, "../schema/powerbox.sql");

let db = null;

module.exports = {
  path: DB,
  db: {},
  keyval: {},
  banks: {}
};

module.exports.db.isReady = () => !!db;

/**
 * Check to see if the Database file exists
 */
module.exports.db.exists = (callback) => {
  fs.access(
    DB,
    fs.constants.R_OK | fs.constants.W_OK,
    (error) => {
      callback(null, !error);
    }
  );
};

/**
 * Instantiates the database and connects
 * If the file doesn't exist than a 0 Byte file is created
 */
module.exports.db.init = (callback) => {
  // TODO: Close old database
  db = new sqlite3.Database(DB, callback);
};

/**
 * Create the Database file and schema
 * Inserts default records as well
 */
module.exports.db.create = (callback) => {
  if (!db) return void setImmediate(() => callback(new Error("Database is not initialized")));

  fs.readFile(SCHEMA, (error, schema) => {
    if (error) return void callback(error);

    schema = schema.toString();

    db.exec(schema, (error) => {
      callback(error);
    });
  });
};

/**
 * Closes connection to database and destroys database file
 */
module.exports.db.destroy = (callback) => {
  if (!db) return void setImmediate(() => callback(new Error("Database is not initialized")));

  db.close((error) => {
    if (error) return void callback(error);

    db = null;

    fs.unlink(DB, callback);
  });
};

/**
 * Get a configuration key
 */
module.exports.keyval.get = (key, callback) => {
  if (!db) return void setImmediate(() => callback(new Error("Database is not initialized")));

  const query = "SELECT value FROM keyval WHERE key = $key";

  const obj = {
    $key: key
  };

  db.get(query, obj, (error, data) => {
    if (error) {
      return void callback(error);
    }

    if (!data) {
      return void callback(
        new Error("entry not found")
      );
    }

    callback(error, data.value);
  });
};

/**
 * Set a configuration key (cannot create, must already exist in schema)
 */
module.exports.keyval.set = (key, value, callback) => {
  if (!db) return void setImmediate(() => callback(new Error("Database is not initialized")));

  const query = "UPDATE keyval SET value = $value WHERE key = $key";

  const obj = {
    $value: value,
    $key: key
  };

  db.run(query, obj, (error) => {
    callback(error);
  });
};

/**
 * Get bank data
 */
module.exports.banks.get = (bank_id, callback) => {
  if (!db) return void setImmediate(() => callback(new Error("Database is not initialized")));

  const query = "SELECT * FROM banks WHERE id = $id";

  const obj = {
    $id: bank_id
  };

  db.get(query, obj, (error, data) => {
    if (error) {
      return void callback(error);
    }

    if (!data) {
      return void callback(
        new Error("unable to find bank data")
      );
    }

    // Convert comma separated string into an array of numbers
    data.pins = data.pins.split(',').map(Number);

    callback(null, data);
  });
};

/**
 * Set bank data (cannot create, must already exist in schema)
 */
module.exports.banks.set = (bank_id, data, callback) => {
  if (!db) return void setImmediate(() => callback(new Error("Database is not initialized")));

  if (!data.name || !data.pins || !data.schedule) {
    return void setImmediate(() => callback(
      new Error("Must provide .name, .pins, and .schedule")
    ));
  }

  if (!Array.isArray(data.pins)) {
    return void setImmediate(() => callback(
      new Error(".pins must be an array")
    ));
  }

  // Convert array of pins into a string
  data.pins = data.pins.join(',');

  const query = "UPDATE banks SET schedule = $schedule, name = $name, pins = $pins WHERE id = $id";

  const obj = {
    $schedule: data.schedule,
    $name: data.name,
    $pins: data.pins,
    $id: bank_id
  };

  db.run(query, obj, (error) => {
    callback(error);
  });
};
