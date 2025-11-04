// Selezioni DOM principali
// getElementById è efficiente per selezionare l'elemento con id "mobile-menu"
const menu = document.getElementById("mobile-menu");
// querySelector con classe seleziona il blocco di link della nav
const navLinks = document.querySelector(".nav-links");

/*
Listener sul click dell'icona menu (hamburger)
- Quando l'utente clicca l'icona toggliamo la classe 'show' su .nav-links:
  la classe .show è definita in CSS per mostrare il pannello menu su dispositivi mobili.
- Non manipoliamo direttamente proprietà di stile inline: lasciamo che sia il CSS a gestire il layout.
*/
menu.addEventListener("click", () => {
    navLinks.classList.toggle("show");

    // Aggiorniamo aria-expanded per migliorare l'accessibilità:
    // - aria-expanded="true" segnala agli screen reader che il pannello è aperto
    // - aria-expanded="false" segnala che è chiuso
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", (!expanded).toString());
});
