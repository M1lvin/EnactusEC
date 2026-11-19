import TodoNotice from './TodoNotice.jsx'

export default function Footer({ clubName, contacts }) {
  return (
    <footer className="ec-footer">
      <div><strong>{clubName}</strong><p>{contacts.address}</p></div>
      <div className="ec-contact-links">
        <a href={contacts.phone.href}>{contacts.phone.label}</a>
        <a href={contacts.website.href}>{contacts.website.label}</a>
        <a href={contacts.instagram.href}>Instagram: {contacts.instagram.label}</a>
        <small>Контакты необходимо проверить у клуба.</small>
      </div>
      <TodoNotice>{contacts.email || 'TODO: почта клуба.'}</TodoNotice>
      <TodoNotice>{contacts.legal || 'TODO: юридическая строка и копирайт.'}</TodoNotice>
    </footer>
  )
}
