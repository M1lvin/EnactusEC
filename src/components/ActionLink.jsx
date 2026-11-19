import { Link } from 'react-router-dom'

export default function ActionLink({ to, children }) {
  return <Link className="ec-action" to={to}>{children}<span aria-hidden="true"> ↗</span></Link>
}
