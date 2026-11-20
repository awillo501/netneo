const catalog = [
  {title:'The Long Road',type:'Movies',genre:'Adventure · Drama',year:'2025',rating:'Feature',tag:'FEATURED',a:'#be5c4b',b:'#242741'},
  {title:'Accra After Dark',type:'African',genre:'Ghana · Drama',year:'2024',rating:'Feature',tag:'AFRICAN STORY',a:'#bd6549',b:'#422334'},
  {title:'Wild Current',type:'Movies',genre:'Thriller · Mystery',year:'2025',rating:'Feature',tag:'NEW',a:'#226c72',b:'#132735'},
  {title:'Little Planet',type:'Animation',genre:'Animation · Family',year:'2024',rating:'Family',tag:'ANIMATION',a:'#4597b3',b:'#472968'},
  {title:'Lagos Frequencies',type:'Music',genre:'Live · Afrobeats',year:'2025',rating:'Music',tag:'MUSIC',a:'#d08535',b:'#57264e'},
  {title:'The Baobab Promise',type:'African',genre:'Senegal · Adventure',year:'2023',rating:'Feature',tag:'AFRICAN STORY',a:'#de9c53',b:'#354737'},
  {title:'Orbiters',type:'Animation',genre:'Animation · Sci-Fi',year:'2025',rating:'Family',tag:'ANIMATION',a:'#5371c1',b:'#252044'},
  {title:'Midnight in Nairobi',type:'African',genre:'Kenya · Romance',year:'2024',rating:'Feature',tag:'AFRICAN STORY',a:'#873e53',b:'#24233e'},
  {title:'Soundcheck: Live',type:'Music',genre:'Concert · Documentary',year:'2024',rating:'Music',tag:'MUSIC',a:'#b74450',b:'#30234e'},
  {title:'Paper Kingdom',type:'Movies',genre:'Fantasy · Family',year:'2023',rating:'Feature',tag:'TRENDING',a:'#55967e',b:'#222c46'}
];

const grid = document.getElementById('catalogGrid');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const backdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
let activeFilter = 'All';
let toastTimer;
let authMode = 'signin';

