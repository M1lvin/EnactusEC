/* Слайдер, вступление и параллакс только варианта 01. */
(function () {
  'use strict';
  const hero = document.querySelector('.hero-01');
  if (!hero) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const slides = [
    { src: 'shared/assets/team-wide-original.png', alt: 'Команда Enactus EC на общей фотографии', width: 2560, height: 1706, position: 'center 38%' }
  ];
  const stage = hero.querySelector('.hero-slides');
  const dots = hero.querySelector('.hero-dots');
  const pause = document.querySelector('.hero-pause');
  const followup = document.querySelector('.hero-followup');
  const photo = hero.querySelector('.hero-photo-motion');
  const scene = hero.querySelector('.hero-photo-scene');
  const t = key => window.EnactusI18n.t(key);
  let current = 0, quote = 0, stopped = false, over = false, focused = false;
  let quoteOver = false, quoteFocused = false, slideTimer, quoteTimer;
  const todo = hero.querySelector('.hero-photo-todo');
  slides.forEach((slide, index) => {
    const layer = document.createElement('div');
    layer.className = 'hero-slide';
    if (slide.src) {
      const img = document.createElement('img');
      img.src = slide.src; img.alt = slide.alt;
      img.dataset.i18nAlt = 'groupPhotoAlt';
      img.width = slide.width; img.height = slide.height;
      img.loading = index ? 'lazy' : 'eager';
      if (!index) img.fetchPriority = 'high';
      img.style.objectPosition = slide.position;
      img.addEventListener('error', () => { img.remove(); layer.classList.add('photo-missing'); updateTodo(); });
      layer.append(img);
    } else layer.classList.add('photo-missing');
    stage.append(layer);
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.slide = index;
    button.dataset.i18nAria = 'slideButton' + index;
    button.addEventListener('click', () => { show(index); scheduleTimers(); });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + slides.length) % slides.length;
      show(next); dots.children[next].focus();
    });
    dots.append(button);
  });
  function updateTodo() { todo.hidden = !stage.children[current].classList.contains('photo-missing'); }
  function show(index) {
    current = (index + slides.length) % slides.length;
    [...stage.children].forEach((item, i) => {
      item.classList.toggle('is-active', i === current);
      item.setAttribute('aria-hidden', String(i !== current));
    });
    [...dots.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    updateTodo();
  }
  function showQuote() {
    followup.querySelectorAll('[data-phrase]').forEach((item, i) => {
      item.classList.toggle('is-active', i === quote);
      item.setAttribute('aria-hidden', String(i !== quote));
    });
  }
  function labels() {
    pause.textContent = t(stopped ? 'playPhrases' : 'pausePhrases');
    pause.setAttribute('aria-label', t(stopped ? 'playPhrases' : 'pausePhrases'));
    pause.setAttribute('aria-pressed', String(stopped));
    pause.disabled = motion.matches;
  }
  function scheduleTimers() {
    clearInterval(slideTimer); clearInterval(quoteTimer);
    const idle = stopped || motion.matches || document.hidden;
    hero.classList.toggle('is-paused', idle || over || focused);
    labels();
    if (slides.length > 1 && !idle && !over && !focused) slideTimer = setInterval(() => show(current + 1), 4000);
    if (!idle && !quoteOver && !quoteFocused) quoteTimer = setInterval(() => { quote = (quote + 1) % 3; showQuote(); }, 6000);
  }
  hero.querySelector('.hero-prev').addEventListener('click', () => { show(current - 1); scheduleTimers(); });
  hero.querySelector('.hero-next').addEventListener('click', () => { show(current + 1); scheduleTimers(); });
  hero.querySelectorAll('.hero-arrow').forEach(button => { button.hidden = slides.length < 2; });
  hero.querySelector('.hero-controls').hidden = slides.length < 2;
  pause.addEventListener('click', () => { stopped = !stopped; scheduleTimers(); });
  hero.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { over = true; scheduleTimers(); } });
  hero.addEventListener('pointerleave', () => { over = false; scheduleTimers(); });
  hero.addEventListener('focusin', () => { focused = true; scheduleTimers(); });
  hero.addEventListener('focusout', () => queueMicrotask(() => { focused = hero.contains(document.activeElement); scheduleTimers(); }));
  followup.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { quoteOver = true; scheduleTimers(); } });
  followup.addEventListener('pointerleave', () => { quoteOver = false; scheduleTimers(); });
  followup.addEventListener('focusin', () => { quoteFocused = true; scheduleTimers(); });
  followup.addEventListener('focusout', () => queueMicrotask(() => { quoteFocused = followup.contains(document.activeElement); scheduleTimers(); }));
  document.addEventListener('visibilitychange', scheduleTimers);
  document.addEventListener('enactus:language', labels);

  // Вступление: отдельные поверхности не конфликтуют с параллаксом контейнеров.
  let introTimer;
  function finishIntro() {
    clearTimeout(introTimer);
    document.documentElement.classList.remove('hero-intro-pending');
    hero.classList.remove('intro-playing');
    hero.dataset.intro = 'complete';
    document.removeEventListener('pointerdown', finishIntro, true);
    document.removeEventListener('click', finishIntro, true);
    document.removeEventListener('keydown', finishIntro, true);
  }
  function startIntro() {
    let seen = false;
    try { seen = sessionStorage.getItem('enactus-01-intro') === 'seen'; } catch (_) {}
    if (seen || motion.matches) { finishIntro(); return; }
    try { sessionStorage.setItem('enactus-01-intro', 'seen'); } catch (_) {}
    hero.dataset.intro = 'playing';
    hero.classList.add('intro-playing');
    document.documentElement.classList.remove('hero-intro-pending');
    document.addEventListener('pointerdown', finishIntro, true);
    document.addEventListener('click', finishIntro, true);
    document.addEventListener('keydown', finishIntro, true);
    introTimer = setTimeout(finishIntro, 1600);
  }

  // Наблюдатель включает расчёты только рядом с первым экраном.
  let frame = 0, visible = true;
  const wedges = [...hero.querySelectorAll('.hero-wedge')];
  function paintParallax() {
    frame = 0;
    if (motion.matches || !visible) return;
    const rect = scene.getBoundingClientRect();
    const amount = Math.max(-1, Math.min(1, -rect.top / Math.max(1, rect.height)));
    photo.style.transform = `translateY(${amount * rect.height * .025}px)`;
    wedges.forEach((wedge, index) => {
      wedge.style.transform = `translateY(${amount * rect.height * [.04,.06,.08][index]}px)`;
    });
  }
  function scheduleParallax() {
    if (!motion.matches && visible && !frame) frame = requestAnimationFrame(paintParallax);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) scheduleParallax(); }, {rootMargin:'100px'}).observe(hero);
  }
  addEventListener('scroll', scheduleParallax, {passive:true});
  addEventListener('resize', scheduleParallax, {passive:true});
  motion.addEventListener('change', () => {
    if (motion.matches) {
      finishIntro(); show(0); quote = 0; showQuote();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      photo.style.removeProperty('transform');
      wedges.forEach(wedge => wedge.style.removeProperty('transform'));
    } else scheduleParallax();
    scheduleTimers();
  });
  show(0); showQuote(); scheduleTimers();
  window.EnactusI18n.apply();
  startIntro(); scheduleParallax();
}());
