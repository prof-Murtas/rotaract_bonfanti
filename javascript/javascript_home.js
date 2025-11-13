// --- Codice Esistente per Menu Mobile ---

// Selezioni DOM principali
const menu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

/*
Listener sul click dell'icona menu (hamburger)
*/
if (menu && navLinks) {
    menu.addEventListener("click", () => {
        navLinks.classList.toggle("show");

        // Aggiorniamo aria-expanded per migliorare l'accessibilità:
        const expanded = menu.getAttribute("aria-expanded") === "true";
        menu.setAttribute("aria-expanded", (!expanded).toString());
    });
}


// --- NUOVO CODICE PER EVENTI DINAMICI ---

/**
 * Attende che il DOM sia completamente caricato prima di eseguire lo script
 * per caricare gli eventi.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadUpcomingEvents();
});

/**
 * Carica i prossimi 2 eventi dall'API e li inserisce nella pagina.
 */
async function loadUpcomingEvents() {
    // Seleziona il contenitore dove inserire gli eventi
    const container = document.getElementById('event-preview-container');
    
    // Se il contenitore non è in questa pagina, interrompi
    if (!container) {
        // console.log("Nessun contenitore eventi su questa pagina.");
        return; 
    }

    // URL dell'API Flask (deve essere in esecuzione su localhost:5000)
    const API_URL = 'http://localhost:5000/api/eventi';

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            // Se il server risponde con un errore (es. 500)
            throw new Error(`Errore HTTP: ${response.status}`);
        }
        
        const allEvents = await response.json();

        // 2. Filtra gli eventi per trovare i prossimi
        // Ottiene la data di oggi in formato 'YYYY-MM-DD'
        const today = new Date().toISOString().split('T')[0]; 
        
        // Filtra: tiene solo gli eventi con data >= oggi
        const upcomingEvents = allEvents.filter(event => event.data >= today);
        
        // 3. Prendi solo i primi due
        const nextTwoEvents = upcomingEvents.slice(0, 2);

        // 4. Pulisci il contenitore (rimuove "Caricamento...")
        container.innerHTML = '';

        // 5. Genera e inserisci l'HTML per gli eventi
        if (nextTwoEvents.length > 0) {
            nextTwoEvents.forEach(event => {
                // Crea un nuovo div .event-card
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                
                // Formatta la data per una migliore leggibilità
                const formattedDate = formatEventDate(event.data);
                
                // Crea l'HTML interno per la card
                eventCard.innerHTML = `
                    <h4>${event.titolo}</h4>
                    <p>${formattedDate} – Ore: ${event.ora}</p>
                `;
                
                // Aggiunge la card al contenitore
                container.appendChild(eventCard);
            });
        } else {
            // Se non ci sono eventi futuri
            container.innerHTML = '<p class="no-events">Nessun evento in programma al momento.</p>';
        }

    } catch (error) {
        console.error('Impossibile caricare gli eventi:', error);
        // In caso di errore (es. server spento), mostra un messaggio
        container.innerHTML = '<p class="error-events">Impossibile caricare gli eventi. Assicurati che il server sia attivo.</p>';
    }
}

/**
 * Formatta una data YYYY-MM-DD in un formato leggibile (es. "Sabato 15 Novembre 2025")
 * @param {string} dateString - La data in formato 'YYYY-MM-DD'
 * @returns {string} - La data formattata
 */
function formatEventDate(dateString) {
    // Aggiungiamo T00:00:00 per evitare problemi di timezone (fuso orario)
    // che potrebbero far slittare la data al giorno prima.
    const date = new Date(dateString + 'T00:00:00');
    
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Europe/Rome' // Assicura che la data sia interpretata in fuso italiano
    };
    
    // Converte la data in stringa (es. "sabato 15 novembre 2025")
    let formatted = new Intl.DateTimeFormat('it-IT', options).format(date);
    
    // Capitalizza la prima lettera (es. "Sabato 15 novembre 2025")
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
