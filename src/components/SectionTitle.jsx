export default function SectionTitle({ title, description }) {
  return (
    <div className="ec-section-title">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
