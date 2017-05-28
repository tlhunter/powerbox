CREATE TABLE config (
  key VARCHAR(64) PRIMARY KEY,
  value TEXT
);

INSERT INTO config (key, value) VALUES ("timezone", "America/Los_Angeles");

CREATE TABLE banks (
  id INTEGER PRIMARY KEY,
  schedule TEXT
);

INSERT INTO banks (id, schedule) VALUES (1, "* * * * * *");
INSERT INTO banks (id, schedule) VALUES (2, "* * * * * *");
