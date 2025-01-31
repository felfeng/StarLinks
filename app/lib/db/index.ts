import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "starlinks.db"));

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS daily_games (
    date TEXT PRIMARY KEY,
    movies TEXT NOT NULL,
    actors TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    user_id TEXT,
    game_date TEXT,
    completed BOOLEAN DEFAULT FALSE,
    mistakes INTEGER DEFAULT 0,
    completed_at DATETIME,
    PRIMARY KEY (user_id, game_date),
    FOREIGN KEY (game_date) REFERENCES daily_games(date)
  );
`);

export default db;
