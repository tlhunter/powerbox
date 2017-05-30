#!/usr/bin/env node

const fs = require('fs');

const express = require('express');

const schedule = require('./app/service/schedule.js');
const config = require('./app/models/config.js');

const controller_banks = require('./app/controllers/api/banks.js');
const controller_config = require('./app/controllers/api/config.js');
const controller_admin = require('./app/controllers/admin.js');

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

const controllers = {
  banks: controller_banks,
  config: controller_config,
  admin: controller_admin
};

console.log("Executing Powerbox...");

if (process.platform !== 'linux' && !process.env.POWERBOX_DEBUG) {
  console.error("Powerbox currently only supports Linux");
  process.exit();
}

const timezone = fs.readFileSync('/etc/timezone').toString().trim();
console.log(`Current System Timezone: ${timezone}`);
console.log("Execute `tzconfig` if this looks wrong");

const app = express();

// TODO: Remove pyramid of doom
config.db.init((error) => {
  if (error) {
    console.error("Unable to initialize configuration", error);
    return void process.exit(100);
  }

  console.log("Database connection initialized.");

  schedule.init((error) => {
    if (error) {
      console.error("Unable to initialize schedule", error);
      return void process.exit(101);
    }

    console.log("Scheduler initialized.");

    app.listen(PORT, HOST, (error) => {
      if (error) {
        console.error("Unable to listen for HTTP connections", error);
        console.error("This is usually due to permissions");
        console.error("Run Powerbox as root or change port with PORT=8080 ./powerbox.js");
        return void process.exit(102);
      }

      console.log(`Listening for connections on http://${HOST}:${PORT}`);
    });
  });
});
