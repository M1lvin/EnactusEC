import TodoNotice from './TodoNotice.jsx'
import './TeamCard.css'

export default function TeamCard({ member }) {
  const approved = member.publicationApproved === true

  return (
    <article className="ec-team-card">
      <h3>{approved ? member.name || 'Имя уточняется' : 'Имя после согласия'}</h3>
      {!approved && <TodoNotice>TODO: нужно согласие на публикацию имени и фото.</TodoNotice>}
      {approved && member.photo
        ? <img src={member.photo} alt={member.name ? `Участник команды: ${member.name}` : 'Участник команды Enactus EC'} loading="lazy" />
        : <TodoNotice>TODO: фото участника после согласия на публикацию.</TodoNotice>}
      {approved && !member.name && <TodoNotice>TODO: имя участника уточняется.</TodoNotice>}
      {member.role ? <p>{member.role}</p> : <TodoNotice>TODO: роль участника уточняется.</TodoNotice>}
    </article>
  )
}
