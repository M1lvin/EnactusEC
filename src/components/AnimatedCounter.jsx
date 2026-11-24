import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ value, label, duration = 1400, todo = false }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (!Number.isFinite(value)) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let observer
    let started = false

    function finish() {
      cancelAnimationFrame(frame)
      setDisplayValue(value)
    }
    function start() {
      if (started) return
      started = true
      if (motion.matches || duration <= 0) { finish(); return }
      const beginning = performance.now()
      function tick(now) {
        const progress = Math.min((now - beginning) / duration, 1)
        setDisplayValue(Math.round(value * (1 - (1 - progress) ** 3)))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    function onMotionChange() {
      if (motion.matches) { started = true; observer?.disconnect(); finish() }
    }
    if (motion.matches || !('IntersectionObserver' in window)) start()
    else {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { start(); observer.disconnect() }
      }, { threshold: 0.15 })
      observer.observe(ref.current)
    }
    motion.addEventListener('change', onMotionChange)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      motion.removeEventListener('change', onMotionChange)
    }
  }, [value, duration])

  return (
    <div className="ec-stat" ref={ref}>
      <span className="ec-stat-number" aria-hidden="true">{Number.isFinite(value) ? displayValue : '—'}</span>
      <span className="ec-sr-only">{Number.isFinite(value) ? value : 'Данные отсутствуют'}</span>
      <span>{label}</span>
      {todo && <small>Демонстрационное значение · TODO: подтвердить</small>}
    </div>
  )
}
