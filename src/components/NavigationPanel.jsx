import { Link } from 'react-router-dom'

export default function NavigationPanel({ item, description, open, onNavigate }) {
  return (
    <div className="nav-panel" id={`panel-${item.id}`} aria-labelledby={`nav-${item.id}`} hidden={!open}>
      <div className="nav-panel-inner">
        <h2>{item.label}</h2>
        <div className="nav-panel-links">
          {item.children.map(link => <Link key={link.id} to={link.to} onClick={onNavigate}>
            {link.label}<span aria-hidden="true">↗</span>
          </Link>)}
        </div>
        <p>{description}</p>
      </div>
    </div>
  )
}
