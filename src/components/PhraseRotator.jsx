import { useEffect, useState } from 'react'
import './PhraseRotator.css'

export default function PhraseRotator({ phrases }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(() => document.hidden)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const automatic = !paused && !hovered && !focused && !hidden && !reduced

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => setReduced(motion.matches)
    const onVisibility = () => setHidden(document.hidden)
    motion.addEventListener('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      motion.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (!automatic || phrases.length < 2) return
    const timer = setInterval(() => setIndex(current => (current + 1) % phrases.length), 6000)
    return () => clearInterval(timer)
  }, [automatic, phrases.length])

  return (
    <section className="ec-phrase-rotator" aria-labelledby="phrases-title"
      onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true) }}
      onPointerLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
      <div className="ec-container">
      <div className="ec-phrase-heading">
        <h2 id="phrases-title">Слова, которые объединяют</h2>
        {!reduced && <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Продолжить' : 'Пауза'}</button>}
      </div>
      <div className="ec-phrases" aria-live={automatic ? 'off' : 'polite'} aria-atomic="true">
        {phrases.map((phrase, position) => (
          <blockquote key={phrase.id} hidden={position !== index}>
            <span lang={phrase.lang}>{phrase.text}</span>{phrase.translation && <span> ({phrase.translation})</span>}
          </blockquote>
        ))}
      </div>
      <div className="ec-phrase-controls">
        <button type="button" onClick={() => setIndex(current => (current + 1) % phrases.length)}>Следующая фраза <span aria-hidden="true">→</span></button>
        {reduced && <small>Автосмена отключена по настройке уменьшения движения.</small>}
      </div>
      </div>
    </section>
  )
}
