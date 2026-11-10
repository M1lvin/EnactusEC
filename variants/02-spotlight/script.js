// Мобильное меню: кнопка, ссылки и Escape.
const header = document.querySelector('header');
const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
const mobile = matchMedia('(max-width: 900px)');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
function closeMenu() {
  header.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}
function syncMenu() {
  const hadFocus = nav.contains(document.activeElement);
  closeMenu();
  menu.hidden = !mobile.matches;
  if (mobile.matches && hadFocus) menu.focus();
}
header.classList.add('ready');
syncMenu();
menu.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', String(header.classList.toggle('open')));
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});
mobile.addEventListener('change', syncMenu);
// Без IntersectionObserver текст остаётся видимым.
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
  }, { threshold: 0.08 });
  reveals.forEach(element => {
    element.classList.add('pending');
    observer.observe(element);
  });
}
motion.addEventListener('change', () => {
  if (motion.matches) {
    observer?.disconnect();
    reveals.forEach(element => element.classList.remove('pending'));
  }
});

// Курсор управляет светом и наклоном только на точном указателе.
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector('.hero');
const light = document.querySelector('.spotlight');
let lightFrame = 0;
hero.addEventListener('pointermove', event => {
  if (motion.matches || !finePointer.matches) return;
  const rect = hero.getBoundingClientRect();
  cancelAnimationFrame(lightFrame);
  lightFrame = requestAnimationFrame(() => {
    light.style.transform = `translate(${event.clientX - rect.left}px, ${event.clientY - rect.top}px)`;
  });
});
const cards = [...document.querySelectorAll('.project')];
cards.forEach(card => {
  let frame = 0;
  card.addEventListener('pointermove', event => {
    if (motion.matches || !finePointer.matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      card.style.transform = `perspective(1200px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
  });
  card.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    card.style.transform = '';
  });
});
function resetPointerEffects() {
  cancelAnimationFrame(lightFrame);
  light.style.transform = '';
  cards.forEach(card => card.style.transform = '');
}
motion.addEventListener('change', resetPointerEffects);
finePointer.addEventListener('change', resetPointerEffects);

