document.addEventListener('DOMContentLoaded', () => {
    // Navbar mobile toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });

    }

    // *** TUTTA LA LOGICA DI INVIO FORM È STATA RIMOSSA ***
});