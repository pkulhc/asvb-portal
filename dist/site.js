const masthead = document.querySelector('.masthead');
const menu = masthead.querySelector('.menu-toggle');
const navigation = masthead.querySelector('.site-nav');
const narrow = window.matchMedia('(max-width: 700px)');

function toggleNavigation(open) {
  masthead.classList.toggle('menu-open', open);
  menu.setAttribute('aria-expanded', String(open));
}

masthead.classList.add('nav-ready');
menu.addEventListener('click', () => toggleNavigation(menu.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) toggleNavigation(false);
});
document.addEventListener('click', event => {
  if (!masthead.contains(event.target)) toggleNavigation(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    toggleNavigation(false);
    menu.focus();
  }
});
masthead.addEventListener('focusout', event => {
  if (event.relatedTarget && !masthead.contains(event.relatedTarget)) toggleNavigation(false);
});
narrow.addEventListener('change', () => toggleNavigation(false));
window.addEventListener('pageshow', () => toggleNavigation(false));

const languageLink = document.querySelector('[data-language]');
const alternativePage = languageLink.getAttribute('href');
function mirrorSection() {
  languageLink.setAttribute('href', alternativePage + location.hash);
}
mirrorSection();
window.addEventListener('hashchange', mirrorSection);

const sectionNav = document.querySelector('.section-nav');
if (sectionNav) {
  const track = sectionNav.querySelector('.wrap');
  const items = Array.from(track.querySelectorAll('a'), link => ({
    link,
    section: document.getElementById(link.hash.slice(1))
  }));
  let current;
  let queued = false;

  function highlightSection() {
    queued = false;
    const threshold = sectionNav.offsetHeight + 32;
    const atEnd = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
    const next = atEnd ? items.at(-1) : items.findLast(item => item.section.getBoundingClientRect().top <= threshold);
    if (next === current) return;
    current?.link.removeAttribute('aria-current');
    current = next;
    if (!current) return;
    current.link.setAttribute('aria-current','location');
    const bounds = track.getBoundingClientRect();
    const linkBounds = current.link.getBoundingClientRect();
    if (linkBounds.left < bounds.left || linkBounds.right > bounds.right) {
      track.scrollLeft += linkBounds.left - bounds.left - (bounds.width - linkBounds.width) / 2;
    }
  }

  function scheduleHighlight() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(highlightSection);
  }
  window.addEventListener('scroll',scheduleHighlight,{passive:true});
  window.addEventListener('resize',scheduleHighlight);
  window.addEventListener('pageshow',scheduleHighlight);
  scheduleHighlight();
}

const copyLink = document.querySelector('.copy-link');
if (copyLink) {
  const url = document.querySelector('link[rel="canonical"]').href;
  const status = document.querySelector('.share-status');
  const english = document.documentElement.lang === 'en';
  copyLink.hidden = false;
  copyLink.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = english ? 'Meeting link copied.' : '已复制会议网址。';
    } catch {
      const link = document.createElement('a');
      link.href = link.textContent = url;
      status.replaceChildren(english ? 'Select and copy the address. ' : '请选中并复制网址。',link);
      const selection = window.getSelection();
      selection.selectAllChildren(link);
    }
  });
}
