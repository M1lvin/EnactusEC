import TodoNotice from './TodoNotice.jsx'
import logo from '../media/logo-transparent.svg'
import './Footer.css'

export default function Footer({ clubName, contacts }) {
  function goToTop() {
    document.getElementById('page-top')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return (
    <footer className="ec-footer" id="contacts">
      <div className="ec-footer-brand">
        <img src={logo} width="800" height="450" alt={clubName} />
        <p>{contacts.address}</p>
      </div>
      <div className="ec-footer-contact-section">
        <h2>Контакты</h2>
        <div className="ec-contact-links">
        <a href={contacts.phone.href}>{contacts.phone.label}</a>
        <a href={contacts.website.href}>{contacts.website.label}</a>
        <a href={contacts.instagram.href}>Instagram: {contacts.instagram.label}</a>
        <small>Контакты необходимо проверить у клуба.</small>
        </div>
      </div>
      <div className="ec-footer-bottom">
        <div>
          <TodoNotice>{contacts.email || 'TODO: почта клуба.'}</TodoNotice>
          <TodoNotice>{contacts.legal || 'TODO: юридическая строка и копирайт.'}</TodoNotice>
        </div>
        <button className="ec-back-top" type="button" onClick={goToTop}>Наверх <span aria-hidden="true">↑</span></button>
      </div>
    </footer>
  )
}
