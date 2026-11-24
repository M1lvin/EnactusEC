export const navigation = [
  { id: 'about', label: 'О нас', to: '/about', children: [
    { id: 'about-club', label: 'О клубе', to: '/about' },
    { id: 'about-team', label: 'Команда', to: '/team' },
  ] },
  { id: 'projects', label: 'Проекты', to: '/projects', children: [
    { id: 'project-ecobrew', label: 'EcoBrew', to: '/projects/ecobrew' },
    { id: 'project-easygo', label: 'EasyGO', to: '/projects/easygo' },
  ] },
  { id: 'achievements', label: 'Достижения', to: '/achievements', children: [
    { id: 'awards', label: 'Достижения команды', to: '/achievements' },
    { id: 'awards-team', label: 'Команда', to: '/team' },
  ] },
  { id: 'partners', label: 'Партнёрам', to: '/partners', children: [
    { id: 'partners-info', label: 'Партнёрам', to: '/partners' },
    { id: 'partners-projects', label: 'Проекты', to: '/projects' },
  ] },
  { id: 'join', label: 'Присоединиться', to: '/join' },
]
