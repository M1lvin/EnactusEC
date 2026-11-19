import RevealSection from './RevealSection.jsx'
import ActionLink from './ActionLink.jsx'
import './AboutPreview.css'

export default function AboutPreview({ text }) {
  return (
    <RevealSection aria-labelledby="home-about">
      <div className="ec-about-preview">
        <h2 id="home-about">Немного о нас</h2>
        <div><p>{text}</p><div className="ec-actions"><ActionLink to="/about">Подробнее о нас</ActionLink></div></div>
      </div>
    </RevealSection>
  )
}
