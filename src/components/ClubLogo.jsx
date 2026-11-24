import lightLogo from '../media/logo-centered-light.svg'
import darkLogo from '../media/logo-centered-dark.svg'
import './ClubLogo.css'

export default function ClubLogo({ alt, dark = false }) {
  if (dark) return <img src={darkLogo} width="600" height="340" alt={alt} />

  return <span className="ec-club-logo">
    <img className="ec-club-logo-light" src={lightLogo} width="600" height="340" alt={alt} />
    <img className="ec-club-logo-dark" src={darkLogo} width="600" height="340" alt={alt} />
  </span>
}