function getSaved(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function renderCatalog() {
  const query = searchInput.value.trim().toLowerCase();
  const items = catalog.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
    const matchesSearch = `${item.title} ${item.genre} ${item.type}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
  grid.innerHTML = items.map((item, index) => `
    <article class="content-card">
      <div class="poster" style="--poster-a:${item.a};--poster-b:${item.b}">
        <div class="poster-art" aria-hidden="true"></div>
        <div class="card-top"><span class="type-tag">${item.tag}</span><span class="rating-tag">${item.rating}</span></div>
        <div class="poster-title"><span>${item.year} · NETNEO PICKS</span>${item.title}</div>
        <div class="card-controls">
          <button type="button" data-play="${item.title}" aria-label="View ${item.title}">▶</button>
          <button type="button" data-download="${item.title}" aria-label="Save ${item.title} to downloads">↓</button>
        </div>
      </div>
      <div class="card-meta"><h3>${item.title}</h3><p>${item.genre} · ${item.year}</p></div>
    </article>`).join('');
  emptyState.hidden = items.length > 0;
  updateDownloadCount();
}
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
function openModal(content) {
  modalContent.innerHTML = content;
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  const firstField = modalContent.querySelector('input,button,select,textarea');
  if (firstField) firstField.focus();
}
function closeModal() {
  backdrop.hidden = true;
  document.body.style.overflow = '';
}
function updateAuthButton() {
  const user = localStorage.getItem('netneoDemoUser');
  document.getElementById('authButton').textContent = user ? user.split('|')[0] : 'Sign in';
}
function updateDownloadCount() {
  document.getElementById('downloadCount').textContent = getSaved('netneoDemoDownloads').length;
}
function showAuth(mode = 'signin') {
  authMode = mode;
  const isSignup = mode === 'signup';
  const user = localStorage.getItem('netneoDemoUser');
  if (user && !isSignup) {
    const [name, email] = user.split('|');
    openModal(`<p class="eyebrow">YOUR NETNEO PROFILE</p><h2 id="modalTitle"></h2><p>This is a local demo profile on this browser.</p><div class="account-row"><span id="profileEmail"></span><button type="button" id="signoutButton">Sign out</button></div><p class="modal-note">Demo profile data is stored only in this browser. This is not a secure production sign-in.</p>`);
    document.getElementById('modalTitle').textContent = `Welcome, ${name}.`;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('signoutButton').addEventListener('click', () => { localStorage.removeItem('netneoDemoUser'); updateAuthButton(); closeModal(); showToast('Signed out of this demo.'); });
    return;
  }
  openModal(`<p class="eyebrow">${isSignup ? 'JOIN NETNEO' : 'GOOD TO SEE YOU'}</p><h2 id="modalTitle">${isSignup ? 'Create your account' : 'Sign in to NETNEO'}</h2><p>${isSignup ? 'Create a local demo profile to explore the experience.' : 'Use your demo profile to continue.'}</p><form id="authForm">${isSignup ? '<label for="authName">Name</label><input id="authName" name="name" autocomplete="name" required maxlength="60" placeholder="Your name" />' : ''}<label for="authEmail">Email</label><input id="authEmail" name="email" type="email" autocomplete="email" required maxlength="120" placeholder="you@example.com" /><label for="authPassword">Password</label><input id="authPassword" name="password" type="password" autocomplete="${isSignup ? 'new-password' : 'current-password'}" required minlength="6" placeholder="At least 6 characters" /><button class="primary-button" type="submit">${isSignup ? 'Create demo account' : 'Sign in'}</button></form><p class="modal-note">Demo only: credentials are not sent to a server or used for real authentication.</p><p class="switch-auth">${isSignup ? 'Already have a demo profile?' : 'New to NETNEO?'} <button type="button" class="link-button" id="authSwitch">${isSignup ? 'Sign in' : 'Create an account'}</button></p>`);
  document.getElementById('authSwitch').addEventListener('click', () => showAuth(isSignup ? 'signin' : 'signup'));
  document.getElementById('authForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = isSignup ? form.get('name').trim() : form.get('email').split('@')[0];
    localStorage.setItem('netneoDemoUser', `${name}|${form.get('email').trim()}`);
    updateAuthButton(); closeModal(); showToast(isSignup ? 'Demo profile created on this device.' : 'Signed in to the local demo.');
  });
}
function showDownloads() {
  const saved = getSaved('netneoDemoDownloads');
  openModal(`<p class="eyebrow">YOUR LIBRARY</p><h2 id="modalTitle">Downloads</h2><p>Saved titles for this demo browser:</p>${saved.length ? `<ul class="saved-list">${saved.map(title => `<li>${title}<small>Listing saved only — no video or audio file was downloaded.</small></li>`).join('')}</ul>` : '<p>Your downloads list is empty. Save a title from the collection to see it here.</p>'}<p class="modal-note">Actual offline playback requires licensed media files, secure storage and a streaming app/backend.</p>`);
}
function showAdForm() {
  openModal(`<p class="eyebrow">CREATOR &amp; RIGHTS HOLDER INQUIRY</p><h2 id="modalTitle">Advertise on NETNEO</h2><p>Share your campaign details. This demo does not send or store submissions.</p><form id="adForm"><label for="adName">Name or organization</label><input id="adName" name="name" required maxlength="80" placeholder="Your name or company" /><label for="adEmail">Contact email</label><input id="adEmail" name="email" type="email" required maxlength="120" placeholder="you@example.com" /><label for="adType">What would you like to promote?</label><select id="adType" name="type"><option>Film or series</option><option>Music or event</option><option>Brand advertisement</option><option>Other</option></select><label for="adDetails">Campaign details</label><textarea id="adDetails" name="details" required maxlength="600" placeholder="Tell us about the content, rights and campaign dates"></textarea><button class="primary-button" type="submit">Preview inquiry</button></form><p class="modal-note">Real advertising needs a business, privacy and campaign-review process before taking payment.</p>`);
  document.getElementById('adForm').addEventListener('submit', event => {
    event.preventDefault(); closeModal(); showToast('Inquiry previewed. A production service needs a secure submission backend.');
  });
}

document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.toggle('selected', chip === button));
  renderCatalog();
}));
searchInput.addEventListener('input', renderCatalog);
document.getElementById('searchToggle').addEventListener('click', () => {
  document.getElementById('searchBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
  searchInput.focus({ preventScroll: true });
});
document.getElementById('authButton').addEventListener('click', () => showAuth());
document.getElementById('downloadsButton').addEventListener('click', showDownloads);
document.getElementById('adOpen').addEventListener('click', showAdForm);
document.getElementById('subscribeButton').addEventListener('click', () => openModal(`<p class="eyebrow">MEMBERSHIP</p><h2 id="modalTitle">Plans are coming later.</h2><p>Membership prices, regional availability, billing, cancellation and payment security need to be configured in a production service first.</p><p class="modal-note">This demo does not collect payment details or start a subscription.</p><button type="button" class="primary-button" id="membershipClose">Got it</button>`));
document.addEventListener('click', event => {
  const playButton = event.target.closest('[data-play]');
  const downloadButton = event.target.closest('[data-download]');
  const filterLink = event.target.closest('[data-select-filter]');
  if (playButton) {
    const title = playButton.dataset.play;
    openModal(`<p class="eyebrow">TITLE PREVIEW</p><h2 id="modalTitle">${title}</h2><p>This is a catalog sample, not a playable movie. Add a rights-cleared media source and streaming backend to enable playback.</p><button type="button" class="primary-button" id="previewClose">Close preview</button>`);
  }
  if (downloadButton) {
    const title = downloadButton.dataset.download;
    const saved = getSaved('netneoDemoDownloads');
    if (!saved.includes(title)) { saved.push(title); localStorage.setItem('netneoDemoDownloads', JSON.stringify(saved)); renderCatalog(); showToast('Added to your demo downloads list. No media file was downloaded.'); }
    else showToast('This title is already in your demo downloads list.');
  }
  if (filterLink) {
    activeFilter = filterLink.dataset.selectFilter;
    document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.toggle('selected', chip.dataset.filter === activeFilter));
    renderCatalog();
  }
  if (event.target.id === 'previewClose' || event.target.id === 'membershipClose') closeModal();
});
document.getElementById('modalClose').addEventListener('click', closeModal);
backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !backdrop.hidden) closeModal(); });
document.getElementById('year').textContent = new Date().getFullYear();
updateAuthButton();
renderCatalog();
