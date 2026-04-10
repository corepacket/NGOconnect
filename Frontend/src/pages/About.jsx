import { motion } from 'framer-motion'
import { FaHandsHelping, FaGlobe, FaHeart, FaUsers, FaLeaf, FaGraduationCap, FaAward, FaRocket, FaShieldAlt, FaLightbulb, FaHandshake } from 'react-icons/fa'
import { HiUserGroup, HiSparkles, HiClock, HiLocationMarker } from 'react-icons/hi'

const About = () => {
  const milestones = [
    { year: '2020', title: 'NGOConnect Founded', description: 'Started with a vision to connect volunteers with meaningful causes' },
    { year: '2021', title: 'First 100 NGOs', description: 'Expanded our network to include diverse organizations across sectors' },
    { year: '2022', title: 'Mobile App Launch', description: 'Made volunteering accessible on-the-go with our mobile application' },
    { year: '2023', title: '50K Volunteers', description: 'Reached a milestone of 50,000 registered volunteers' },
    { year: '2024', title: 'Global Expansion', description: 'Extended our reach to 25+ countries worldwide' },
  ]

  const features = [
    {
      icon: <FaRocket className="w-8 h-8 text-primary-600" />,
      title: 'Smart Matching',
      description: 'AI-powered algorithm connects volunteers with opportunities that match their skills and interests',
      bg: 'from-blue-50 to-indigo-50'
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-green-600" />,
      title: 'Verified Organizations',
      description: 'All NGOs undergo thorough verification to ensure legitimacy and safety',
      bg: 'from-green-50 to-emerald-50'
    },
    {
      icon: <FaLightbulb className="w-8 h-8 text-yellow-600" />,
      title: 'Impact Tracking',
      description: 'Real-time analytics and reporting to measure and showcase your contribution',
      bg: 'from-yellow-50 to-orange-50'
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-purple-600" />,
      title: 'Community Building',
      description: 'Connect with like-minded volunteers and build lasting relationships',
      bg: 'from-purple-50 to-pink-50'
    },
  ]

  const impact = [
    { number: '75,000+', label: 'Volunteers Connected', icon: <HiUserGroup /> },
    { number: '2,500+', label: 'Partner NGOs', icon: <FaHandsHelping /> },
    { number: '15,000+', label: 'Events Completed', icon: <HiSparkles /> },
    { number: '500K+', label: 'Lives Impacted', icon: <FaHeart /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-primary-50 pt-24 pb-16">
      {/* Hero Section - Modern Split Design */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold text-earth-900 mb-6 leading-tight">
                Connecting <span className="text-primary-600">Passion</span> with <span className="text-secondary-600">Purpose</span>
              </h1>
              <p className="text-xl text-earth-600 mb-8 leading-relaxed">
                NGOConnect is the revolutionary platform that bridges the gap between dedicated volunteers 
                and impactful NGOs, creating meaningful change through technology-driven connections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  Start Volunteering
                </button>
                <button className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-xl font-semibold hover:bg-primary-50 transform hover:scale-105 transition-all duration-200">
                  Partner With Us
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-2xl transform rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1593115057324-ae2e1bad5360?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Volunteers working together"
                  className="relative rounded-2xl shadow-2xl w-full h-64 md:h-80 object-cover transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Statistics - Modern Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-4">
              Our <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Impact</span>
            </h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Numbers that tell our story of creating meaningful change
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impact.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-earth-100"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mb-6 mx-auto">
                  <div className="text-2xl text-primary-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-earth-900 mb-2">{stat.number}</div>
                <div className="text-earth-600 text-center">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-4">
              Why Choose <span className="text-primary-600">NGOConnect</span>
            </h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Innovative features designed to maximize your volunteering experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${feature.bg} rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-white`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-earth-900">{feature.title}</h3>
                </div>
                <p className="text-earth-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-4">
              Our <span className="text-primary-600">Journey</span>
            </h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Key milestones that shaped our mission
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-200 to-secondary-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg font-bold mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-earth-900 mb-2">{milestone.title}</h3>
                    <p className="text-earth-600">{milestone.description}</p>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of volunteers and NGOs creating positive change in communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="px-10 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                Get Started Now
              </button>
              <div className="text-white/80">
                <HiClock className="inline-block w-5 h-5 mr-2" />
                Less than 2 minutes to sign up
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About