import { Link } from 'react-router-dom'
import { media } from '../data/media.js'
import ClubPhoto from './ClubPhoto.jsx'

export default function NavigationPanel({ item, description, open, onNavigate }) {
  return <div className="nav-panel" id={`panel-${item.id}`} aria-labelledby={`nav-${item.id}`} hidden={!open}>
    <div className="nav-panel-inner">
      <div><h2>{item.label}</h2><div className="nav-panel-links">{item.children.map(link => <Link key={link.id} to={link.to} onClick={onNavigate}>{link.label}<span aria-hidden="true">↗</span></Link>)}</div></div>
      <div className="nav-panel-feature"><ClubPhoto photo={media.team} /><p>{description}</p></div>
    </div>
  </div>
}
