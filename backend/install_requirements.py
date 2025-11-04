import os
import sys
import subprocess

# Librerie necessarie
packages = [
    "flask",
    "flask-cors",
    "sqlite3-binary",  # fallback, sqlite è già built-in ma serve in alcuni ambienti
    "requests",
    "python-dotenv",
    # Librerie aggiunte per Google Calendar
    "google-api-python-client",
    "google-auth-httplib2",
    "google-auth-oauthlib"
]

print("🔧 Installazione librerie per il progetto Rotaract Trento...\n")

# Aggiorniamo pip per sicurezza
try:
    print("➡️  Aggiorno pip...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
except subprocess.CalledProcessError as e:
    print(f"⚠️ Attenzione: impossibile aggiornare pip. {e}")


for package in packages:
    try:
        print(f"➡️  Installo {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
    except subprocess.CalledProcessError:
        print(f"❌ Errore nell’installazione di {package}. Controlla la connessione o i permessi.")

print("\n✅ Tutte le librerie dovrebbero essere installate correttamente!")
print("Puoi ora avviare il tuo server Flask con: python app.py")
print("E lo script di sincronizzazione in un altro terminale con: python sync_calendar.py")
