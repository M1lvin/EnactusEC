import PageHero from '../components/PageHero.jsx'
import ActionLink from '../components/ActionLink.jsx'

export default function NotFoundPage() {
  return <main><PageHero title="Страница не найдена" intro="Ошибка 404" /><div className="ec-page ec-page-content"><p>Проверьте адрес или вернитесь на главную страницу Enactus EC.</p><div className="ec-actions"><ActionLink to="/">На главную</ActionLink></div></div></main>
}
