import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import NavigationPanel from './NavigationPanel.jsx'
import ClubLogo from './ClubLogo.jsx'
import './Header.css'

export default function Header({ links, clubName, description }) {
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState(null)
  const menuRef = useRef(null)
  const headerRef = useRef(null)
  const navRef = useRef(null)
  const buttons = useRef({})
  const join = links.find(link => link.id === 'join')

  function closeNavigation() {
    setOpen(false)
    setPanel(null)
  }

  function openPanel(id, focusFirst = false) {
    setPanel(id)
    if (focusFirst) requestAnimationFrame(() => {
      headerRef.current?.querySelector(`#panel-${id} a`)?.focus()
    })
  }

  useEffect(() => {
    if (open) navRef.current?.querySelector('a')?.focus()
  }, [open])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key !== 'Escape') return
      if (panel) {
        event.preventDefault()
        setPanel(null)
        buttons.current[panel]?.focus()
      } else if (open) {
        event.preventDefault()
        setOpen(false)
        menuRef.current?.focus()
      }
    }
    function onPointerDown(event) {
      if (!headerRef.current?.contains(event.target)) setPanel(null)
    }
    const desktop = matchMedia('(min-width: 1101px)')
    function onResize() {
      const focusInNav = navRef.current?.contains(document.activeElement)
      setPanel(null)
      setOpen(false)
      if (!desktop.matches && focusInNav) menuRef.current?.focus()
      if (desktop.matches && document.activeElement === menuRef.current) {
        navRef.current?.querySelector('a')?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      desktop.removeEventListener('change', onResize)
    }
  }, [open, panel])

  return (
    <header ref={headerRef} className={`ec-header ready${open ? ' open' : ''}`}>
      <div className="ec-header-inner">
      <NavLink className="brand ec-brand" to="/" aria-label={`${clubName} — главная`} onClick={closeNavigation}>
        <ClubLogo alt={clubName} />
      </NavLink>
      <button ref={menuRef} className="menu ec-menu" type="button" aria-controls="navigation"
        aria-expanded={open} onClick={() => { setPanel(null); setOpen(value => !value) }}>
        <span className="ec-menu-icon" aria-hidden="true"><span /><span /><span /></span>
        <span className="ec-menu-label">Меню</span>
      </button>
      <nav ref={navRef} id="navigation" aria-label="Основная навигация">
        {links.filter(link => link.id !== 'join').map(link => (
          <div key={link.id} className={`nav-expand${panel === link.id ? ' expanded' : ''}`}
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) setPanel(current => current === link.id ? null : current)
            }}>
            <div className="nav-item">
              <NavLink className="nav-primary" id={`nav-${link.id}`} to={link.to} end={link.to === '/'} onClick={closeNavigation}>{link.label}</NavLink>
              {link.children?.length > 0 && <button ref={element => { buttons.current[link.id] = element }} className="nav-disclosure" type="button"
                aria-label={`Подменю «${link.label}»`} aria-expanded={panel === link.id} aria-controls={`panel-${link.id}`}
                onClick={() => setPanel(current => current === link.id ? null : link.id)}
                onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); openPanel(link.id, true) } }}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 6 5 5 5-5" /></svg>
              </button>}
            </div>
            {link.children?.length > 0 && <NavigationPanel item={link} description={description} open={panel === link.id} onNavigate={closeNavigation} />}
          </div>
        ))}
        {join && <NavLink className="ec-join ec-mobile-join" to={join.to} onClick={closeNavigation}>{join.label}</NavLink>}
      </nav>
      <div className="ec-header-actions">

        {join && <NavLink className="ec-join" to={join.to} onClick={closeNavigation}>{join.label}</NavLink>}
      </div>
      </div>
    </header>
  )
}
