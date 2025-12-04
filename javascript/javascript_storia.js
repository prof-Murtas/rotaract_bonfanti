document.addEventListener("DOMContentLoaded", () => {

  // =============================
  // MENU MOBILE
  // =============================
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.getElementById('main-nav');

  menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
      menuToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
  });

  // =============================
  // CARICAMENTO TIMELINE DAL CSV
  // =============================
  fetch('../csv/storia.csv')
    .then(response => response.text())
    .then(data => {
      const lines = data.split('\n').slice(1); // rimuove header
      const table = document.getElementById('tabTempo');

      let riga = null;
      lines.forEach((line, index) => {
        if(line.trim() === '') return;
        const [anno, presidente] = line.split(',');

        // Ogni due presidenti crea una nuova riga (serpentina)
        if(index % 2 === 0){
          riga = table.insertRow();
          riga.className = 'rigaTempo';
        }

        const cella = riga.insertCell();
        cella.innerHTML = `<span class="year">${anno}</span><span class="pres">${presidente}</span>`;
      });
    })
    .catch(error => console.error('Errore caricamento CSV:', error));

});
