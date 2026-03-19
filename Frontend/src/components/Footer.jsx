import { Link } from 'react-router-dom'
import { FaHandsHelping, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Quick Links': [
      { name: 'About Us', path: '/about' },
      { name: 'Events', path: '/events' },
      { name: 'Contact', path: '/contact' },
      { name: 'FAQs', path: '/faqs' },
    ],
    'For Volunteers': [
      { name: 'How It Works', path: '/how-it-works' },
      { name: 'Find Events', path: '/events' },
      { name: 'Success Stories', path: '/stories' },
      { name: 'Volunteer Guide', path: '/guide' },
    ],
    'For NGOs': [
      { name: 'Post an Event', path: '/post-event' },
      { name: 'NGO Resources', path: '/resources' },
      { name: 'Partnership', path: '/partnership' },
      { name: 'NGO Login', path: '/ngo-login' },
    ],
  }

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-earth-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <FaHandsHelping className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-white">NGO</span>
                <span className="text-primary-300">Connect</span>
              </span>
            </div>
            <p className="text-earth-300 mb-4 max-w-md">
              Bridging the gap between passionate volunteers and impactful NGOs. 
              Together, we can create lasting change in communities worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center text-earth-300 hover:bg-primary-600 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-lg mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-earth-300 hover:text-primary-300 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-earth-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-earth-400 text-sm">
            <p>&copy; {currentYear} NGOConnect. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-primary-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-300 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-primary-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer