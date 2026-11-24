import { Link } from 'react-router-dom'
import TodoNotice from './TodoNotice.jsx'
import ClubLogo from './ClubLogo.jsx'
import { navigation } from '../data/navigation.js'
import './Footer.css'

export default function Footer({ clubName, contacts }) {
  function goToTop() {
    document.getElementById('page-top')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <footer className="ec-footer" id="contacts">
    <div className="ec-container">
      <div className="ec-footer-top"><Link to="/" aria-label={`${clubName} — главная`}><ClubLogo alt={clubName} dark /></Link><Link className="ec-action" to="/join">Присоединиться <span aria-hidden="true">↗</span></Link></div>
      <div className="ec-footer-grid">
        <div><h2>{clubName}</h2><p>{contacts.address}</p><a className="ec-social-link" href={contacts.instagram.href}>Instagram · {contacts.instagram.label} <span aria-hidden="true">↗</span></a></div>
        <nav aria-label="Навигация в подвале"><h2>О клубе</h2>{navigation.filter(link => link.id !== 'join').map(link => <Link key={link.id} to={link.to}>{link.label}</Link>)}<Link to="/team">Команда</Link></nav>
        <div><h2>Контакты</h2><div className="ec-contact-links"><span>Телефон колледжа</span><a href={contacts.phone.href}>{contacts.phone.label}</a><a href={contacts.website.href}>{contacts.website.label}</a><small>Контакты необходимо проверить у клуба.</small></div><TodoNotice>{contacts.email || 'TODO: почта клуба.'}</TodoNotice></div>
      </div>
      <div className="ec-footer-bottom"><TodoNotice>{contacts.legal || 'TODO: юридическая строка и копирайт.'}</TodoNotice><button className="ec-back-top" type="button" onClick={goToTop}>Наверх <span aria-hidden="true">↑</span></button></div>
    </div>
  </footer>
}
