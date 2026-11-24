import lightLogo from '../media/logo-centered-light.svg'
import darkLogo from '../media/logo-centered-dark.svg'
import './ClubLogo.css'

export default function ClubLogo({ alt, dark = false }) {
  if (dark) return <img src={darkLogo} width="465" height="252" alt={alt} />

  return <span className="ec-club-logo">
    <img className="ec-club-logo-light" src={lightLogo} width="465" height="252" alt={alt} />
    <img className="ec-club-logo-dark" src={darkLogo} width="465" height="252" alt={alt} />
  </span>
}
