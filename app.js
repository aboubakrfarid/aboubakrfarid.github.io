let activeLanguage = 'fr';


function setLanguage(language) {
  activeLanguage = Object.hasOwn(portfolioCopy, language) ? language : 'fr';
  const copy = portfolioCopy[activeLanguage];
  document.documentElement.lang = activeLanguage;
  document.documentElement.dir = activeLanguage === 'ar' ? 'rtl' : 'ltr';
  for (const element of document.querySelectorAll('[data-i]')) {
    const text = copy[element.dataset.i];
    if (text !== undefined && element.innerHTML !== text) element.innerHTML = text;
  }
  for (const image of document.querySelectorAll('[data-alt]')) image.alt = copy[image.dataset.alt];
  for (const element of document.querySelectorAll('[data-label]')) element.setAttribute('aria-label', copy[element.dataset.label]);
  for (const button of document.querySelectorAll('[data-language]')) {
    button.setAttribute('aria-pressed', String(button.dataset.language === activeLanguage));
  }
  document.querySelector('nav').setAttribute('aria-label', copy.navigationLabel);
  document.querySelector('.logo-grid').setAttribute('aria-label', copy.organizationsLabel);
  document.querySelector('.community-logo-grid').setAttribute('aria-label', copy.communityLabel);
  document.title = copy.pageTitle;
  const metadata = {
    'meta[name="description"]': copy.pageDescription,
    'meta[property="og:title"]': copy.pageTitle,
    'meta[property="og:description"]': copy.pageDescription,
    'meta[property="og:locale"]': copy.pageLocale,
    'meta[property="og:image:alt"]': copy.portraitAlt,
    'meta[name="twitter:title"]': copy.pageTitle,
    'meta[name="twitter:description"]': copy.pageDescription,
    'meta[name="twitter:image:alt"]': copy.portraitAlt,
  };
  for (const [selector, content] of Object.entries(metadata)) {
    document.querySelector(selector).content = content;
  }
  document.dispatchEvent(new Event('portfolio-language-change'));
  try { localStorage.setItem('portfolio-language', activeLanguage); } catch {}
}

for (const button of document.querySelectorAll('[data-language]')) {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
}
let savedLanguage;
try { savedLanguage = localStorage.getItem('portfolio-language'); } catch {}
setLanguage(savedLanguage);
document.querySelector('#year').textContent = new Date().getFullYear();
