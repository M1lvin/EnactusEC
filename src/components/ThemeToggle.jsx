import { useEffect, useState } from 'react'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const [preference, setPreference] = useState(() => document.documentElement.dataset.themePreference || 'system')

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    function applyTheme() {
      document.documentElement.dataset.themePreference = preference
      document.documentElement.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference
    }
    applyTheme()
    media.addEventListener('change', applyTheme)
    return () => media.removeEventListener('change', applyTheme)
  }, [preference])

  function onChange(event) {
    const next = event.target.value
    setPreference(next)
    try { localStorage.setItem('enactus-theme', next) } catch { /* Выбор работает и без доступа к хранилищу. */ }
  }

  return (
    <div className="ec-theme-toggle">
      <label htmlFor="theme-preference" className="ec-sr-only">Тема оформления</label>
      <select id="theme-preference" value={preference} onChange={onChange}>
        <option value="light">Светлая</option>
        <option value="dark">Тёмная</option>
        <option value="system">Как в системе</option>
      </select>
    </div>
  )
}
