DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS Tasks;
CREATE TABLE Tasks (
  id         TEXT PRIMARY KEY,
  content    TEXT NOT NULL,
  duedate       TIMESTAMP
);
