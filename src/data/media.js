import teamWide from '../media/team-1920.jpg'
import teamSmall from '../media/team-960.jpg'
import clubPoster from '../media/club-poster.jpg'
import teamPoster from '../media/team-poster.jpg'

// Club photographs: publication approved by the owner on 2026-11-23.
// Copies only; frozen originals remain untouched. No AI retouching.
export const media = {
  team: { src: teamWide, srcSet: `${teamSmall} 960w, ${teamWide} 1920w`, alt: 'Команда Enactus EC с флагом Enactus и табличкой Инженерного колледжа', width: 1920, height: 1280 },
  clubPoster: { src: clubPoster, alt: 'Клубный постер «Мы — команда Enactus EC» с тремя участниками', width: 708, height: 944 },
  teamPoster: { src: teamPoster, alt: 'Клубный постер «Кто мы?» с фотографией команды Enactus EC', width: 707, height: 944 },
}
