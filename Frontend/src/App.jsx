import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Dashboard from './pages/Dashboard'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App