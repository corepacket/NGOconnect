import { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaHandsHelping, FaLeaf, FaHeart, FaUsers } from 'react-icons/fa'
import toast from 'react-hot-toast'
import EventCard from '../components/EventCard'
import { fetchEvents } from '../service/event.service'
import { normalizeEvents } from '../lib/event-utils'

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedEvents = async () => {
      try {
        const data = await fetchEvents()
        setFeaturedEvents(normalizeEvents(data).slice(0, 3))
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not load featured events')
      } finally {
        setEventsLoading(false)
      }
    }

    loadFeaturedEvents()
  }, [])

  const features = [
    {
      icon: <FaHandsHelping className="w-8 h-8" />,
      title: 'Connect with NGOs',
      description: 'Find and connect with verified NGOs working for causes you care about.',
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: 'Make an Impact',
      description: 'Contribute to meaningful projects and see the difference you make.',
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: 'Build Community',
      description: 'Join a community of like-minded individuals passionate about change.',
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: 'Skill Development',
      description: 'Develop new skills while volunteering for various events.',
    },
  ]

  return (
    <div>
      <HeroSection />

      {/* Features Section */}
      <section className="section-padding hope-pattern">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-hope-600 to-compassion-600 bg-clip-text text-transparent">NGOConnect</span>?
            </h2>
            <p className="text-earth-600 max-w-2xl mx-auto">
              We bridge the gap between passionate volunteers and impactful NGOs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-hope-100"
              >
                <div className="inline-block p-3 bg-gradient-to-r from-hope-100 to-compassion-100 rounded-full text-hope-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-earth-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-earth-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="section-padding hope-pattern">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-4">
              Featured <span className="bg-gradient-to-r from-compassion-600 to-secondary-600 bg-clip-text text-transparent">Events</span>
            </h2>
            <p className="text-earth-600 max-w-2xl mx-auto">
              Discover upcoming volunteer opportunities that match your interests
            </p>
          </motion.div>

          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-52 bg-earth-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-earth-200 rounded w-1/3" />
                    <div className="h-6 bg-earth-200 rounded w-3/4" />
                    <div className="h-4 bg-earth-100 rounded w-full" />
                    <div className="h-4 bg-earth-100 rounded w-5/6" />
                    <div className="h-11 bg-earth-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-lg border border-earth-100 px-8 py-12">
              <h3 className="text-2xl font-display font-bold text-earth-900 mb-3">No featured events yet</h3>
              <p className="text-earth-600 mb-6">
                Seed a few demo events or let an NGO publish the first opportunity so volunteers see activity right away.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-hope-600 to-compassion-600 text-white rounded-lg font-semibold"
              >
                Browse event page
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-hope-600 to-compassion-600 text-white rounded-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-hope-900/90 via-compassion-900/85 to-secondary-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to Make a <span className="text-transparent bg-clip-text bg-gradient-to-r from-hope-300 to-compassion-300">Difference</span>?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of volunteers making an impact in their communities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-hope-600 rounded-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Sign Up as Volunteer
              </Link>
              <Link
                to="/register-ngo"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-200"
              >
                Register Your NGO
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home