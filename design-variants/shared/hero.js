/* Пути к фотографиям задаются здесь, относительно страницы варианта. */
(function () {
  'use strict';
  if (document.body.classList.contains('shared-page--01')) return;
  const slides = [
    { src: '', alt: 'Фото команды Enactus EC — 1' },
    { src: '', alt: 'Фото команды Enactus EC — 2' },
    { src: '', alt: 'Фото команды Enactus EC — 3' },
    { src: '', alt: 'Фото команды Enactus EC — 4' },
    { src: '', alt: 'Фото команды Enactus EC — 5' }
  ];
  const hero = document.querySelector('[data-shared-hero]');
  if (!hero) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const stage = hero.querySelector('.hero-slides');
  const dots = hero.querySelector('.hero-dots');
  const pause = hero.querySelector('.hero-pause');
  let current = 0, phraseIndex = 0, stopped = false, hovered = false, focused = false;
  let slideTimer, phraseTimer;
  const t = key => window.EnactusI18n ? window.EnactusI18n.t(key) : key;
  const photoTodo = document.createElement('span');
  photoTodo.className = 'hero-photo-todo'; photoTodo.dataset.i18n = 'photoTodo';
  hero.append(photoTodo);
  slides.forEach((slide, index) => {
    const layer = document.createElement('div');
    layer.className = 'hero-slide' + (index === 0 ? ' is-active' : '');
    layer.style.setProperty('--slide-angle', (115 + index * 35) + 'deg');
    layer.setAttribute('aria-hidden', String(index !== 0));
    if (slide.src) {
      const img = document.createElement('img');
      img.src = slide.src;
      img.alt = slide.alt;
      img.dataset.i18nAlt = 'slideAlt' + index;
      img.width = 1920; img.height = 1080;
      img.loading = index ? 'lazy' : 'eager';
      if (!index) img.fetchPriority = 'high';
      layer.append(img);
      img.addEventListener('error', () => {
        img.remove(); layer.classList.add('photo-missing');
        if (index === current) photoTodo.hidden = false;
      });
    } else layer.classList.add('photo-missing');
    stage.append(layer);
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.slide = index;
    button.dataset.i18nAria = 'slideButton' + index;
    button.addEventListener('click', () => { show(index); sync(); });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 :
        (current + (event.key === 'ArrowRight' ? 1 : -1) + slides.length) % slides.length;
      show(next); dots.children[next].focus(); sync();
    });
    dots.append(button);
  });
  function show(index) {
    current = index;
    photoTodo.hidden = !!slides[index].src && !stage.children[index].classList.contains('photo-missing');
    [...stage.children].forEach((layer, i) => {
      layer.classList.toggle('is-active', i === current);
      layer.setAttribute('aria-hidden', String(i !== current));
    });
    [...dots.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
  }
  function phrase() {
    const box = hero.querySelector('.hero-phrases');
    box.querySelectorAll('[data-phrase]').forEach((item, i) => {
      item.classList.toggle('is-active', i === phraseIndex);
      item.setAttribute('aria-hidden', String(i !== phraseIndex));
    });
  }
  function labels() {
    pause.textContent = t(stopped ? 'play' : 'pause');
    pause.setAttribute('aria-label', t(stopped ? 'playLabel' : 'pauseLabel'));
    pause.setAttribute('aria-pressed', String(stopped));
    pause.disabled = motion.matches;
  }
  function sync() {
    clearInterval(slideTimer); clearInterval(phraseTimer);
    const idle = stopped || hovered || focused || document.hidden || motion.matches;
    hero.classList.toggle('is-paused', idle);
    labels();
    if (idle) return;
    slideTimer = setInterval(() => show((current + 1) % slides.length), 4000);
    phraseTimer = setInterval(() => { phraseIndex = (phraseIndex + 1) % 3; phrase(); }, 6000);
  }
  pause.addEventListener('click', () => { stopped = !stopped; sync(); });
  hero.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovered = true; sync(); } });
  hero.addEventListener('pointerleave', () => { hovered = false; sync(); });
  hero.addEventListener('focusin', () => { focused = true; sync(); });
  hero.addEventListener('focusout', () => queueMicrotask(() => { focused = hero.contains(document.activeElement); sync(); }));
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('enactus:language', labels);
  motion.addEventListener('change', () => { if (motion.matches) { show(0); phraseIndex = 0; phrase(); } sync(); });
  show(0); phrase(); sync();
  if (window.EnactusI18n) window.EnactusI18n.apply();
}());
