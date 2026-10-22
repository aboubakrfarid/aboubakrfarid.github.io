document.querySelector('.work-filters').hidden = false;
const mediaGroups = [...document.querySelectorAll('[data-work-kind]')];
const filterButtons = [...document.querySelectorAll('[data-work-filter]')];
const galleryDialog = document.querySelector('#image-viewer');
const galleryImage = galleryDialog.querySelector('img');
let galleryItems = [];
let galleryIndex = 0;
let galleryTrigger;

function updateFilterStatus() {
  const visible = mediaGroups.filter(group => !group.hidden).length;
  document.querySelector('#work-status').textContent =
    portfolioCopy[activeLanguage].filterStatus.replace('{count}', String(visible));
}

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    const kind = button.dataset.workFilter;
    document.querySelector('#work').dataset.filter = kind;
    for (const group of mediaGroups) {
      group.hidden = kind !== 'all' && group.dataset.workKind !== kind;
      if (group.hidden) for (const video of group.querySelectorAll('video')) video.pause();
    }
    for (const other of filterButtons) other.setAttribute('aria-pressed', String(other === button));
    updateFilterStatus();
  });
}

function renderGalleryImage() {
  const item = galleryItems[galleryIndex];
  const copy = portfolioCopy[activeLanguage];
  galleryImage.src = item.dataset.full;
  galleryImage.alt = copy[item.dataset.caption];
  document.querySelector('#viewer-caption').textContent = copy[item.dataset.caption];
  document.querySelector('#viewer-count').textContent = (galleryIndex + 1) + ' / ' + galleryItems.length;
}

for (const button of document.querySelectorAll('[data-gallery]')) {
  button.addEventListener('click', event => {
    event.preventDefault();
    galleryItems = [...document.querySelectorAll('[data-gallery]')].filter(item => item.dataset.gallery === button.dataset.gallery);
    galleryIndex = galleryItems.indexOf(button);
    galleryTrigger = button;
    renderGalleryImage();
    galleryDialog.showModal();
    document.body.classList.add('viewer-open');
    document.querySelector('#viewer-close').focus();
  });
}

function stepGallery(direction) {
  galleryIndex = (galleryIndex + direction + galleryItems.length) % galleryItems.length;
  renderGalleryImage();
}
document.querySelector('#viewer-previous').addEventListener('click', () => stepGallery(-1));
document.querySelector('#viewer-next').addEventListener('click', () => stepGallery(1));
document.querySelector('#viewer-close').addEventListener('click', () => galleryDialog.close());
galleryDialog.addEventListener('click', event => {
  if (event.target === galleryDialog) galleryDialog.close();
});
galleryDialog.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  galleryTrigger?.focus();
  galleryImage.removeAttribute('src');
});
galleryDialog.addEventListener('keydown', event => {
  if (event.key === 'Tab') {
    const first = document.querySelector('#viewer-close');
    const last = document.querySelector('#viewer-next');
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
  const direction = document.documentElement.dir === 'rtl' ? -1 : 1;
  if (event.key === 'ArrowRight') { event.preventDefault(); stepGallery(direction); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); stepGallery(-direction); }
});

for (const video of document.querySelectorAll('video')) {
  video.addEventListener('play', () => {
    for (const other of document.querySelectorAll('video')) if (other !== video) other.pause();
  });
  video.addEventListener('error', () => {
    video.closest('.video-case').querySelector('.video-error').hidden = false;
  });
}

document.addEventListener('portfolio-language-change', () => {
  updateFilterStatus();
  if (galleryDialog.open) renderGalleryImage();
});
updateFilterStatus();
