const express = require('express');
const app = express();

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

const schedule = require('./app/service/schedule.js');

const controllers = {
  banks: require('./app/api/controllers/banks.js'),
  config: require('./app/api/controllers/config.js')
};

app.listen(PORT, HOST, (err) => {
  console.log(`LISTENING FOR CONNECTIONS ON http://${HOST}:${PORT}`);
  // schedule.start();
});
