/* Тексты двух вариантов; переводы не добавляют новых фактов. */
(function () {
  'use strict';
  const dictionaries = {
  "ru": {
    "affiliation": "команда Enactus Инженерного колледжа Light Academy, Бишкек",
    "slogan": "команда людей, которых объединяет желание расти, учиться и создавать реальные изменения",
    "joinAction": "Присоединиться",
    "aboutAction": "О нас",
    "aboutPreview": "Немного о нас",
    "aboutText": "Enactus EC объединяет студентов, которые хотят развиваться, поддерживать друг друга и превращать идеи в действия.",
    "aboutTodo": "TODO: второе предложение о клубе от команды",
    "aboutMore": "Больше о нас",
    "phrasesHeading": "Слова, которые объединяют",
    "phrase0": "Вместе мы можем больше",
    "phrase1": "Идеи превращаются в действия, а действия в результат",
    "phrase2Translation": "Мы сильны вместе",
    "photoTodo": "TODO: фото команды",
    "slidesLabel": "Выбор слайда",
    "scrollLabel": "Перейти к разделу О нас",
    "pause": "Пауза",
    "play": "Продолжить",
    "pauseLabel": "Остановить автоматическую смену слайдов и фраз",
    "playLabel": "Продолжить автоматическую смену слайдов и фраз",
    "languageLabel": "Выбор языка",
    "ruLabel": "Русский язык",
    "enLabel": "Английский язык",
    "logoAlt": "Enactus EC",
    "homeLabel": "Enactus EC — главная",
    "topLabel": "Enactus EC — наверх",
    "navLabel": "Основная навигация",
    "clubSubmenu": "Подменю «О нас»",
    "projectsSubmenu": "Подменю «Проекты»",
    "awardsSubmenu": "Подменю «Достижения»",
    "title01": "Enactus EC — Тёмный манифест",
    "title10": "Enactus EC — Маршрут",
    "description": "Enactus EC — команда Enactus Инженерного колледжа Light Academy, Бишкек.",
    "slideButton0": "Показать слайд 1",
    "slideAlt0": "Фото команды Enactus EC — 1",
    "slideButton1": "Показать слайд 2",
    "slideAlt1": "Фото команды Enactus EC — 2",
    "slideButton2": "Показать слайд 3",
    "slideAlt2": "Фото команды Enactus EC — 3",
    "slideButton3": "Показать слайд 4",
    "slideAlt3": "Фото команды Enactus EC — 4",
    "slideButton4": "Показать слайд 5",
    "slideAlt4": "Фото команды Enactus EC — 5",
    "teamPhotoAlt": "Команда Enactus EC",
    "text43": "К содержимому",
    "text44": "Меню",
    "text45": "Главная",
    "text46": "Проекты",
    "text47": "Достижения",
    "text48": "Команда",
    "text49": "Как присоединиться",
    "text50": "Контакты",
    "text51": "TODO: миссия клуба в одном предложении от команды",
    "text52": "TODO: как клуб работает (встречи, форматы участия)",
    "text53": "Выставка: EXPO 2026 «Жаштар Стартаптары»",
    "text54": "TODO: описание проекта от команды (что делает, для кого, какой результат)",
    "text55": "TODO: фото",
    "text56": "Платформа, которая помогает водителям и пассажирам находить друг друга. Поездку каждый выбирает самостоятельно.",
    "text57": "Статус: некоторые функции в разработке. Показывать как «в разработке», а не как работающие.",
    "text58": "TODO: подтвердить у команды, какие функции уже работают",
    "text59": "В разработке",
    "text60": "Безопасность: проверка личности и документов, SOS-кнопка, возможность поделиться поездкой с близкими, рейтинги.",
    "text61": "TODO: подтвердить у клуба формулировки и разрешение на публикацию имени",
    "text62": "TODO: список участников (имя, роль) с их согласия",
    "text63": "TODO: способ связи и условия вступления от клуба",
    "text64": "Instagram: TODO: ссылка на аккаунт enactus_ec",
    "text65": "TODO: email и телефон клуба",
    "text66": "Адрес: TODO: уточнить у клуба (Инженерный колледж Light Academy, Бишкек)",
    "text67": "Все варианты",
    "text68": "Наверх ↑",
    "text69": "О клубе",
    "text70": "Присоединиться ↗",
    "text71": "TODO: фото EcoBrew",
    "text72": "TODO: фото EasyGO",
    "text73": "в разработке",
    "text74": "Некоторые функции в разработке.",
    "text75": "Черновые сведения. Перед публикацией требуется подтверждение клуба.",
    "text76": "«Прорыв года»",
    "text77": "Награда «Прорыв года» на EXPO 2026 «Жаштар Стартаптары» за активность, инновационный подход и стремление создавать проекты с реальным потенциалом.",
    "text78": "«Лучший академический эдвайзер года»",
    "text79": "Номинация «Лучший академический эдвайзер года»: Алыкулова Жибек Эргешовна, академический эдвайзер команды.",
    "text80": "Жибек Эргешовна получила возможность войти в состав национальной делегации Кыргызстана на Enactus World Cup 2026 в Бразилии.",
    "text81": "Как",
    "text82": "присоединиться",
    "text83": "TODO: ссылка на аккаунт enactus_ec",
    "text84": "Почта и телефон",
    "text85": "Адрес",
    "text86": "TODO: уточнить у клуба (Инженерный колледж Light Academy, Бишкек)",
    "text87": "Команда Enactus Инженерного колледжа Light Academy, Бишкек.",
    "text88": "TODO: адрес клуба",
    "text89": "Соцсети",
    "text90": "TODO: ссылка на Instagram enactus_ec",
    "text91": "Участие",
    "text92": "Enactus EC · Инженерный колледж Light Academy",
    "text93": "Все варианты дизайна ↗"
  },
  "en": {
    "affiliation": "the Enactus team of Light Academy Engineering College, Bishkek",
    "slogan": "a team of people united by the desire to grow, learn and create real change",
    "joinAction": "Join us",
    "aboutAction": "About us",
    "aboutPreview": "A little about us",
    "aboutText": "Enactus EC brings together students who want to develop, support each other and turn ideas into action.",
    "aboutTodo": "TODO: a second sentence about the club from the team",
    "aboutMore": "More about us",
    "phrasesHeading": "Words that bring us together",
    "phrase0": "Together we can do more",
    "phrase1": "Ideas turn into action, and action into results",
    "phrase2Translation": "We are strong together",
    "photoTodo": "TODO: team photo",
    "slidesLabel": "Choose a slide",
    "scrollLabel": "Go to About us",
    "pause": "Pause",
    "play": "Play",
    "pauseLabel": "Pause automatic slide and phrase rotation",
    "playLabel": "Resume automatic slide and phrase rotation",
    "languageLabel": "Choose a language",
    "ruLabel": "Russian",
    "enLabel": "English",
    "logoAlt": "Enactus EC",
    "homeLabel": "Enactus EC — home",
    "topLabel": "Enactus EC — back to top",
    "navLabel": "Main navigation",
    "clubSubmenu": "About us submenu",
    "projectsSubmenu": "Projects submenu",
    "awardsSubmenu": "Achievements submenu",
    "title01": "Enactus EC — Dark manifesto",
    "title10": "Enactus EC — Route",
    "description": "Enactus EC — the Enactus team of Light Academy Engineering College, Bishkek.",
    "slideButton0": "Show slide 1",
    "slideAlt0": "Enactus EC team photo — 1",
    "slideButton1": "Show slide 2",
    "slideAlt1": "Enactus EC team photo — 2",
    "slideButton2": "Show slide 3",
    "slideAlt2": "Enactus EC team photo — 3",
    "slideButton3": "Show slide 4",
    "slideAlt3": "Enactus EC team photo — 4",
    "slideButton4": "Show slide 5",
    "slideAlt4": "Enactus EC team photo — 5",
    "teamPhotoAlt": "Enactus EC team",
    "text43": "Skip to content",
    "text44": "Menu",
    "text45": "Home",
    "text46": "Projects",
    "text47": "Achievements",
    "text48": "Team",
    "text49": "How to join",
    "text50": "Contacts",
    "text51": "TODO: a one-sentence club mission from the team",
    "text52": "TODO: how the club works (meetings, ways to participate)",
    "text53": "Exhibition: EXPO 2026 «Жаштар Стартаптары»",
    "text54": "TODO: project description from the team (what it does, who it is for, what it achieves)",
    "text55": "TODO: photo",
    "text56": "A platform that helps drivers and passengers find each other. Everyone chooses their own trip.",
    "text57": "Status: some features are in development. Display them as “in development”, rather than as working features.",
    "text58": "TODO: confirm with the team which features are already working",
    "text59": "In development",
    "text60": "Safety: identity and document checks, an SOS button, sharing trip details with loved ones, ratings.",
    "text61": "TODO: confirm the wording and permission to publish the name with the club",
    "text62": "TODO: a list of members (name, role) with their consent",
    "text63": "TODO: contact method and membership requirements from the club",
    "text64": "Instagram: TODO: link to the enactus_ec account",
    "text65": "TODO: club email and phone number",
    "text66": "Address: TODO: confirm with the club (Light Academy Engineering College, Bishkek)",
    "text67": "All designs",
    "text68": "Back to top ↑",
    "text69": "About the club",
    "text70": "Join us ↗",
    "text71": "TODO: EcoBrew photo",
    "text72": "TODO: EasyGO photo",
    "text73": "in development",
    "text74": "Some features are in development.",
    "text75": "Draft information. Confirmation from the club is required before publication.",
    "text76": "«Прорыв года»",
    "text77": "The «Прорыв года» award at EXPO 2026 «Жаштар Стартаптары» for activity, an innovative approach and the desire to create projects with real potential.",
    "text78": "«Лучший академический эдвайзер года»",
    "text79": "Nomination for «Лучший академический эдвайзер года»: Алыкулова Жибек Эргешовна, the team’s academic advisor.",
    "text80": "Жибек Эргешовна received an opportunity to join Kyrgyzstan’s national delegation to Enactus World Cup 2026 in Brazil.",
    "text81": "How to",
    "text82": "join",
    "text83": "TODO: link to the enactus_ec account",
    "text84": "Email and phone",
    "text85": "Address",
    "text86": "TODO: confirm with the club (Light Academy Engineering College, Bishkek)",
    "text87": "The Enactus team of Light Academy Engineering College, Bishkek.",
    "text88": "TODO: club address",
    "text89": "Social media",
    "text90": "TODO: link to Instagram enactus_ec",
    "text91": "Get involved",
    "text92": "Enactus EC · Light Academy Engineering College",
    "text93": "All designs ↗"
  }
};

  dictionaries.ru.prevSlide = 'Предыдущий слайд';
  dictionaries.en.prevSlide = 'Previous slide';
  dictionaries.ru.nextSlide = 'Следующий слайд';
  dictionaries.en.nextSlide = 'Next slide';
  dictionaries.ru.groupPhotoAlt = 'Команда Enactus EC на общей фотографии';
  dictionaries.en.groupPhotoAlt = 'Enactus EC team in a group photograph';
  dictionaries.ru.membersPhotoAlt = 'Участники команды Enactus EC';
  dictionaries.en.membersPhotoAlt = 'Enactus EC team members';
  dictionaries.ru["navClub"] = "О клубе";
  dictionaries.ru["navAwards"] = "Достижения команды";
  dictionaries.ru["projectEco"] = "EcoBrew";
  dictionaries.ru["projectEasy"] = "EasyGO";
  dictionaries.ru["pausePhrases"] = "Пауза фраз";
  dictionaries.ru["playPhrases"] = "Продолжить смену фраз";
  dictionaries.ru["submenuhome"] = "Подменю «Главная»";
  dictionaries.ru["submenuabout"] = "Подменю «О нас»";
  dictionaries.ru["submenuprojects"] = "Подменю «Проекты»";
  dictionaries.ru["submenuachievements"] = "Подменю «Достижения»";
  dictionaries.ru["submenuteam"] = "Подменю «Команда»";
  dictionaries.ru["submenujoin"] = "Подменю «Участие»";
  dictionaries.en["navClub"] = "About the club";
  dictionaries.en["navAwards"] = "Team achievements";
  dictionaries.en["projectEco"] = "EcoBrew";
  dictionaries.en["projectEasy"] = "EasyGO";
  dictionaries.en["pausePhrases"] = "Pause phrases";
  dictionaries.en["playPhrases"] = "Resume phrase rotation";
  dictionaries.en["submenuhome"] = "Home submenu";
  dictionaries.en["submenuabout"] = "About us submenu";
  dictionaries.en["submenuprojects"] = "Projects submenu";
  dictionaries.en["submenuachievements"] = "Achievements submenu";
  dictionaries.en["submenuteam"] = "Team submenu";
  dictionaries.en["submenujoin"] = "Get involved submenu";
  dictionaries.ru["overviewTitle"] = "Что такое Enactus EC?";
  dictionaries.ru["overviewClub"] = "Команда Enactus Инженерного колледжа Light Academy, Бишкек.";
  dictionaries.ru["overviewProjects"] = "EcoBrew и EasyGO";
  dictionaries.en["overviewTitle"] = "What is Enactus EC?";
  dictionaries.en["overviewClub"] = "The Enactus team of Light Academy Engineering College, Bishkek.";
  dictionaries.en["overviewProjects"] = "EcoBrew and EasyGO";
  let language = 'ru';
  try { if (localStorage.getItem('enactus-language') === 'en') language = 'en'; } catch (_) {}
  function t(key) { return dictionaries[language][key] || dictionaries.ru[key] || key; }
  function apply() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
    [['data-i18n-alt','alt'], ['data-i18n-aria','aria-label'], ['data-i18n-content','content']].forEach(([data, attr]) => {
      document.querySelectorAll('[' + data + ']').forEach(element => element.setAttribute(attr, t(element.getAttribute(data))));
    });
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    document.querySelectorAll('.title-fill').forEach(element => { element.dataset.title = element.textContent; });
    document.dispatchEvent(new CustomEvent('enactus:language', { detail: { language } }));
  }
  window.EnactusI18n = { t, apply };
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
    language = button.dataset.language;
    try { localStorage.setItem('enactus-language', language); } catch (_) {}
    apply();
  }));
  apply();
}());
