document.addEventListener('DOMContentLoaded', () => {
    // 1. Gestione Menu Mobile (Navbar)
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });

        // Chiudi il menu se si clicca un link in modalità mobile
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    navLinks.classList.remove('show');
                }
            });
        });
    }


    // 2. Gestione Modulo di Contatto (Simulazione)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Blocca l'invio reale del form

            // Qui dovresti implementare l'invio dei dati a un server (es. Fetch API)
            // Per ora, simuliamo un messaggio di successo

            formStatus.style.color = 'var(--rotaract-pink)';
            formStatus.textContent = 'Invio in corso...';
            
            // Simula un ritardo di rete
            setTimeout(() => {
                // Dopo l'invio simulato:
                
                // Puoi resettare il form
                contactForm.reset();
                
                // Mostra il messaggio di successo
                formStatus.style.color = '#28a745'; // Colore verde per successo
                formStatus.textContent = '✅ Messaggio inviato con successo! Ti risponderemo al più presto.';

                // Rimuovi il messaggio dopo qualche secondo
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);

            }, 1500); 
        });
    }
});