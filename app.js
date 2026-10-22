const languageButton = document.querySelector('#language');
const shots = [
  { image: 'assets/flach24-podcast.jpg', alt: 'podcastAlt', caption: 'heroCaption', link: 'https://lnkd.in/p/e5HZb_Nk' },
  { image: 'assets/nuxera-event.jpg', alt: 'eventAlt', caption: 'eventCaption', link: 'https://lnkd.in/p/eQeNYYc7' }
];
let shotIndex = 0;
let activeLanguage = 'en';

function renderShot() {
  const shot = shots[shotIndex];
  const copy = portfolioCopy[activeLanguage];
  const image = document.querySelector('#featured-image');
  image.src = shot.image;
  image.alt = copy[shot.alt];
  document.querySelector('#featured-link').href = shot.link;
  document.querySelector('#featured-caption').textContent = copy[shot.caption];
  document.querySelector('.frame-count').textContent = `${String(shotIndex + 1).padStart(2, '0')} / 02`;
}

function setLanguage(language) {
  activeLanguage = language === 'ar' ? 'ar' : 'en';
  const arabic = activeLanguage === 'ar';
  const copy = portfolioCopy[activeLanguage];
  document.documentElement.lang = activeLanguage;
  document.documentElement.dir = arabic ? 'rtl' : 'ltr';
  for (const element of document.querySelectorAll('[data-i]')) {
    const value = copy[element.dataset.i];
    if (value !== undefined) element.innerHTML = value;
  }
  for (const image of document.querySelectorAll('[data-alt]')) {
    image.alt = copy[image.dataset.alt];
  }
  document.querySelector('nav').setAttribute('aria-label', arabic ? 'التنقل الرئيسي' : 'Main navigation');
  document.querySelector('.logo-grid').setAttribute('aria-label', arabic ? 'جهات من تجاربي المهنية' : 'Selected organizations');
  document.querySelector('.community-logo-grid').setAttribute('aria-label', arabic ? 'جهات من العمل الجمعوي والإنساني' : 'Community and humanitarian organizations');
  document.querySelector('#previous-shot').setAttribute('aria-label', copy.previousShot);
  document.querySelector('#next-shot').setAttribute('aria-label', copy.nextShot);
  languageButton.textContent = arabic ? 'English' : 'العربية';
  languageButton.lang = arabic ? 'en' : 'ar';
  languageButton.setAttribute('aria-label', arabic ? 'Switch to English' : 'التبديل إلى العربية');
  document.title = arabic ? 'أبوبكر فريد — التصوير والفيديو' : 'Aboubakr Farid — Photography & Film';
  renderShot();
  try { localStorage.setItem('portfolio-language', activeLanguage); } catch {}
}

languageButton.addEventListener('click', () => setLanguage(activeLanguage === 'ar' ? 'en' : 'ar'));
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
setLanguage(savedLanguage === 'ar' ? 'ar' : 'en');
document.querySelector('#year').textContent = new Date().getFullYear();
