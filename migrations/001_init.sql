CREATE TABLE IF NOT EXISTS app_kid_growth_journal__entries (
  id TEXT PRIMARY KEY,
  kid_id TEXT NOT NULL,
  kid_name TEXT NOT NULL,
  entry_date TEXT NOT NULL,
  age_label TEXT DEFAULT '',
  height_in REAL,
  weight_lb REAL,
  interview TEXT DEFAULT '',
  note TEXT DEFAULT '',
  photo_id TEXT DEFAULT '',
  created_by TEXT NOT NULL,
  created_by_name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_kid_growth_journal__sizes (
  kid_id TEXT PRIMARY KEY,
  kid_name TEXT NOT NULL,
  shirt TEXT DEFAULT '',
  pants TEXT DEFAULT '',
  shoe TEXT DEFAULT '',
  coat TEXT DEFAULT '',
  other TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  updated_by_name TEXT DEFAULT '',
  updated_at TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS app_kid_growth_journal__entries_kid_idx ON app_kid_growth_journal__entries(kid_id, entry_date);
