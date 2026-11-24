import PageHero from '../components/PageHero.jsx'
import TodoNotice from '../components/TodoNotice.jsx'
import TeamCard from '../components/TeamCard.jsx'
import ClubPhoto from '../components/ClubPhoto.jsx'
import ActionLink from '../components/ActionLink.jsx'
import { media } from '../data/media.js'
import { team } from '../data/team.js'
import { site } from '../data/site.js'
import './TeamPage.css'

export default function TeamPage() {
  return <main><PageHero title="Команда" intro={site.affiliation} /><div className="ec-page ec-page-content">
    <figure className="ec-team-photo"><ClubPhoto photo={media.team} className="ec-photo" priority /><figcaption className="ec-photo-caption">Команда Enactus EC</figcaption></figure>
    <section className="ec-team-members" aria-labelledby="team-members"><h2 id="team-members">Люди, которые объединяют идеи</h2><p className="ec-intro">{site.aboutText}</p>
      {team.length ? <div className="ec-team-grid">{team.map(member => <TeamCard key={member.id} member={member} />)}</div> : <TodoNotice>TODO: список участников и роли уточняются у клуба.</TodoNotice>}
      <div className="ec-actions"><ActionLink to="/join">Стать частью команды</ActionLink></div>
    </section>
  </div></main>
}
