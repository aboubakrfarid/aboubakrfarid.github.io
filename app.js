const shots = [
  { image: 'assets/flach24-podcast.jpg', alt: 'podcastAlt', caption: 'heroCaption', link: 'https://lnkd.in/p/e5HZb_Nk' },
  { image: 'assets/nuxera-event.jpg', alt: 'eventAlt', caption: 'eventCaption', link: 'https://lnkd.in/p/eQeNYYc7' }
];
let shotIndex = 0;
let activeLanguage = 'fr';

function renderShot() {
  const shot = shots[shotIndex];
  const copy = portfolioCopy[activeLanguage];
  const image = document.querySelector('#featured-image');
  image.src = shot.image;
  image.alt = copy[shot.alt];
  document.querySelector('#featured-link').href = shot.link;
  document.querySelector('#featured-caption').textContent = copy[shot.caption];
  document.querySelector('.frame-count').textContent = String(shotIndex + 1).padStart(2, '0') + ' / 02';
}

function setLanguage(language) {
  activeLanguage = Object.hasOwn(portfolioCopy, language) ? language : 'fr';
  const copy = portfolioCopy[activeLanguage];
  document.documentElement.lang = activeLanguage;
  document.documentElement.dir = activeLanguage === 'ar' ? 'rtl' : 'ltr';
  for (const element of document.querySelectorAll('[data-i]')) {
    if (copy[element.dataset.i] !== undefined) element.innerHTML = copy[element.dataset.i];
  }
  for (const image of document.querySelectorAll('[data-alt]')) image.alt = copy[image.dataset.alt];
  for (const element of document.querySelectorAll('[data-label]')) element.setAttribute('aria-label', copy[element.dataset.label]);
  for (const button of document.querySelectorAll('[data-language]')) {
    button.setAttribute('aria-pressed', String(button.dataset.language === activeLanguage));
  }
  document.querySelector('nav').setAttribute('aria-label', copy.navigationLabel);
  document.querySelector('.logo-grid').setAttribute('aria-label', copy.organizationsLabel);
  document.querySelector('.community-logo-grid').setAttribute('aria-label', copy.communityLabel);
  document.querySelector('#previous-shot').setAttribute('aria-label', copy.previousShot);
  document.querySelector('#next-shot').setAttribute('aria-label', copy.nextShot);
  document.title = copy.pageTitle;
  document.querySelector('meta[name="description"]').content = copy.pageDescription;
  renderShot();
  document.dispatchEvent(new Event('portfolio-language-change'));
  try { localStorage.setItem('portfolio-language', activeLanguage); } catch {}
}

for (const button of document.querySelectorAll('[data-language]')) {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
}
document.querySelector('#previous-shot').addEventListener('click', () => {
  shotIndex = (shotIndex + shots.length - 1) % shots.length;
  renderShot();
});
document.querySelector('#next-shot').addEventListener('click', () => {
  shotIndex = (shotIndex + 1) % shots.length;
  renderShot();
});
let savedLanguage;
try { savedLanguage = localStorage.getItem('portfolio-language'); } catch {}
setLanguage(savedLanguage);
document.querySelector('#year').textContent = new Date().getFullYear();
