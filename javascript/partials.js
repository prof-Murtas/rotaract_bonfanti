function insertHeaderFooter() {
  const headerHTML = `
  <header class="navbar">
      <div class="logo">
          <img src="../media/homepage/logo.png" alt="Rotaract Trento Logo">
          <h1>Rotaract Trento</h1>
      </div>
      <nav class="nav-links" id="main-nav" aria-label="Navigazione principale">
          <a href="index.html">Home</a>
          <a href="chi_siamo.html">Chi siamo</a>
          <a href="storia.html">Storia</a>
          <a href="calendario.html">Calendario</a>
          <a href="bollettini.html">Bollettini</a>
          <a href="contatti.html">Contatti</a>
      </nav>
      <div class="menu-toggle" id="mobile-menu" role="button" aria-controls="main-nav" aria-expanded="false" tabindex="0">
          &#9776;
      </div>
  </header>
  `;

  const footerHTML = `
  <footer class="footer">
    <p>© 2025 Rotaract Club Trento — Tutti i diritti riservati</p>
    <div class="socials">
      <a href="https://www.instagram.com/rotaractclubtrento/" aria-label="Instagram">
        <img src="../media/homepage/icon_instagram.svg" alt="Instagram">
      </a>
      <a href="https://www.facebook.com/rotaracttrento/?locale=it_IT" aria-label="Facebook">
        <img src="../media/homepage/icon_facebook.svg" alt="Facebook">
      </a>
      <a href="mailto:info@iltuodominio.it" aria-label="Email">
        <img src="../media/homepage/icon_mail.svg" alt="Email">
      </a>
    </div>
  </footer>
  `;

  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');
  if(headerContainer) headerContainer.innerHTML = headerHTML;
  if(footerContainer) footerContainer.innerHTML = footerHTML;

  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.getElementById('main-nav');
  if(menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
      menuToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
    });
  }
}

document.addEventListener('DOMContentLoaded', insertHeaderFooter);
