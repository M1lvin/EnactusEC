import { Link } from 'react-router-dom'
import './PageHero.css'

export default function PageHero({ title, intro, children }) {
  return <>
    <header className="ec-page-hero"><div className="ec-container">
      <p className="ec-kicker">Enactus EC</p><h1>{title}</h1>
      {intro && <p className="ec-intro">{intro}</p>}{children}
    </div></header>
    <nav className="ec-breadcrumb ec-container" aria-label="Хлебные крошки"><Link to="/">Главная</Link><span aria-hidden="true"> / </span><span aria-current="page">{title}</span></nav>
  </>
}
