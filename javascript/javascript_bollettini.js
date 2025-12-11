const API_URL = 'http://localhost:5000/api/bollettini';
const container = document.getElementById('bollettini-container');
const searchInput = document.getElementById('search-bollettini');
let bollettini = [];

function humanFileSize(bytes) {
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) return bytes + ' B';
  const units = ['KB','MB','GB','TB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
}

function renderList(list) {
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML =
      '<div class="event-card empty-placeholder"><p>Nessun bollettino disponibile al momento.</p></div>';
    return;
  }
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bollettino-card';
    const meta = document.createElement('div');
    meta.className = 'bollettino-meta';
    const title = document.createElement('h4');
    title.textContent = item.title || item.filename;
    const info = document.createElement('p');
    info.textContent = `${item.modified_short} • ${item.size_human}`;
    meta.appendChild(title);
    meta.appendChild(info);
    const actions = document.createElement('div');
    actions.className = 'bollettino-actions';
    const view = document.createElement('a');
    view.href = item.preview_url;
    view.target = '_blank';
    view.rel = 'noopener';
    view.textContent = 'Apri';
    const download = document.createElement('a');
    download.href = item.download_url;
    download.textContent = 'Scarica';
    actions.appendChild(view);
    actions.appendChild(download);
    card.appendChild(meta);
    card.appendChild(actions);
    container.appendChild(card);
  });
}

function applyFilter() {
  const q = searchInput.value.trim().toLowerCase();
  renderList(!q ? bollettini : bollettini.filter(b =>
    (b.title + ' ' + b.filename).toLowerCase().includes(q)
  ));
}

async function loadBollettini() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Errore ${res.status}`);
    const data = await res.json();
    bollettini = data.map(b => ({
      filename: b.filename,
      title: b.title || b.filename.replace('.pdf', ''),
      preview_url: b.preview_url,
      download_url: b.download_url,
      size: b.size,
      size_human: humanFileSize(b.size || 0),
      modified: b.modified,
      modified_short: new Date(b.modified).toLocaleDateString()
    })).sort((a,b) => new Date(b.modified) - new Date(a.modified));
    renderList(bollettini);
  } catch(err) {
    console.error(err);
    container.innerHTML =
      '<div class="event-card static-placeholder"><p>Errore nel caricamento. Riprova più tardi.</p></div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if(searchInput) searchInput.addEventListener('input', applyFilter);
  loadBollettini();
});
