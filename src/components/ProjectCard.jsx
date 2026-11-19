import ActionLink from './ActionLink.jsx'
import './ProjectCard.css'

export default function ProjectCard({ project }) {
  return (
    <article className="ec-project-card">
      {project.image
        ? <img className="ec-project-image" src={project.image} alt={project.name} loading="lazy" />
        : <div className="ec-project-cover"><b aria-hidden="true">{project.name}</b><span>Фото скоро</span><i aria-hidden="true" /></div>}
      <div className="ec-card-copy">
        <h3>{project.name}</h3>
        <p className="ec-meta">{project.exhibition}</p>
        <p>{project.description || 'Описание готовится'}</p>
        <dl className="ec-project-details">
          <div><dt>Проблема</dt><dd>{project.problem || 'Скоро'}</dd></div>
          <div><dt>Решение</dt><dd>{project.solution || 'Скоро'}</dd></div>
          <div><dt>Результат</dt><dd>{project.result || 'Скоро'}</dd></div>
        </dl>
        {project.statusNote && (
          <div className="ec-features">
            <div className="ec-feature-heading"><h4>Функции</h4><span className="ec-badge">В разработке</span></div>
            <p>{project.statusNote}</p>
            {project.features.length
              ? <ul>{project.features.map(feature => <li key={feature.id}>{feature.label}</li>)}</ul>
              : <p className="ec-meta">Список функций уточняется</p>}
          </div>
        )}
        <ActionLink to={`/projects/${project.id}`}>О проекте {project.name}</ActionLink>
      </div>
    </article>
  )
}
