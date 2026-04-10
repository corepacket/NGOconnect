import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHandsHelping, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaQuestionCircle, FaChevronUp, FaChevronDown } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [showFAQs, setShowFAQs] = useState(false)
  const [randomStory, setRandomStory] = useState(null)

  const successStories = [
    {
      title: "Beach Cleanup Hero",
      story: "Sarah, a dedicated volunteer, organized a beach cleanup that removed over 500 lbs of plastic waste, saving marine life and inspiring her community to adopt eco-friendly practices.",
      impact: "500+ lbs waste removed, 200+ volunteers joined"
    },
    {
      title: "Education Champion",
      story: "Michael volunteered to teach underprivileged children, helping 30 students improve their math scores by 40% and sparking a love for learning in their community.",
      impact: "30 students helped, 40% score improvement"
    },
    {
      title: "Health Camp Angel",
      story: "Priya, a medical student, organized health camps in rural areas, providing free checkups to over 150 villagers and raising awareness about preventive healthcare.",
      impact: "150+ villagers served, 3 health camps conducted"
    },
    {
      title: "Animal Shelter Savior",
      story: "James dedicated weekends to the local animal shelter, helping care for abandoned pets and finding loving homes for 25 animals in just 6 months.",
      impact: "25 animals adopted, 100+ hours volunteered"
    },
    {
      title: "Community Garden Leader",
      story: "Emma transformed an empty lot into a thriving community garden, providing fresh vegetables to 50 families and teaching children about sustainable agriculture.",
      impact: "50 families fed, 1 community garden created"
    },
    {
      title: "Senior Companion",
      story: "Robert visited elderly residents weekly, providing companionship and assistance, reducing loneliness and improving the quality of life for 15 seniors.",
      impact: "15 seniors helped, weekly companionship provided"
    }
  ]

  const generateRandomStory = () => {
    const randomIndex = Math.floor(Math.random() * successStories.length)
    setRandomStory(successStories[randomIndex])
  }

  const footerLinks = {
    'Quick Links': [
      { name: 'About Us', path: '/about' },
      { name: 'Events', path: '/events' },
      { name: 'FAQs', path: '#', action: () => setShowFAQs(!showFAQs) },
    ],
    'For Volunteers': [
      { name: 'Find Events', path: '/events' },
      { name: 'Success Stories', path: '#', action: generateRandomStory },
      { name: 'Login as Volunteer', path: '/volunteer-login' },
    ],
    'For NGOs': [
      { name: 'Post an Event', path: '/ngo-login' },
      { name: 'NGO Resources', path: '/ngo-login' },
      { name: 'NGO Login', path: '/ngo-login' },
    ],
  }

  const faqs = [
    {
      question: 'How do I sign up as a volunteer?',
      answer: 'Simply create an account, browse events, and click "Apply" on any event that interests you.'
    },
    {
      question: 'Is there a minimum age requirement?',
      answer: 'Most events require volunteers to be at least 16 years old, but some family-friendly events welcome younger participants.'
    },
    {
      question: 'Can I volunteer for multiple events?',
      answer: 'Absolutely! You can apply for as many events as you like, as long as the dates don\'t conflict.'
    },
    {
      question: 'How do NGOs post events?',
      answer: 'NGOs can register for an account and post events through our dashboard. Events are reviewed before publication.'
    },
    {
      question: 'Is there a cost to participate?',
      answer: 'Most volunteer opportunities are free. Some events may have small fees for materials or training.'
    }
  ]

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
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
                    {link.action ? (
                      <button
                        onClick={link.action}
                        className="text-earth-300 hover:text-primary-300 transition-colors text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-earth-300 hover:text-primary-300 transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Success Story Section */}
        {randomStory && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FaQuestionCircle className="w-5 h-5 text-primary-300" />
                <h3 className="text-xl font-semibold">Success Story</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateRandomStory}
                  className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors"
                >
                  New Story
                </button>
                <button
                  onClick={() => setRandomStory(null)}
                  className="p-2 hover:bg-earth-800 rounded-lg transition-colors"
                >
                  <FaChevronUp className="w-4 h-4 text-earth-400" />
                </button>
              </div>
            </div>
            <div className="bg-earth-800 rounded-lg p-6 max-w-2xl mx-auto">
              <h4 className="text-xl font-bold text-primary-300 mb-3">{randomStory.title}</h4>
              <p className="text-earth-300 mb-4 leading-relaxed">{randomStory.story}</p>
              <div className="pt-4 border-t border-earth-700">
                <span className="inline-block px-3 py-1 bg-primary-600 bg-opacity-20 text-primary-300 rounded-full text-sm font-medium">
                  Impact: {randomStory.impact}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {showFAQs && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FaQuestionCircle className="w-5 h-5 text-primary-300" />
                <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
              </div>
              <button
                onClick={() => setShowFAQs(false)}
                className="p-2 hover:bg-earth-800 rounded-lg transition-colors"
              >
                <FaChevronUp className="w-4 h-4 text-earth-400" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-earth-800 rounded-lg p-4 hover:bg-earth-700 transition-colors">
                  <h4 className="font-medium text-primary-300 mb-2">{faq.question}</h4>
                  <p className="text-earth-300 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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