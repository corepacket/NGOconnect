import { motion } from 'framer-motion'
import { FaHandsHelping, FaGlobe, FaHeart, FaUsers, FaLeaf, FaGraduationCap, FaAward } from 'react-icons/fa'
import { HiUserGroup, HiSparkles } from 'react-icons/hi'

const About = () => {
  const stats = [
    { value: '500+', label: 'Active NGOs', icon: <FaHandsHelping /> },
    { value: '50+', label: 'Cities', icon: <FaGlobe /> },
    { value: '1000+', label: 'Events Completed', icon: <HiSparkles /> },
    { value: '50K+', label: 'Lives Impacted', icon: <FaAward /> },
  ]

  const values = [
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: 'Compassion',
      description: 'We believe in the power of empathy and kindness to create meaningful change in communities.',
    },
    {
      icon: <FaHandsHelping className="w-8 h-8" />,
      title: 'Collaboration',
      description: 'Working together with NGOs and volunteers to maximize impact and reach.',
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: 'Sustainability',
      description: 'Creating lasting solutions that continue to benefit communities long-term.',
    },
    {
      icon: <FaGraduationCap className="w-8 h-8" />,
      title: 'Empowerment',
      description: 'Equipping volunteers and communities with skills and resources for self-sufficiency.',
    },
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108777-296fd5c7c9b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Former UN volunteer with 15 years of experience in nonprofit management.',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Partnerships',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Building bridges between NGOs and corporations for sustainable impact.',
    },
    {
      name: 'Priya Patel',
      role: 'Community Manager',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Passionate about connecting volunteers with causes they care about.',
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594708767771-a7502209ff51?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 to-secondary-900/95" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              About <span className="text-primary-300">NGOConnect</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              We're on a mission to revolutionize how volunteers connect with NGOs,
              making it easier than ever to create positive social impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl text-primary-600 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-earth-900 mb-1">{stat.value}</div>
                <div className="text-earth-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-4">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-earth-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-earth-50 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="inline-block p-4 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full text-primary-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-earth-900 mb-2">{value.title}</h3>
                <p className="text-earth-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Whether you're a volunteer looking to make a difference or an NGO seeking passionate helpers, 
              we're here to help you create impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
                Sign Up as Volunteer
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-200">
                Register Your NGO
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About