import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Header({ links, clubName }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        menuRef.current?.focus()
      }
    }
    const desktop = matchMedia('(min-width: 1101px)')
    const onResize = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onResize)
    }
  }, [open])

  return (
    <header className={`ec-header ready${open ? ' open' : ''}`}>
      <NavLink className="brand ec-brand" to="/" onClick={() => setOpen(false)}>{clubName}</NavLink>
      <button ref={menuRef} className="menu ec-menu" type="button" aria-controls="navigation"
        aria-expanded={open} onClick={() => setOpen(value => !value)}>Меню</button>
      <nav id="navigation" aria-label="Основная навигация">
        {links.map(link => (
          <NavLink key={link.id} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
