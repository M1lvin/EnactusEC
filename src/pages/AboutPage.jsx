import PageHero from '../components/PageHero.jsx'
import RevealSection from '../components/RevealSection.jsx'
import ActionLink from '../components/ActionLink.jsx'
import TodoNotice from '../components/TodoNotice.jsx'
import ClubPhoto from '../components/ClubPhoto.jsx'
import { media } from '../data/media.js'
import { site } from '../data/site.js'
import './AboutPage.css'

export default function AboutPage() {
  return <main><PageHero title="О нас" intro={site.affiliation} />
    <div className="ec-page ec-about-page">
      <RevealSection aria-labelledby="about-club"><div className="ec-about-intro"><div><h2 id="about-club">Идеи превращаются в действия</h2><p className="ec-intro">{site.aboutText}</p><div className="ec-actions"><ActionLink to="/team">Наша команда</ActionLink></div></div><ClubPhoto photo={media.team} className="ec-photo" /></div></RevealSection>
      <RevealSection aria-labelledby="about-enactus"><div className="ec-about-section"><h2 id="about-enactus">Что такое Enactus</h2><div>{site.enactusExplanation ? <p>{site.enactusExplanation}</p> : <TodoNotice>TODO: согласовать объяснение движения Enactus.</TodoNotice>}</div></div></RevealSection>
      <RevealSection aria-labelledby="about-mission"><div className="ec-about-section"><h2 id="about-mission">Наша миссия</h2><div>{site.mission ? <p>{site.mission}</p> : <TodoNotice>TODO: миссия клуба в одном предложении от команды.</TodoNotice>}</div></div></RevealSection>
      <RevealSection aria-labelledby="about-work"><div className="ec-about-section"><h2 id="about-work">Как мы работаем</h2><div>{site.howWeWork ? <p>{site.howWeWork}</p> : <TodoNotice>TODO: как клуб работает (встречи, форматы участия).</TodoNotice>}<div className="ec-actions"><ActionLink to="/projects">Наши проекты</ActionLink><ActionLink to="/join">Присоединиться</ActionLink></div></div></div></RevealSection>
    </div>
  </main>
}
