/* Кнопки раскрывают только существующие разделы клуба. */
(function () {
  'use strict';
  const header = document.querySelector('.shared-page--01 header');
  if (!header) return;
  const groups = [...header.querySelectorAll('.nav-expand')];
  const mobile = matchMedia('(max-width:1100px)');
  function setOpen(group, open) {
    group.classList.toggle('expanded', open);
    group.querySelector('.nav-disclosure').setAttribute('aria-expanded', String(open));
    group.querySelector('.nav-panel').hidden = !open;
  }
  function closePanels(except) { groups.forEach(group => { if (group !== except) setOpen(group, false); }); }
  groups.forEach(group => {
    const button = group.querySelector('.nav-disclosure');
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      closePanels(group); setOpen(group, open);
    });
    button.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault(); closePanels(group); setOpen(group, true);
      group.querySelector('.nav-panel a').focus();
    });
    group.addEventListener('focusout', () => queueMicrotask(() => {
      if (!mobile.matches && !group.contains(document.activeElement)) setOpen(group, false);
    }));
  });
  header.querySelector('nav').addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    closePanels();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault(); target.tabIndex = -1; target.focus({preventScroll:true});
      target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth'});
    }
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closePanels(); });
  // Захват оставляет Escape внутри открытого подменю, не закрывая сразу весь аккордеон.
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = groups.find(group => group.classList.contains('expanded'));
    if (!open) return;
    event.preventDefault(); event.stopImmediatePropagation();
    closePanels(); open.querySelector('.nav-disclosure').focus();
  }, true);
  header.querySelector('.menu').addEventListener('click', () => closePanels());
  mobile.addEventListener('change', () => closePanels());
}());
