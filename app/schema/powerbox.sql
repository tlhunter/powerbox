CREATE TABLE keyval (
  key VARCHAR(64) PRIMARY KEY,
  value TEXT
);

INSERT INTO keyval (key, value) VALUES ("timezone", "America/Los_Angeles");

CREATE TABLE banks (
  id INTEGER PRIMARY KEY,
  name VARCHAR(128),
  pins VARCHAR(64),
  duration INTEGER,
  schedule TEXT
);

INSERT INTO banks (id, name, pins, duration, schedule) VALUES (1, "Left Bank", "1,2", 0, "* * * * * *");
INSERT INTO banks (id, name, pins, duration, schedule) VALUES (2, "Right Bank", "3,4", 0, "* * * * * *");
