// Навигация: мышь, клавиатура и мобильный аккордеон.
const root = document.documentElement;
const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navigation');
const groups = [...document.querySelectorAll('.nav-group')];
const mobile = matchMedia('(max-width: 980px)');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
root.classList.add('enhanced');
function expand(group, state) {
  group.classList.toggle('expanded', state);
  group.querySelector('.drop-toggle').setAttribute('aria-expanded', String(state));
}
function closeGroups(except) {
  groups.forEach(group => { if (group !== except) expand(group, false); });
}
function closeMenu() {
  header.classList.remove('menu-open');
  menu.setAttribute('aria-expanded', 'false');
  closeGroups();
}
function syncNavigation() {
  const focused = nav.contains(document.activeElement);
  closeMenu();
  menu.hidden = !mobile.matches;
  if (mobile.matches && focused) menu.focus();
}
syncNavigation();
mobile.addEventListener('change', syncNavigation);
menu.addEventListener('click', () => {
  const open = !header.classList.contains('menu-open');
  closeGroups();
  header.classList.toggle('menu-open', open);
  menu.setAttribute('aria-expanded', String(open));
});
groups.forEach(group => {
  const toggle = group.querySelector('.drop-toggle');
  group.addEventListener('pointerenter', event => {
    if (mobile.matches || event.pointerType === 'touch') return;
    closeGroups(group);
    expand(group, true);
  });
  group.addEventListener('pointerleave', () => {
    if (!mobile.matches && !group.contains(document.activeElement)) expand(group, false);
  });
  group.querySelector('.nav-link').addEventListener('focus', () => {
    if (!mobile.matches) { closeGroups(group); expand(group, true); }
  });
  group.addEventListener('focusout', () => {
    queueMicrotask(() => {
      if (!mobile.matches && !group.contains(document.activeElement)) expand(group, false);
    });
  });
  toggle.addEventListener('click', () => {
    const open = !group.classList.contains('expanded');
    closeGroups(group);
    expand(group, open);
  });
  toggle.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      closeGroups(group);
      expand(group, true);
      group.querySelector('.submenu a').focus();
    }
  });
});
nav.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  closeMenu();
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    event.preventDefault();
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth' });
  }
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const active = document.activeElement.closest('.nav-group.expanded');
  if (active) {
    expand(active, false);
    active.querySelector('.drop-toggle').focus();
  } else if (header.classList.contains('menu-open')) {
    closeMenu();
    menu.focus();
  } else closeGroups();
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
// Блоки появляются один раз; без поддержки API остаются видимыми.
document.querySelectorAll('.title-fill').forEach(title => title.dataset.title = title.textContent);
const reveals = [...document.querySelectorAll('.reveal')];
let observer;
if ('IntersectionObserver' in window && !motion.matches) {
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  reveals.forEach(element => { element.classList.add('pending'); observer.observe(element); });
}
// Один кадр объединяет параллакс, прогресс и фирменный эффект.
const layers = [...document.querySelectorAll('[data-parallax]')];
const progressBar = document.querySelector('.progress');
let frame = 0;
function paint() {
  frame = 0;
  const full = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.transform = motion.matches ? 'none' : `scaleX(${full > 0 ? scrollY / full : 0})`;
  layers.forEach(layer => {
    if (motion.matches || mobile.matches) {
      layer.style.removeProperty('--parallax');
      layer.style.removeProperty('transform');
      return;
    }
    const rect = layer.parentElement.getBoundingClientRect();
    const distance = Math.max(-65, Math.min(65, (innerHeight / 2 - rect.top - rect.height / 2) * Number(layer.dataset.parallax)));
    if (layer.classList.contains('image-layer')) layer.style.setProperty('--parallax', distance + 'px');
    else layer.style.transform = `translateY(${distance}px)`;
  });
  paintSignature();
}
function schedulePaint() { if (!frame) frame = requestAnimationFrame(paint); }
addEventListener('scroll', schedulePaint, { passive: true });
addEventListener('resize', schedulePaint);
motion.addEventListener('change', () => {
  if (motion.matches) {
    observer?.disconnect();
    reveals.forEach(element => element.classList.remove('pending'));
  }
  schedulePaint();
});

// Отрезки маршрута заполняются последовательно, без изменения геометрии.
const route = document.querySelector('.awards');
const segments = [...document.querySelectorAll('.route-line i')];
function paintSignature() {
  const rect = route.getBoundingClientRect();
  const amount = Math.min(1, Math.max(0, (innerHeight * .85 - rect.top) / Math.max(1, rect.height))) * segments.length;
  segments.forEach((segment, index) => {
    const value = motion.matches ? 1 : Math.min(1, Math.max(0, amount - index));
    segment.style.transform = `${mobile.matches ? 'scaleY' : 'scaleX'}(${value})`;
  });
}
schedulePaint();

