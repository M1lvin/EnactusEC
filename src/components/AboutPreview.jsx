import { Link } from 'react-router-dom'
import RevealSection from './RevealSection.jsx'
import ClubPhoto from './ClubPhoto.jsx'
import { media } from '../data/media.js'
import './AboutPreview.css'

export default function AboutPreview({ text }) {
  return <RevealSection aria-labelledby="home-about"><div className="ec-container ec-about-preview">
    <div><h2 id="home-about">Что нас объединяет</h2><p>{text}</p>
      <div className="ec-about-links">
        <Link to="/about"><h3>О клубе</h3><span>Узнать об Enactus EC</span><b aria-hidden="true">↗</b></Link>
        <Link to="/projects"><h3>Наши проекты</h3><span>EcoBrew и EasyGO</span><b aria-hidden="true">↗</b></Link>
        <Link to="/team"><h3>Наша команда</h3><span>Студенты Инженерного колледжа</span><b aria-hidden="true">↗</b></Link>
      </div>
    </div>
    <figure><ClubPhoto photo={media.teamPoster} className="ec-photo" /><figcaption className="ec-photo-caption">Enactus EC · Инженерный колледж Light Academy</figcaption></figure>
  </div></RevealSection>
}
