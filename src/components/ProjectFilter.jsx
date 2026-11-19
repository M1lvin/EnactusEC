export default function ProjectFilter({ options, value, onChange }) {
  return (
    <div className="ec-filter">
      <label htmlFor="project-direction">Направление проекта</label>
      <select id="project-direction" value={value} onChange={event => onChange(event.target.value)}>
        <option value="all">Все направления</option>
        {options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
      </select>
      <small>Направления уточняются у клуба.</small>
    </div>
  )
}
