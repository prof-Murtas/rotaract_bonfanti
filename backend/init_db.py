import sqlite3
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.normpath(os.path.join(SCRIPT_DIR, '../database.db'))

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# LA TABELLA CORRETTA PER LA SINCRONIZZAZIONE:
c.execute("""
CREATE TABLE IF NOT EXISTS eventi (
    id TEXT PRIMARY KEY,
    titolo TEXT NOT NULL,
    descrizione TEXT,
    data TEXT NOT NULL,
    ora TEXT NOT NULL
)
""")

conn.commit()
conn.close()
print("✅ Database inizializzato per la sincronizzazione.")