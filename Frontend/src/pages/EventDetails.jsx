import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HiCalendar, 
  HiLocationMarker, 
  HiUserGroup, 
  HiClock,
  HiShare,
  HiBookmark,
  HiCheckCircle,
  HiOutlineBookmark
} from 'react-icons/hi'
import { FaHandsHelping } from 'react-icons/fa'
import { format } from 'date-fns'
import EventCard from '../components/EventCard'

const EventDetails = () => {
  const { id } = useParams()
  const [isSaved, setIsSaved] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')

  // Sample event data (in real app, fetch based on id)
  const event = {
    _id: id,
    title: 'Beach Cleanup Drive',
    description: 'Join us in cleaning the local beach and protecting marine life. We need enthusiastic volunteers to help collect waste and sort recyclables. This event is part of our monthly initiative to keep our beaches clean and raise awareness about marine pollution.',
    longDescription: `
      <p>Join Ocean Conservation Society for our monthly beach cleanup event at Miami Beach. This is a great opportunity to make a tangible difference in protecting our marine environment while meeting like-minded individuals passionate about conservation.</p>
      
      <h4>What to expect:</h4>
      <ul>
        <li>Cleanup equipment (gloves, bags, pickers) will be provided</li>
        <li>Brief orientation on safety and waste sorting</li>
        <li>2-hour cleanup session</li>
        <li>Refreshments and snacks provided</li>
        <li>Certificate of participation for volunteers</li>
      </ul>
      
      <h4>Impact:</h4>
      <p>Last month, our volunteers collected over 500 lbs of waste from this beach, preventing it from entering the ocean and harming marine life. Your participation directly contributes to cleaner beaches and healthier oceans.</p>
    `,
    date: '2024-04-15',
    time: '09:00 AM - 12:00 PM',
    category: 'Environment',
    organization: {
      name: 'Ocean Conservation Society',
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      eventsCount: 45,
      joinedDate: '2019',
    },
    skillsRequired: ['Teamwork', 'Physical Fitness', 'Environmental Awareness', 'Waste Sorting'],
    volunteers: [
      { id: 1, name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108777-296fd5c7c9b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 2, name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
      { id: 3, name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    ],
    maxVolunteers: 50,
    currentVolunteers: 32,
    location: {
      address: 'Miami Beach, FL 33139',
      coordinates: { lat: 25.7907, lng: -80.1300 },
    },
    requirements: [
      'Must be at least 18 years old',
      'Comfortable working outdoors',
      'Able to lift up to 20 lbs',
      'Wear closed-toe shoes and comfortable clothing',
    ],
    benefits: [
      'Certificate of participation',
      'Community service hours',
      'Free refreshments',
      'Networking with environmental enthusiasts',
    ],
    images: [
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621451537084-482c73073a0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611288870312-2a1d5f6b99b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
  }

  // Similar events
  const similarEvents = [
    {
      _id: '2',
      title: 'Teaching Workshop',
      description: 'Help underprivileged children with their studies.',
      date: '2024-04-20',
      category: 'Education',
      skillsRequired: ['Teaching', 'Patience'],
      volunteers: [1, 2],
      maxVolunteers: 20,
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '3',
      title: 'Health Camp',
      description: 'Medical camp for rural communities.',
      date: '2024-04-25',
      category: 'Healthcare',
      skillsRequired: ['Medical Knowledge', 'First Aid'],
      volunteers: [1],
      maxVolunteers: 30,
      image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
  ]

  const handleApply = (e) => {
    e.preventDefault()
    console.log('Application submitted:', applicationMessage)
    setShowApplicationForm(false)
    // Show success toast
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 lg:col-span-1">
              <img
                src={event.images[0]}
                alt={event.title}
                className="w-full h-96 object-cover rounded-2xl"
              />
            </div>
            <div className="hidden lg:block space-y-4">
              <img
                src={event.images[1]}
                alt={event.title}
                className="w-full h-44 object-cover rounded-2xl"
              />
              <img
                src={event.images[2]}
                alt={event.title}
                className="w-full h-44 object-cover rounded-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-3">
                    {event.category}
                  </span>
                  <h1 className="text-3xl font-display font-bold text-earth-900">
                    {event.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="p-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors"
                  >
                    {isSaved ? (
                      <HiBookmark className="w-5 h-5 text-primary-600" />
                    ) : (
                      <HiOutlineBookmark className="w-5 h-5 text-earth-600" />
                    )}
                  </button>
                  <button className="p-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors">
                    <HiShare className="w-5 h-5 text-earth-600" />
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-earth-200">
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiCalendar className="w-4 h-4 mr-1" />
                    <span className="text-xs">Date</span>
                  </div>
                  <div className="font-medium text-earth-900">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiClock className="w-4 h-4 mr-1" />
                    <span className="text-xs">Time</span>
                  </div>
                  <div className="font-medium text-earth-900">{event.time}</div>
                </div>
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiLocationMarker className="w-4 h-4 mr-1" />
                    <span className="text-xs">Location</span>
                  </div>
                  <div className="font-medium text-earth-900">Miami Beach</div>
                </div>
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiUserGroup className="w-4 h-4 mr-1" />
                    <span className="text-xs">Spots Left</span>
                  </div>
                  <div className="font-medium text-earth-900">
                    {event.maxVolunteers - event.currentVolunteers} / {event.maxVolunteers}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-display font-semibold text-earth-900 mb-4">
                About This Event
              </h2>
              <div 
                className="prose max-w-none text-earth-600"
                dangerouslySetInnerHTML={{ __html: event.longDescription }}
              />
            </motion.div>

            {/* Skills Required */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-display font-semibold text-earth-900 mb-4">
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-earth-100 text-earth-700 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Requirements & Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-earth-600">
                      <HiCheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {event.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-earth-600">
                      <HiCheckCircle className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Current Volunteers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-display font-semibold text-earth-900 mb-4">
                Current Volunteers ({event.volunteers.length})
              </h2>
              <div className="flex flex-wrap gap-4">
                {event.volunteers.map((volunteer) => (
                  <div key={volunteer.id} className="text-center">
                    <img
                      src={volunteer.avatar}
                      alt={volunteer.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
                    />
                    <p className="text-sm text-earth-600 mt-1">{volunteer.name.split(' ')[0]}</p>
                  </div>
                ))}
                {event.volunteers.length < event.maxVolunteers && (
                  <div className="w-16 h-16 rounded-full bg-earth-100 flex items-center justify-center text-earth-500">
                    +{event.maxVolunteers - event.volunteers.length}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Apply & Organization Info */}
          <div className="space-y-6">
            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-earth-900 mb-1">
                  {event.maxVolunteers - event.currentVolunteers}
                </div>
                <div className="text-earth-600">spots remaining</div>
              </div>

              {!showApplicationForm ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 mb-4"
                >
                  Apply as Volunteer
                </button>
              ) : (
                <form onSubmit={handleApply} className="space-y-4 mb-4">
                  <textarea
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Tell us why you'd like to volunteer for this event..."
                    rows="4"
                    className="w-full px-4 py-3 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-4 py-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <p className="text-xs text-center text-earth-500">
                By applying, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>

            {/* Organization Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={event.organization.logo}
                  alt={event.organization.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-display font-semibold text-earth-900">
                    {event.organization.name}
                  </h3>
                  <div className="flex items-center text-sm text-earth-600 mt-1">
                    <span>⭐ {event.organization.rating}</span>
                    <span className="mx-2">•</span>
                    <span>{event.organization.eventsCount}+ events</span>
                  </div>
                </div>
              </div>
              <button className="w-full px-4 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                View Organization Profile
              </button>
            </motion.div>

            {/* Location Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-display font-semibold text-earth-900 mb-4">Location</h3>
              <div className="aspect-video bg-earth-200 rounded-lg mb-3 flex items-center justify-center text-earth-500">
                Map Preview - {event.location.address}
              </div>
              <p className="text-earth-600 text-sm">{event.location.address}</p>
            </motion.div>
          </div>
        </div>

        {/* Similar Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-display font-bold text-earth-900 mb-6">
            Similar Events You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EventDetails