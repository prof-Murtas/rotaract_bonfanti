import sqlite3
import time
import datetime
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from google.auth.exceptions import RefreshError

# --- GESTIONE PERCORSO ASSOLUTO ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Percorso al file della chiave
SERVICE_ACCOUNT_FILE = os.path.normpath(os.path.join(SCRIPT_DIR, '../Private_Keys/service_account.json'))

# Percorso al database
DB_PATH = os.path.normpath(os.path.join(SCRIPT_DIR, '../database.db'))
# ------------------------------------


# --- CONFIGURAZIONE ---
# Incolla qui l'ID del calendario
CALENDAR_ID = 'alessandronurdewa@gmail.com'  # <<< CONFERMA CHE SIA CORRETTO

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

# Intervallo di sincronizzazione (es. 10 secondi per test, 300 per produzione)
SYNC_INTERVAL = 10
# ----------------------

def get_db_connection():
    """Si connette al database SQLite."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_calendar_service():
    """Autentica e costruisce il servizio Google Calendar."""
    try:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        service = build('calendar', 'v3', credentials=creds)
        return service
    except FileNotFoundError:
        print(f"ERRORE: Il file '{SERVICE_ACCOUNT_FILE}' non è stato trovato.")
        print("Assicurati che la struttura delle cartelle sia corretta:")
        print("progetto/\n  ├── Private_Keys/\n  │   └── service_account.json\n  └── backend/\n      └── sync_calendar.py")
        return None
    except Exception as e:
        print(f"Errore durante l'autenticazione a Google: {e}")
        return None

def fetch_google_calendar_events(service):
    """Recupera gli eventi futuri da Google Calendar."""
    if not service:
        return []
        
    try:
        now = datetime.datetime.utcnow().isoformat() + 'Z' 
        print(f"Recupero eventi da Google Calendar (ID: {CALENDAR_ID})...")
        
        events_result = service.events().list(
            calendarId=CALENDAR_ID, 
            timeMin=now,
            maxResults=100,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        
        items = events_result.get('items', [])
        print(f"Trovati {len(items)} eventi futuri.")
        return items
        
    except RefreshError as e:
        print(f"Errore di autenticazione: {e}. Controlla il service account.")
        return []
    except Exception as e:
        print(f"Errore durante il recupero degli eventi da Google: {e}")
        return []

def parse_event_datetime(start_info):
    """
    Estrae data e ora dall'oggetto 'start' di Google.
    """
    if 'dateTime' in start_info:
        dt_obj = datetime.datetime.fromisoformat(start_info['dateTime'])
        data_str = dt_obj.strftime('%Y-%m-%d')
        ora_str = dt_obj.strftime('%H:%M')
    elif 'date' in start_info:
        data_str = start_info['date']
        ora_str = '00:00'
    else:
        data_str = datetime.date.today().strftime('%Y-%m-%d')
        ora_str = '00:00'
        
    return data_str, ora_str

def sync_events():
    """
    Funzione principale di sincronizzazione.
    """
    print(f"\n[{datetime.datetime.now()}] Avvio ciclo di sincronizzazione...")
    
    service = get_calendar_service()
    if not service:
        return

    google_events = fetch_google_calendar_events(service)
    # Non terminiamo se non ci sono eventi, potremmo dover cancellare quelli vecchi
    
    conn = get_db_connection()
    cursor = conn.cursor()

    google_events_data = []
    google_event_ids = set()

    for event in google_events:
        event_id = event['id']
        google_event_ids.add(event_id)
        
        # --- CORREZIONE ANTI-MISMATCH ---
        # Ci assicuriamo che titolo e descrizione siano SEMPRE stringhe
        # 'or' gestisce elegantemente sia i campi mancanti che i valori None
        titolo = event.get('summary') or 'Nessun Titolo'
        descrizione = event.get('description') or ''
        # ---------------------------------
        
        data, ora = parse_event_datetime(event['start'])
        
        google_events_data.append((event_id, titolo, descrizione, data, ora))

    # --- Logica di Sincronizzazione ---
    try:
        # 1. Inseriamo o aggiorniamo (REPLACE) gli eventi di Google
        if google_events_data:
            cursor.executemany("""
            REPLACE INTO eventi (id, titolo, descrizione, data, ora)
            VALUES (?, ?, ?, ?, ?)
            """, google_events_data)
            print(f"Inseriti o aggiornati {len(google_events_data)} eventi nel DB.")
        else:
            print("Nessun evento futuro trovato su Google Calendar.")

        # 2. Cancelliamo gli eventi vecchi dal DB
        cursor.execute("SELECT id FROM eventi")
        db_event_ids = {row['id'] for row in cursor.fetchall()}
        
        ids_to_delete = db_event_ids - google_event_ids
        
        if ids_to_delete:
            print(f"Rimozione di {len(ids_to_delete)} eventi obsoleti/passati dal DB...")
            delete_list = [(event_id,) for event_id in ids_to_delete]
            cursor.executemany("DELETE FROM eventi WHERE id = ?", delete_list)

        conn.commit()
        print("Sincronizzazione DB completata.")

    except sqlite3.Error as e:
        print(f"ERRORE durante l'aggiornamento del database: {e}")
        conn.rollback()
    finally:
        conn.close()


def main():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print(f"ERRORE: File '{SERVICE_ACCOUNT_FILE}' non trovato.")
        print("Impossibile avviare la sincronizzazione.")
        return

    if not os.path.exists(DB_PATH):
        print(f"ERRORE: Database '{DB_PATH}' non trovato.")
        print("Esegui prima 'python backend/init_db.py' per inizializzare il database.")
        return

    print("Avvio del servizio di sincronizzazione con Google Calendar.")
    print(f"Database: {DB_PATH}")
    print(f"File Chiave: {SERVICE_ACCOUNT_FILE}")
    print(f"Il database verrà aggiornato ogni {SYNC_INTERVAL} secondi.")
    
    while True:
        try:
            sync_events()
        except Exception as e:
            print(f"Errore critico nel ciclo principale: {e}")
        
        print(f"Prossima sincronizzazione tra {SYNC_INTERVAL} secondi...")
        time.sleep(SYNC_INTERVAL)

if __name__ == "__main__":
    main()

