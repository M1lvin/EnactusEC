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

// Прокрутка сдвигает декоративные слова и проявляет золотой слой.
const band = document.querySelector('.kinetic-band');
const words = [...document.querySelectorAll('.kinetic-word')];
let kineticFrame = 0;
function paintWords() {
  kineticFrame = 0;
  if (motion.matches) {
    words.forEach(word => {
      word.style.transform = '';
      word.querySelector('.word-fill').style.opacity = '1';
    });
    return;
  }
  const rect = band.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));
  words.forEach((word, index) => {
    word.style.transform = `translateX(${(progress - 0.5) * (index ? 240 : -240)}px)`;
    word.querySelector('.word-fill').style.opacity = String(progress);
  });
}
function queueWords() {
  if (!kineticFrame) kineticFrame = requestAnimationFrame(paintWords);
}
addEventListener('scroll', queueWords, { passive: true });
addEventListener('resize', queueWords);
motion.addEventListener('change', queueWords);
paintWords();

