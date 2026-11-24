import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { navigation } from '../data/navigation.js'
import { site } from '../data/site.js'

export default function Layout() {
  const { pathname } = useLocation()
  const previous = useRef(pathname)
  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('content')?.focus({ preventScroll: true })
  }, [pathname])
  return (
    <div className="ec-site" id="page-top" tabIndex={-1}>
      <a className="ec-skip" href="#content">К содержимому</a>
      <Header links={navigation} clubName={site.name} description={site.aboutText} />
      <div id="content" tabIndex={-1}><Outlet /></div>
      <Footer clubName={site.name} contacts={site.contacts} />
    </div>
  )
}
