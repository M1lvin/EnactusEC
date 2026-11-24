# Enactus EC — отчёт о редизайне и визуальной проверке

Дата завершения: 2026-11-24. Реализация в существующем React + Vite + React Router проекте.

## Результат

Полноширинный первый экран с оригинальной фотографией клуба, плотная типографика Roboto Condensed, основной текст Roboto, палитра #FFC222 / #30333C / #E8EAE2, контейнер 1200 px. Шапка с широкими панелями, адаптивным меню и переключателем темы. Перестроены главная, внутренние баннеры, карточки, форма и подвал. Названия, проекты и контакты принадлежат Enactus EC. Фото с enactus.ca не используются.

Форма выполняет только локальную проверку, сообщает «Поля успешно проверены», не отправляет и не сохраняет личные данные. Перенесено подтверждённое описание EasyGO из content.md; статус функций остаётся неподтверждённым. Телефон подписан как телефон колледжа.

## Визуальная основа и доказательства

Референсы: https://enactus.ca/, /about/, /students/join-a-team/, /partners/our-supporters/, /about/news/, /contact-us/.
Изучались публичные страницы, HTML, CSS и computed styles. Серверный код WordPress не изучался.

Каталог снимков: C:/Users/Master/.codex/visualizations/2026/11/23/01a2091f-8239-73f2-80bb-ce5180ff3458/

- source visual truth: reference-menu-1440.jpg; reference-inner-1440.jpg.
- implementation screenshot: implementation-menu-1440.jpg; implementation-inner-1440.jpg; home-desktop.jpg; home-mobile.jpg.
- full-view comparison evidence: comparison-menu.jpg, comparison-inner.jpg. Сопоставления содержат референс слева и реализацию справа.
- focused evidence: achievements-contrast-fixed.jpg; отдельные проверки формы и мобильного меню в Browser.
- Additional screenshots: home-desktop-dark.jpg, home-mobile-dark.jpg, home-desktop-full.jpg.
- Viewport desktop: 1440 × 900 CSS px; source and implementation screenshots both 1425 × 891 px, returned at the same browser screenshot scale. Comparison uses the same 720 × 450 display size for each image. Browser screenshot scaling is not asserted to equal devicePixelRatio.
- Viewport mobile: 375 × 812 CSS px; implementation screenshot 360 × 779 px as returned by Browser.
- State: light theme, desktop navigation panel open for menu comparison; internal page banner for banner comparison. Contact and partner pages have different content by design; only the shared banner/layout system is compared there.
- The animated home reference sometimes captured a slide transition. comparison-home.jpg is supplementary, not accepted as sole evidence of text or first-screen fidelity.

## Пять поверхностей визуальной проверки

1. Типографика: локальные OFL Roboto и Roboto Condensed, жирные заголовки, компактный интерлиньяж, читаемый основной текст. Knockout не копировался. Кириллица и более узкая гарнитура дают ожидаемые отличия от канадского сайта.
2. Сетка и ритм: контейнер 1200 px, шапка около 94 px, широкие панели, чередование белых/светлых/тёмных секций, двухколоночные карточки на широких экранах и одна колонка на телефоне. Удалены лишние нижние отступы страницы проектов.
3. Цвета: токены светлой и тёмной темы, золотые линии и CTA. Проверенные основные пары контраста: 5.81:1–12.62:1. Исправлен цвет описаний в тёмной секции достижений.
4. Изображения: оригинальное фото команды оптимизировано до JPEG 1920 и 960 px; внешность не менялась. В мобильном Hero группа видна целиком. Постеры показаны целиком, без обрезки встроенных надписей. Проектные фото отсутствуют и явно помечены TODO: групповое фото не выдаётся за фото конкретного проекта.
5. Содержание: материалы Enactus EC, демонстрационные цифры обозначены возле каждого счётчика, неподтверждённые персональные данные не опубликованы. Разрешение на фотографии не трактовалось как подтверждение имён/ролей.

## История исправлений

- [P2, исправлено] При 375 px подпись переключателя темы была обрезана. Кнопка вступления перенесена в раскрытое мобильное меню; переключателю возвращена ширина 116 px. Повторная визуальная проверка: home-mobile.jpg и home-mobile-dark.jpg.
- [P1, исправлено] Описания достижений наследовали тёмный цвет на тёмном фоне. Явно задан светлый foreground; повторный снимок achievements-contrast-fixed.jpg и computed colors подтверждают исправление. Контраст белого на #30333C — 12.62:1.
- [P2, исправлено] Избыточный суммарный отступ после последней секции страницы проектов. Убран дополнительный padding последней секции.
- После исправлений выполнены lint, build, git diff --check и повторные визуальные проверки затронутых поверхностей. Открытых P0/P1/P2 визуальных дефектов не обнаружено.

## Проверки

