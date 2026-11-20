import { Link, useParams } from 'react-router-dom'
import TodoNotice from '../components/TodoNotice.jsx'
import { projects } from '../data/projects.js'
import { directions } from '../data/directions.js'
import './ProjectPage.css'

function DetailSection({ id, title, value, todo }) {
  return (
    <section className="ec-project-detail-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {value ? <p>{value}</p> : <TodoNotice>{todo}</TodoNotice>}
    </section>
  )
}

export default function ProjectPage() {
  const { id } = useParams()
  const project = projects.find(item => item.id === id)

  if (!project) return (
    <main className="ec-page">
      <div className="ec-hero"><h1>Проект не найден</h1><Link className="ec-project-back" to="/projects">К списку проектов</Link></div>
    </main>
  )

  const direction = directions.find(item => item.id === project.direction)

  return (
    <main className="ec-page">
      <div className="ec-hero">
        <Link className="ec-project-back" to="/projects">Все проекты</Link>
        <h1>{project.name}</h1>
        {project.exhibition ? <p>{project.exhibition}</p> : <TodoNotice>TODO: выставка уточняется.</TodoNotice>}
        {project.image ? <img className="ec-project-detail-image" src={project.image} alt={project.name} /> : <TodoNotice>TODO: фото проекта. Скоро.</TodoNotice>}
      </div>
      <DetailSection id="project-direction" title="Направление" value={direction?.label || project.direction} todo="TODO: направление проекта уточняется у команды." />
      {direction?.todo && <TodoNotice>TODO: подтвердить направление у клуба.</TodoNotice>}
      <DetailSection id="project-description" title="Описание" value={project.description} todo="TODO: описание проекта готовится." />
      <DetailSection id="project-problem" title="Проблема" value={project.problem} todo="TODO: описание проблемы уточняется у команды." />
      <DetailSection id="project-solution" title="Решение" value={project.solution} todo="TODO: решение уточняется у команды." />
      <DetailSection id="project-result" title="Результат" value={project.result} todo="TODO: результат уточняется у команды." />
      <section className="ec-project-detail-section" aria-labelledby="project-features">
        <div className="ec-project-detail-heading"><h2 id="project-features">Функции</h2>{project.statusNote && <span className="ec-badge">В разработке</span>}</div>
        {project.statusNote && <p>{project.statusNote}</p>}
        {project.features?.length ? <ul>{project.features.map(feature => <li key={feature.id}>{feature.label}</li>)}</ul> : <TodoNotice>TODO: список функций уточняется у команды.</TodoNotice>}
      </section>
    </main>
  )
}
