import RevealSection from '../components/RevealSection.jsx'
import ActionLink from '../components/ActionLink.jsx'
import TodoNotice from '../components/TodoNotice.jsx'
import { site } from '../data/site.js'
import './AboutPage.css'

export default function AboutPage() {
  return (
    <main className="ec-page ec-about-page">
      <div className="ec-hero"><p className="ec-kicker">{site.name}</p><h1>О нас</h1></div>
      <RevealSection aria-labelledby="about-enactus">
        <div className="ec-about-section">
          <div><span className="ec-section-number" aria-hidden="true">01</span><h2 id="about-enactus">Что такое Enactus</h2></div>
          <div>{site.enactusExplanation ? <p>{site.enactusExplanation}</p> : <TodoNotice>TODO: согласовать объяснение движения Enactus.</TodoNotice>}</div>
        </div>
      </RevealSection>
      <RevealSection aria-labelledby="about-club">
        <div className="ec-about-section">
          <div><span className="ec-section-number" aria-hidden="true">02</span><h2 id="about-club">О клубе</h2></div>
          <p>{site.aboutText}</p>
        </div>
      </RevealSection>
      <RevealSection aria-labelledby="about-mission">
        <div className="ec-about-section">
          <div><span className="ec-section-number" aria-hidden="true">03</span><h2 id="about-mission">Миссия</h2></div>
          <div>{site.mission ? <p>{site.mission}</p> : <TodoNotice>TODO: миссия клуба в одном предложении от команды.</TodoNotice>}</div>
        </div>
      </RevealSection>
      <RevealSection aria-labelledby="about-work">
        <div className="ec-about-section">
          <div><span className="ec-section-number" aria-hidden="true">04</span><h2 id="about-work">Как мы работаем</h2></div>
          <div>
            {site.howWeWork ? <p>{site.howWeWork}</p> : <TodoNotice>TODO: как клуб работает (встречи, форматы участия).</TodoNotice>}
            <div className="ec-actions"><ActionLink to="/projects">Наши проекты</ActionLink><ActionLink to="/join">Присоединиться</ActionLink></div>
          </div>
        </div>
      </RevealSection>
    </main>
  )
}
