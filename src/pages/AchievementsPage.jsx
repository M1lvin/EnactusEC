import TodoNotice from '../components/TodoNotice.jsx'
import { achievements } from '../data/achievements.js'
import './AchievementsPage.css'

export default function AchievementsPage() {
  const years = [...new Set(achievements.map(item => item.year))].sort((a, b) => (b ?? 0) - (a ?? 0))

  return (
    <main className="ec-page">
      <div className="ec-hero"><h1>Достижения</h1></div>
      {!achievements.length && <TodoNotice>TODO: достижения уточняются у клуба.</TodoNotice>}
      {years.map(year => (
        <section className="ec-achievement-year" key={year ?? 'unknown'} aria-labelledby={`achievements-${year ?? 'unknown'}`}>
          <h2 id={`achievements-${year ?? 'unknown'}`}>{year ?? 'Год уточняется'}</h2>
          {year == null && <TodoNotice>TODO: подтвердить год у клуба.</TodoNotice>}
          <div className="ec-achievement-list">
            {achievements.filter(item => item.year === year).map(item => (
              <article className="ec-achievement" key={item.id}>
                <h3>{item.title || 'Достижение уточняется'}</h3>
                {item.event ? <p className="ec-achievement-event">{item.event}</p> : <TodoNotice>TODO: мероприятие уточняется.</TodoNotice>}
                {item.description ? <p>{item.description}</p> : <TodoNotice>TODO: описание достижения уточняется.</TodoNotice>}
                {!item.publicationApproved && <TodoNotice>TODO: подтвердить формулировки у клуба; нужно согласие на публикацию имени.</TodoNotice>}
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
