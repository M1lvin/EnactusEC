import './HomePage.css'
import AboutPreview from '../components/AboutPreview.jsx'
import HomeContacts from '../components/HomeContacts.jsx'
import Hero from '../components/Hero.jsx'
import PhraseRotator from '../components/PhraseRotator.jsx'
import { phrases } from '../data/phrases.js'
import RevealSection from '../components/RevealSection.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import ActionLink from '../components/ActionLink.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import TodoNotice from '../components/TodoNotice.jsx'
import { site } from '../data/site.js'
import { projects } from '../data/projects.js'
import { stats } from '../data/stats.js'

export default function HomePage() {
  return (
    <main className="ec-home">
      <Hero slogan={site.slogan} affiliation={site.affiliation} photo={site.heroPhoto} />
      <AboutPreview text={site.aboutText} />
      <RevealSection className="ec-section ec-reveal ec-home-stats" aria-labelledby="home-stats"><div className="ec-container">
        <SectionTitle title={<span id="home-stats">В цифрах</span>} description="Демонстрационные значения. Данные уточняются у клуба." />
        <div className="ec-stats">{stats.map(stat => <AnimatedCounter key={stat.id} value={stat.value} label={stat.label} todo={stat.todo} />)}</div>
      </div></RevealSection>
      <RevealSection className="ec-section ec-reveal ec-home-projects" aria-labelledby="home-projects"><div className="ec-container">
        <SectionTitle title={<span id="home-projects">Наши проекты</span>} />
        <div className="ec-grid ec-projects-grid">{projects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
        <div className="ec-actions"><ActionLink to="/projects">Все проекты</ActionLink></div>
      </div></RevealSection>
      <RevealSection className="ec-section ec-reveal ec-home-highlights" aria-labelledby="home-highlights"><div className="ec-container">
        <SectionTitle title={<span id="home-highlights">Достижения</span>} />
        <div className="ec-grid">{site.highlights.map(item => (
          <article className="ec-highlight" key={item.id}><h3>{item.title}</h3><p>{item.description}</p><TodoNotice>{item.todo}</TodoNotice></article>
        ))}</div>
      </div></RevealSection>
      <PhraseRotator phrases={phrases} />
      <HomeContacts contacts={site.contacts} />
    </main>
  )
}
