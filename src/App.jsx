import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import AchievementsPage from './pages/AchievementsPage.jsx'
import TeamPage from './pages/TeamPage.jsx'
import PartnersPage from './pages/PartnersPage.jsx'
import JoinPage from './pages/JoinPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
