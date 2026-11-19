import RevealSection from '../components/RevealSection.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import ActionLink from '../components/ActionLink.jsx'
import TodoNotice from '../components/TodoNotice.jsx'
import { site } from '../data/site.js'

export default function AboutPage() {
  return (
    <main className="ec-page">
      <div className="ec-hero"><p className="ec-kicker">{site.name}</p><h1>О нас</h1><p className="ec-intro">{site.aboutText}</p></div>
      <RevealSection aria-labelledby="about-enactus">
        <SectionTitle title={<span id="about-enactus">Что такое Enactus</span>} />
        <TodoNotice>{site.enactusExplanation || 'TODO: согласовать объяснение движения Enactus.'}</TodoNotice>
      </RevealSection>
      <RevealSection aria-labelledby="about-mission">
        <SectionTitle title={<span id="about-mission">Наша миссия</span>} />
        <TodoNotice>{site.mission || 'TODO: миссия клуба в одном предложении от команды.'}</TodoNotice>
      </RevealSection>
      <RevealSection aria-labelledby="about-work">
        <SectionTitle title={<span id="about-work">Как мы работаем</span>} />
        <TodoNotice>{site.howWeWork || 'TODO: как клуб работает (встречи, форматы участия).'}</TodoNotice>
        <div className="ec-actions"><ActionLink to="/projects">Наши проекты</ActionLink><ActionLink to="/join">Присоединиться</ActionLink></div>
      </RevealSection>
    </main>
  )
}
