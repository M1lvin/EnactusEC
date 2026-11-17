import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main>
      <h1>Страница не найдена</h1>
      <p>TODO: контент</p>
      <Link to="/">На главную</Link>
    </main>
  )
}