- npm run lint — PASS после каждого этапа и финальных изменений.
- npm run build — PASS после каждого этапа и финальных изменений.
- git diff --check — PASS.
- 80 проверок: 10 адресов × 2 темы × 4 ширины (375 / 768 / 1100 / 1440). Все без горизонтального переполнения, с одним h1 в main, без сломанных загруженных изображений. Машиночитаемый результат: route-checks.json в каталоге снимков.
- Адреса: /, /about, /projects, /projects/ecobrew, /projects/easygo, /achievements, /team, /partners, /join, /missing-page.
- Визуальные проходы: главная сверху вниз, мобильные секции/подвал, тёмные карточки на планшете, форма, внутренние баннеры, desktop/mobile меню, фотографии.
- Фильтр: выбор «Экология» показывает отсутствие подтверждённых проектов по направлению и отдельно оба проекта без направления.
- Форма: пустая отправка показывает 4 ошибки и фокусирует имя; заполнение синтетическими значениями открывает честный экран успешной проверки и фокусирует h1.
- Меню: ArrowDown переводит фокус на первую ссылку панели; Escape закрывает панель и возвращает фокус; следующий Tab проходит к видимой основной навигации. Мобильный Escape закрывает меню и возвращает фокус на кнопку. Скрытые панели используют hidden, закрытая мобильная навигация display:none.
- Фразы: пауза и ручное переключение проверены; кыргызская подпись находится только в существующем блоке фраз.
- Системная тема: после выбора system и перезагрузки preference сохраняется, фактическая тема соответствует matchMedia. Dark сохраняется при перезагрузке. Ранняя установка темы в index.html сохранена.
- Console local: ошибок/предупреждений не обнаружено.

## Ограничения проверок

Browser не предоставляет API эмуляции prefers-reduced-motion. Поддержка проверена по коду CSS, RevealSection, AnimatedCounter и PhraseRotator: движение и автосмена отключаются, ручная смена сохраняется. Runtime-проверка при включённой системной настройке не проведена.
Первый кадр загрузки темы не измерялся покадрово; проверены ранний inline-script и сохранение выбора после reload. Проверка скринридером не проводилась; полноценная сертификация WCAG не заявляется. Responsive-проверки выполнялись в десктопном Browser с изменённым viewport, не на физических устройствах iOS/Android.

## Ожидаемые отличия от референса

Другие фотографии и объём содержания, русская типографика, свободная замена Knockout, оригинальный белый логотип клуба на тёмной подложке. В Hero нет дополнительного слайдера, поскольку это новая незапрошенная функция. Меню на 1100 px сворачивается, чтобы избежать двух строк пунктов референса. Проекты, участники и партнёры не дополнялись вымышленными фактами.

## Оставшиеся TODO клуба

- Миссия, объяснение движения и форматы работы клуба.
- Описание EcoBrew; направления, проблемы, решения, результаты и фотографии проектов.
- Подтверждение работающих функций EasyGO.
- Подтверждение демонстрационных чисел и формулировок наград.
- Имена/роли участников и разрешение на публикацию имени эдвайзера.
- Партнёры и условия сотрудничества.
- Условия вступления и способ передачи заявки.
- Почта, юридическая строка/копирайт, проверка опубликованных контактов.

## Изменённые файлы

- `index.html`
- `public/fonts/Roboto-OFL.txt`
- `public/fonts/Roboto.ttf`
- `public/fonts/RobotoCondensed-OFL.txt`
- `public/fonts/RobotoCondensed.ttf`
- `src/components/AboutPreview.css`
- `src/components/AboutPreview.jsx`
- `src/components/AnimatedCounter.jsx`
- `src/components/ClubPhoto.jsx`
- `src/components/Footer.css`
- `src/components/Footer.jsx`
- `src/components/Header.css`
- `src/components/Header.jsx`
- `src/components/Hero.css`
- `src/components/Hero.jsx`
- `src/components/HomeContacts.css`
- `src/components/HomeContacts.jsx`
- `src/components/Layout.jsx`
- `src/components/NavigationPanel.jsx`
- `src/components/PageHero.css`
- `src/components/PageHero.jsx`
- `src/components/PhraseRotator.css`
- `src/components/PhraseRotator.jsx`
- `src/components/ProjectCard.css`
- `src/components/ProjectCard.jsx`
- `src/components/ThemeToggle.css`
- `src/data/media.js`
- `src/data/navigation.js`
- `src/data/projects.js`
- `src/index.css`
- `src/media/club-poster.jpg`
- `src/media/team-1920.jpg`
- `src/media/team-960.jpg`
- `src/media/team-poster.jpg`
- `src/pages/AboutPage.css`
- `src/pages/AboutPage.jsx`
- `src/pages/AchievementsPage.jsx`
- `src/pages/HomePage.css`
- `src/pages/HomePage.jsx`
- `src/pages/JoinPage.css`
- `src/pages/JoinPage.jsx`
- `src/pages/NotFoundPage.jsx`
- `src/pages/PartnersPage.jsx`
- `src/pages/ProjectPage.css`
- `src/pages/ProjectPage.jsx`
- `src/pages/ProjectsPage.jsx`
- `src/pages/TeamPage.css`
- `src/pages/TeamPage.jsx`
- `src/styles/theme.css`
- `design-qa.md` — этот отчёт.

Исходники archive/, design-variants/, variants/, AGENTS.md и content.md не изменены. Логотип не изменён. Никаких npm-зависимостей, внешних сервисов, серверной отправки или push.

## Implementation checklist

- [x] Токены, шрифты и утверждённые фотографии.
- [x] Шапка, широкие панели, мобильное меню, подвал.
- [x] Главная и все внутренние маршруты.
- [x] Фильтр, локальная форма, счётчики, фразы и темы сохранены.
- [x] Визуальные дефекты исправлены и повторно проверены.
- [x] Ограничения проверок и оставшиеся TODO раскрыты.

final result: passed

Результат относится к визуальной реализации согласованного объёма; перечисленные ограничения runtime-проверок сохраняются.
