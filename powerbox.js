const fs = require('fs');

const express = require('express');

if (process.platform !== 'linux' && !process.env.POWERBOX_DEBUG) {
  console.error("Powerbox currently only supports Linux");
  process.exit();
}

const timezone = fs.readFileSync('/etc/timezone').toString().trim();
console.log(`Current System Timezone: ${timezone}`);
console.log("Execute `tzconfig` if this looks wrong\n");

const app = express();

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

const schedule = require('./app/service/schedule.js');

const controllers = {
  banks: require('./app/controllers/api/banks.js'),
  config: require('./app/controllers/api/config.js')
};

app.listen(PORT, HOST, (err) => {
  console.log(`LISTENING FOR CONNECTIONS ON http://${HOST}:${PORT}`);
  // schedule.start();
});
