import RevealSection from '../components/RevealSection.jsx'
import { useState } from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import ProjectFilter from '../components/ProjectFilter.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { projects } from '../data/projects.js'
import { directions } from '../data/directions.js'

export default function ProjectsPage() {
  const [direction, setDirection] = useState('all')
  const selectedDirection = directions.find(item => item.id === direction)
  const filteredProjects = projects.filter(project => project.direction === direction)
  const unassignedProjects = projects.filter(project => project.direction === null)
  const visibleProjects = direction === 'all' ? projects : unassignedProjects

  return (
    <main className="ec-page">
      <div className="ec-hero"><h1>Проекты</h1><p className="ec-intro">EcoBrew и EasyGO</p></div>
      <ProjectFilter options={directions} value={direction} onChange={setDirection} />
      <div aria-live="polite" aria-atomic="true" className="ec-sr-only">
        {direction === 'all' ? `Всего проектов: ${projects.length}` : `По направлению найдено: ${filteredProjects.length}. Без подтверждённого направления: ${unassignedProjects.length}`}
      </div>
      {direction !== 'all' && (
        <RevealSection aria-labelledby="filtered-projects">
          <SectionTitle title={<span id="filtered-projects">{selectedDirection.label}</span>} />
          {filteredProjects.length
            ? <div className="ec-grid">{filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
            : <EmptyState title="Проекты пока не добавлены" description="Направления проектов уточняются. Проекты без направления доступны ниже." />}
        </RevealSection>
      )}
      <RevealSection aria-labelledby="all-projects">
        <SectionTitle title={<span id="all-projects">Все проекты</span>}
          description={direction === 'all' ? undefined : 'Проекты, направление которых ещё уточняется.'} />
        {visibleProjects.length
          ? <div className="ec-grid">{visibleProjects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
          : <EmptyState title="Проектов без направления нет" description="Выберите все направления, чтобы увидеть полный список." />}
      </RevealSection>
    </main>
  )
}
