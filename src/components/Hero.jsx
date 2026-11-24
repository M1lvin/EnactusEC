import ActionLink from './ActionLink.jsx'
import ClubPhoto from './ClubPhoto.jsx'
import { media } from '../data/media.js'
import './Hero.css'

export default function Hero({ slogan, affiliation }) {
  return <section className="ec-home-hero" aria-labelledby="hero-title">
    <div className="ec-hero-photo"><ClubPhoto photo={media.team} priority />
      <div className="ec-hero-caption"><div className="ec-container"><p className="ec-kicker">{affiliation}</p><h1 id="hero-title">Мы — <span>Enactus EC</span></h1></div></div>
    </div>
    <div className="ec-hero-message"><div className="ec-container"><p>{slogan}</p><ActionLink to="/join">Присоединиться</ActionLink></div></div>
  </section>
}
