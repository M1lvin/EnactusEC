import { useState } from 'react'
import ActionLink from './ActionLink.jsx'
import './Hero.css'

export default function Hero({ slogan, affiliation, photo }) {
  const [failedPhoto, setFailedPhoto] = useState(null)
  const showPhoto = Boolean(photo) && failedPhoto !== photo

  return (
    <section className="ec-home-hero" aria-labelledby="hero-title">
      <div className="ec-home-hero-copy">
        <p className="ec-kicker">{affiliation}</p>
        <h1 id="hero-title">ENACTUS <span>EC</span></h1>
        <p className="ec-home-hero-slogan">{slogan}</p>
        <ActionLink to="/join">Присоединиться</ActionLink>
      </div>
      <div className="ec-home-hero-art" aria-hidden={!showPhoto}>
        {showPhoto && <img src={photo} alt="Команда Enactus EC" width="1200" height="800" onError={() => setFailedPhoto(photo)} />}
        <div className="ec-hero-rectangle ec-hero-rectangle-back" aria-hidden="true" />
        <div className="ec-hero-rectangle ec-hero-rectangle-front" aria-hidden="true" />
        <span className="ec-hero-monogram" aria-hidden="true">EC</span>
      </div>
    </section>
  )
}
