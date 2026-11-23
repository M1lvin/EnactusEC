export default function ClubPhoto({ photo, className = '', priority = false }) {
  return <img className={className} src={photo.src} srcSet={photo.srcSet} sizes="(max-width: 767px) 100vw, 1200px" alt={photo.alt} width={photo.width} height={photo.height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} />
}
