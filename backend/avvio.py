import subprocess
import sys
import time
import os

# --- CONFIGURAZIONE PERCORSI ---
# Questo script deve essere nella cartella principale del progetto
# (un livello sopra 'backend/')
BACKEND_DIR = "backend" 
INIT_SCRIPT = os.path.join(BACKEND_DIR, "init_db.py")
APP_SCRIPT = os.path.join(BACKEND_DIR, "app.py")
SYNC_SCRIPT = os.path.join(BACKEND_DIR, "update_calendar.py")

# Usa lo stesso interprete Python (es. quello del venv)
PYTHON_EXECUTABLE = sys.executable
# -------------------------------

def check_files():
    """Controlla che tutti gli script necessari esistano."""
    print("Verifica dei file necessari...")
    files_to_check = [INIT_SCRIPT, APP_SCRIPT, SYNC_SCRIPT]
    all_found = True
    for f in files_to_check:
        if not os.path.exists(f):
            print(f"ERRORE: File non trovato: {f}")
            all_found = False
    
    if not all_found:
        print("\nAssicurati che 'start.py' sia nella cartella principale")
        print("e che la cartella 'backend' contenga tutti gli script.")
        sys.exit(1)
    print("Tutti i file sono stati trovati.")

def main():
    check_files()
    
    print("\n--- Avvio del Progetto Rotaract Trento ---")

    # 1. Eseguire init_db.py (e attendere)
    print(f"\n1. Eseguo lo script di inizializzazione DB ({INIT_SCRIPT})...")
    try:
        # Usiamo 'run' che attende il completamento
        result = subprocess.run(
            [PYTHON_EXECUTABLE, INIT_SCRIPT], 
            check=True, 
            capture_output=True, # Cattura stdout/stderr
            text=True,
            encoding='utf-8' # Specifica l'encoding
        )
        print(f"   ... Output init_db: {result.stdout.strip()}")
        print("   ... Database inizializzato con successo.")
    except subprocess.CalledProcessError as e:
        print(f"ERRORE durante l'inizializzazione del database:")
        print(e.stderr)
        sys.exit(1) # Esce se il DB fallisce
    except FileNotFoundError:
        print(f"ERRORE: Il comando '{PYTHON_EXECUTABLE}' non è stato trovato.")
        print("Assicurati che Python sia installato e nel tuo PATH.")
        sys.exit(1)

    # 2. Avviare i processi in background
    app_process = None
    sync_process = None
    
    try:
        # 3. Avviare app.py (usando Popen)
        print(f"\n2. Avvio del server API ({APP_SCRIPT})...")
        # Usiamo 'Popen' per avviare in background
        app_process = subprocess.Popen(
            [PYTHON_EXECUTABLE, APP_SCRIPT],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8'
        )
        print(f"   ... Server avviato (PID: {app_process.pid}).")
        
        # Pausa breve per far partire il server prima del sync
        print("   Attendere 2 secondi...")
        time.sleep(2) 
        
        # 4. Avviare sync_calendar.py (usando Popen)
        print(f"\n3. Avvio dello script di sincronizzazione ({SYNC_SCRIPT})...")
        sync_process = subprocess.Popen(
            [PYTHON_EXECUTABLE, SYNC_SCRIPT],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8'
        )
        print(f"   ... Sync avviato (PID: {sync_process.pid}).")

        print("\n" + "="*40)
        print("--- SERVIZI IN ESECUZIONE ---")
        print("API Server e Calendar Sync sono attivi.")
        print("\nPremi Ctrl+C per fermare tutti i processi.")
        print("="*40)
        
        # Leggi l'output in tempo reale (opzionale ma utile per debug)
        while True:
            # Qui potremmo leggere app_process.stdout.readline() ecc.
            # Per ora, lo lasciamo girare
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n\n--- Rilevato Ctrl+C ---")
        print("Chiusura dei processi in background...")
        
    finally:
        # Termina i processi in ordine inverso
        if sync_process and sync_process.poll() is None:
            print(f"Fermo il processo Sync (PID: {sync_process.pid})...")
            sync_process.terminate() # Invia SIGTERM
            sync_process.wait() # Attende la chiusura
        if app_process and app_process.poll() is None:
            print(f"Fermo il processo Server (PID: {app_process.pid})...")
            app_process.terminate()
            app_process.wait()
        
        print("\nTutti i processi sono stati fermati. Arrivederci.")

if __name__ == "__main__":
    main()
