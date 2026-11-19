import { useEffect, useRef } from 'react'

export default function RevealSection({ children, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.classList.remove('ec-reveal-pending')
        observer.disconnect()
      }
    }, { threshold: 0.05 })
    const reveal = () => {
      if (motion.matches) {
        element.classList.remove('ec-reveal-pending')
        observer.disconnect()
      }
    }
    element.classList.add('ec-reveal-pending')
    observer.observe(element)
    motion.addEventListener('change', reveal)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', reveal)
      element.classList.remove('ec-reveal-pending')
    }
  }, [])

  return <section ref={ref} className="ec-section ec-reveal" {...props}>{children}</section>
}
