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
