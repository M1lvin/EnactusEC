import TodoNotice from '../components/TodoNotice.jsx'
import { partners } from '../data/partners.js'
import './PartnersPage.css'

export default function PartnersPage() {
  return (
    <main className="ec-page">
      <div className="ec-hero"><h1>Партнёрам</h1></div>
      <section className="ec-partners-section" aria-labelledby="partners-list">
        <h2 id="partners-list">Наши партнёры</h2>
        {partners.length ? <div className="ec-partners-grid">{partners.map(partner => (
          <article className="ec-partner-card" key={partner.id}>
            <h3>{partner.name || 'Название уточняется'}</h3>
            {!partner.name && <TodoNotice>TODO: название партнёра.</TodoNotice>}
            {partner.logo ? <img src={partner.logo} alt={partner.name || 'Логотип партнёра'} loading="lazy" /> : <TodoNotice>TODO: логотип партнёра.</TodoNotice>}
            {partner.url ? <a href={partner.url}>Сайт партнёра</a> : <TodoNotice>TODO: ссылка на сайт партнёра.</TodoNotice>}
          </article>
        ))}</div> : <TodoNotice>Партнёры уточняются</TodoNotice>}
      </section>
      <section className="ec-partners-section" aria-labelledby="sponsorship">
        <h2 id="sponsorship">Как стать спонсором</h2>
        <TodoNotice>TODO: условия спонсорства уточняются у клуба.</TodoNotice>
      </section>
    </main>
  )
}
