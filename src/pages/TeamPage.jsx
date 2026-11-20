import TodoNotice from '../components/TodoNotice.jsx'
import TeamCard from '../components/TeamCard.jsx'
import { team } from '../data/team.js'
import './TeamPage.css'

export default function TeamPage() {
  return (
    <main className="ec-page">
      <div className="ec-hero"><h1>Команда</h1></div>
      <section className="ec-team-members" aria-labelledby="team-members">
        <h2 id="team-members">Участники</h2>
        {team.length
          ? <div className="ec-team-grid">{team.map(member => <TeamCard key={member.id} member={member} />)}</div>
          : <TodoNotice>Состав команды уточняется</TodoNotice>}
      </section>
    </main>
  )
}
