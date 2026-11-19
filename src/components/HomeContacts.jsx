import RevealSection from './RevealSection.jsx'
import SectionTitle from './SectionTitle.jsx'
import TodoNotice from './TodoNotice.jsx'
import './HomeContacts.css'

export default function HomeContacts({ contacts }) {
  return (
    <RevealSection aria-labelledby="home-contacts">
      <SectionTitle title={<span id="home-contacts">Контакты</span>} description="Проверить у клуба" />
      <div className="ec-home-contacts">
        <a href={contacts.phone.href}>{contacts.phone.label}</a>
        <a href={contacts.website.href}>{contacts.website.label}</a>
        <a href={contacts.instagram.href}>Instagram: {contacts.instagram.label}</a>
      </div>
      <TodoNotice>{contacts.email || 'TODO: почта клуба.'}</TodoNotice>
    </RevealSection>
  )
}
