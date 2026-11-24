import { Link } from 'react-router-dom'
import TodoNotice from './TodoNotice.jsx'
import './ProjectCard.css'

export default function ProjectCard({ project }) {
  return <article className="ec-project-card">
    <div className="ec-project-cover">{project.image ? <img src={project.image} alt={project.name} loading="lazy" /> : <><b aria-hidden="true">{project.name}</b><span>TODO: фото проекта</span></>}</div>
    <div className="ec-card-copy"><p className="ec-meta">{project.exhibition}</p><h3><Link to={`/projects/${project.id}`}>{project.name}<span aria-hidden="true">↗</span></Link></h3>
      {project.description ? <p>{project.description}</p> : <TodoNotice>TODO: описание проекта от команды.</TodoNotice>}
      {project.statusNote && <p className="ec-project-status"><span className="ec-badge">В разработке</span>{project.statusNote}</p>}
      <p className="ec-card-more" aria-hidden="true">Подробнее о проекте →</p>
    </div>
  </article>
}
