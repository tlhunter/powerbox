const fs = require('fs');

const test = require('tape');

const model = require('../../../app/models/config.js');

// Note: Tests will fail if db already exists
// Warning: These tests depend on previous tests, .only or .skip will break adjacent tests

test('Database connection is not ready by default', (t) => {
  t.notOk(model.db.isReady(), 'connection is not ready');
  t.end();
});

test('Database does not exist', (t) => {
  model.db.exists((error, exists) => {
    t.ifError(error, 'no error while checking');
    t.notOk(exists, 'database does not exist');
    t.end();
  });
});

test('Initialize database', (t) => {
  model.db.init((error) => {
    t.ifError(error, 'no error while initializing');
    t.end();
  });
});

test('Database now exists', (t) => {
  model.db.exists((error, exists) => {
    t.ifError(error, 'no error while checking');
    t.ok(exists, 'database exists');
    t.end();
  });
});

test('Database connection is now ready', (t) => {
  t.ok(model.db.isReady(), 'connection ready');
  t.end();
});

test('Getting a missing keyval', (t) => {
  model.keyval.get('timezone', (error, value) => {
    t.ok(error, 'should have error');
    t.notOk(value, 'should not have value');
    t.end();
  });
});

test('Getting a missing bank', (t) => {
  model.banks.get(1, (error, value) => {
    t.ok(error, 'should have error');
    t.notOk(value, 'should not have value');
    t.end();
  });
});

test('Create Schema', (t) => {
  model.db.create((error) => {
    t.notOk(error, 'should not have error');
    t.end();
  });
});

test('Getting a valid keyval', (t) => {
  model.keyval.get('timezone', (error, value) => {
    t.notOk(error, 'should not have error');
    t.ok(value, 'should have value');
    t.equal(value, 'America/Los_Angeles', 'should have default value');
    t.end();
  });
});

test('Getting a valid bank', (t) => {
  model.banks.get(1, (error, data) => {
    t.notOk(error, 'should not have error');
    t.ok(data, 'should have data');
    t.deepEqual(data, {
      id: 1,
      name: 'Left Bank',
      pins: [1, 2],
      schedule: '* * * * * *',
      duration: 0
    });
    t.end();
  });
});

test('Setting a valid keyval', (t) => {
  model.keyval.set('timezone', 'America/Detroit', (error) => {
    t.notOk(error, 'should not have error');
    t.end();
  });
});

test('Setting a valid bank', (t) => {
  const data = {
    schedule: '0 0 0 0 0 0',
    name: 'Bank One',
    pins: [9, 10],
    duration: 60
  };

  model.banks.set(1, data, (error) => {
    t.notOk(error, 'should not have error');
    t.end();
  });
});

test('Should update keyval data', (t) => {
  model.keyval.get('timezone', (error, value) => {
    t.notOk(error, 'should not have error');
    t.ok(value, 'should have value');
    t.equal(value, 'America/Detroit', 'should have new value');
    t.end();
  });
});

test('Should update bank data', (t) => {
  model.banks.get(1, (error, data) => {
    t.notOk(error, 'should not have error');
    t.ok(data, 'should have new data');
    t.deepEqual(data, {
      id: 1,
      name: 'Bank One',
      pins: [9, 10],
      schedule: '0 0 0 0 0 0',
      duration: 60
    });
    t.end();
  });
});

test('Database destroy', (t) => {
  model.db.destroy((error) => {
    t.ifError(error, 'no error during destruction');
    t.end();
  });
});

test('Database connection is no longer ready', (t) => {
  t.notOk(model.db.isReady(), 'connection is not ready');
  t.end();
});

test('Database no longer exists', (t) => {
  model.db.exists((error, exists) => {
    t.ifError(error, 'no error while checking');
    t.notOk(exists, 'database does not exist');
    t.end();
  });
});
