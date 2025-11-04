import sqlite3
import os
from flask import Flask, jsonify
from flask_cors import CORS

# --- GESTIONE PERCORSO ASSOLUTO ---
# Trova la cartella in cui si trova questo script (es. 'backend/')
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Costruisce il percorso al database nella cartella principale (un livello sopra)
DB_PATH = os.path.normpath(os.path.join(SCRIPT_DIR, '../database.db'))
# ------------------------------------

app = Flask(__name__)
CORS(app)  # permette richieste JS dal frontend

def get_db_connection():
    """Si connette al database SQLite (in sola lettura per sicurezza)."""
    # Usiamo 'file:' per specificare la modalità read-only (ro)
    db_uri = f'file:{DB_PATH}?mode=ro'
    try:
        conn = sqlite3.connect(db_uri, uri=True)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.OperationalError as e:
        print(f"ERRORE: Impossibile connettersi al database in {DB_PATH}.")
        print(f"Dettagli: {e}")
        print("Hai eseguito 'python backend/init_db.py'?")
        return None

@app.route('/api/eventi', methods=['GET'])
def get_eventi():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"errore": "Servizio non disponibile, database non raggiungibile."}), 503

    try:
        # Ordiniamo gli eventi per data e ora
        eventi = conn.execute("SELECT * FROM eventi ORDER BY data ASC, ora ASC").fetchall()
        conn.close()

        eventi_list = [
            {
                "id": e["id"],
                "titolo": e["titolo"],
                "descrizione": e["descrizione"],
                "data": e["data"],
                "ora": e["ora"]
            }
            for e in eventi
        ]

        return jsonify(eventi_list)
        
    except sqlite3.OperationalError as e:
        # Questo accade se la tabella 'eventi' non esiste
        print(f"ERRORE: {e}")
        conn.close()
        return jsonify({"errore": "Errore del database: la tabella 'eventi' potrebbe non esistere."}), 500

if __name__ == "__main__":
    if not os.path.exists(DB_PATH):
        print(f"ATTENZIONE: Il file database '{DB_PATH}' non è stato trovato.")
        print("Assicurati di aver eseguito 'python backend/init_db.py' prima di avviare il server.")
    else:
        print(f"Server API in avvio, database in uso: {DB_PATH}")
        
    app.run(debug=True, port=5000)
