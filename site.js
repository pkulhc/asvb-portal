const masthead = document.querySelector('.masthead');
const menu = masthead.querySelector('.menu-toggle');
const navigation = masthead.querySelector('.site-nav');
const narrow = window.matchMedia('(max-width: 900px)');

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

const stickyNav = document.querySelector('.section-nav, .society-nav');
if (stickyNav) {
  const track = stickyNav.querySelector('.wrap');
  const items = Array.from(track.querySelectorAll('a'), link => ({
    link,
    section: document.getElementById(link.hash.slice(1))
  })).filter(item => item.section);
  let current;
  let queued = false;

  function highlightSection() {
    queued = false;
    const threshold = stickyNav.offsetHeight + 48;
    const atEnd = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
    const next = atEnd ? items.at(-1) : items.findLast(item => item.section.getBoundingClientRect().top <= threshold);
    if (next === current) return;
    current?.link.removeAttribute('aria-current');
    current = next;
    if (!current) return;
    current.link.setAttribute('aria-current', 'location');
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
  window.addEventListener('scroll', scheduleHighlight, { passive: true });
  window.addEventListener('resize', scheduleHighlight);
  window.addEventListener('pageshow', scheduleHighlight);
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
      status.replaceChildren(english ? 'Select and copy the address. ' : '请选中并复制网址。', link);
      const selection = window.getSelection();
      selection.selectAllChildren(link);
    }
  });
}

const copyChips = document.querySelectorAll('[data-copy]');
if (copyChips.length) {
  const english = document.documentElement.lang === 'en';
  copyChips.forEach(chip => {
    const labelSpan = chip.querySelector('span');
    const defaultLabel = labelSpan.textContent;
    let resetTimer;
    chip.hidden = false;
    chip.addEventListener('click', async () => {
      const value = chip.dataset.copy;
      const container = chip.closest('.contact-panel, .sponsor-contact');
      const feedback = container?.querySelector('.copy-feedback');
      let ok = false;
      try {
        await navigator.clipboard.writeText(value);
        ok = true;
      } catch {
        const helper = document.createElement('textarea');
        helper.value = value;
        helper.setAttribute('readonly', '');
        document.body.append(helper);
        helper.select();
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        helper.remove();
      }
      if (ok) {
        labelSpan.textContent = chip.dataset.copied || (english ? 'Copied' : '已复制');
        if (feedback) {
          feedback.textContent = english ? `Copied to clipboard: ${value}` : `已复制：${value}`;
        }
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => { labelSpan.textContent = defaultLabel; }, 2000);
      } else if (feedback) {
        feedback.textContent = value;
      }
    });
  });
}

const lightboxTriggers = document.querySelectorAll('[data-lightbox]');
if (lightboxTriggers.length) {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  const bar = document.createElement('div');
  bar.className = 'lightbox-bar';
  const caption = document.createElement('p');
  caption.className = 'lightbox-caption';
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lightbox-close';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'm5 5 14 14M19 5 5 19');
  svg.append(path);
  closeBtn.append(svg);

  const frame = document.createElement('div');
  frame.className = 'lightbox-frame';
  const photo = document.createElement('img');

  bar.append(caption, closeBtn);
  dialog.append(bar, frame);
  document.body.append(dialog);

  let lastTrigger = null;
  function closeDialog() {
    if (dialog.open) dialog.close();
  }
  closeBtn.addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('close', () => {
    photo.remove();
    photo.removeAttribute('src');
    if (lastTrigger) lastTrigger.focus();
  });

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      lastTrigger = trigger;
      photo.src = trigger.dataset.src;
      photo.alt = trigger.dataset.alt || '';
      frame.replaceChildren(photo);
      caption.textContent = trigger.dataset.caption || '';
      const closeLabel = trigger.dataset.close || 'Close preview';
      closeBtn.setAttribute('aria-label', closeLabel);
      dialog.setAttribute('aria-label', caption.textContent || closeLabel);
      dialog.showModal();
    });
  });
}
