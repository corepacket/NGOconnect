import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHandsHelping, FaBars, FaTimes } from 'react-icons/fa'
import { HiHome, HiInformationCircle, HiCalendar, HiUserGroup, HiLogout } from 'react-icons/hi'
import { useAuth } from '../auth/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, userType, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const baseNavLinks = [
    { name: 'Home', path: '/', icon: <HiHome className="w-5 h-5" /> },
    { name: 'Events', path: '/events', icon: <HiCalendar className="w-5 h-5" /> },
    { name: 'About', path: '/about', icon: <HiInformationCircle className="w-5 h-5" /> },
  ]

  const dashboardLink = isAuthenticated
    ? { name: 'Dashboard', path: userType === 'ngo' ? '/dashboard/ngo' : '/dashboard/volunteer', icon: <HiUserGroup className="w-5 h-5" /> }
    : null

  const navLinks = dashboardLink ? [...baseNavLinks, dashboardLink] : baseNavLinks

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg"
            >
              <FaHandsHelping className="w-6 h-6 text-white" />
            </motion.div>
            <span className="font-display text-xl font-bold">
              <span className="gradient-text">NGO</span>
              <span className="text-earth-700">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-earth-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 text-earth-600 hover:text-primary-600 transition-colors"
                >
                  <HiLogout className="w-5 h-5" />
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-earth-600 hover:text-primary-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-earth-600 hover:bg-primary-50 transition-colors"
          >
            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-earth-600 hover:bg-primary-50'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 text-center text-earth-600 border border-earth-200 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                >
                  <HiLogout className="w-5 h-5" />
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center text-earth-600 border border-earth-200 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}

export default Navbar