import { useParams } from 'react-router-dom'

export default function ProjectPage() {
  const { id } = useParams()

  return (
    <main>
      <h1>Проект</h1>
      <p>ID: {id}</p>
      <p>TODO: контент</p>
    </main>
  )
}
