import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { navigation } from '../data/navigation.js'
import { site } from '../data/site.js'
import './components.css'

export default function Layout() {
  return (
    <div className="ec-site">
      <a className="ec-skip" href="#content">К содержимому</a>
      <Header links={navigation} clubName={site.name} />
      <div id="content" tabIndex={-1}><Outlet /></div>
      <Footer clubName={site.name} contacts={site.contacts} />
    </div>
  )
}
