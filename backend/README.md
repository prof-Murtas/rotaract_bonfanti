# Istruzioni per l'Integrazione con Google Calendar

Per permettere al nostro script Python di leggere il tuo Google Calendar, devi configurare un **Service Account** (un account bot) sulla Google Cloud Platform.

---

## 🧩 Passaggio 1: Configura Google Cloud e l'API

### 1. Crea un Progetto
Vai alla [Google Cloud Console](https://console.cloud.google.com/) e crea un nuovo progetto (es. **"Sync Calendario"**).

### 2. Abilita l'API di Google Calendar
- Nel tuo progetto, vai su **"API e servizi" > "Libreria"**  
- Cerca **"Google Calendar API"** e abilitala

### 3. Crea un Service Account
- Vai su **"API e servizi" > "Credenziali"**
- Clicca su **"Crea credenziali" > "Account di servizio"**
- Dagli un nome (es. `calendar-sync-bot`) e fai clic su **"Crea e continua"**
- (Opzionale) Puoi saltare la parte di "Concedi accesso al progetto"
- Clicca su **"Fine"**

### 4. Genera la Chiave JSON
- Trova nella lista l’account di servizio appena creato
- Clicca sul suo indirizzo email
- Vai alla scheda **"CHIAVI"**
- Clicca su **"AGGIUNGI CHIAVE" > "Crea nuova chiave"**
- Scegli **JSON** come tipo e fai clic su **"Crea"**
- Verrà scaricato un file `.json` → rinominalo in **service_account.json**
- Posizionalo nella **stessa cartella dei tuoi script Python**  
  ⚠️ *Questo file è segreto!*

---

## 🔗 Passaggio 2: Condividi il tuo Google Calendar

Ora devi dare al tuo “bot” il permesso di leggere il tuo calendario.

### 1. Trova l'Email del Bot
Apri `service_account.json` e copia il valore del campo `"client_email"`, che termina con `...gserviceaccount.com`.

### 2. Condividi il Calendario
1. Apri [Google Calendar](https://calendar.google.com/)
2. Trova il calendario da sincronizzare → clicca sui tre puntini → **"Impostazioni e condivisione"**
3. Nella sezione **"Condividi con persone o gruppi specifici"**, clicca su **"Aggiungi persone e gruppi"**
4. Incolla l'indirizzo email del bot
5. Imposta i permessi su:
   - ✅ *Vedere tutti i dettagli degli eventi*  
   - *(oppure “Apportare modifiche agli eventi” se vuoi anche scrivere)*
6. Clicca su **"Invia"**

---

## 🧭 Passaggio 3: Trova il tuo ID Calendario

Sempre in **"Impostazioni e condivisione"**, scorri fino alla sezione **"Integra calendario"** e copia il valore di **"ID calendario"**.

- Per il calendario principale → di solito è il tuo indirizzo email  
- Per altri calendari → è una lunga stringa che termina con `@group.calendar.google.com`

📋 Incolla questo ID nel tuo file `sync_calendar.py`.

---

## ⚙️ Passaggio 4: Installa le Librerie Python

Per installare le librerie necessarie avviare install_requirements.py

```

---

## 🚀 Passaggio 5: Esegui l'Applicazione

Eseguire avvio.py per eseguire tutti gli script necessari per il backend

Ora, `sync_calendar.py` controllerà il tuo Google Calendar **ogni 5 minuti** e aggiornerà il database.  
Il tuo **server Flask** mostrerà sempre i dati più recenti.
