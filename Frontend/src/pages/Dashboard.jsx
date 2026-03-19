import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HiCalendar, 
  HiUserGroup, 
  HiHeart, 
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiLocationMarker,
  HiUser,
  HiMail,
  HiPhone
} from 'react-icons/hi'
import { FaHandsHelping } from 'react-icons/fa'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // Sample user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    memberSince: 'January 2024',
    totalHours: 48,
    eventsAttended: 12,
  }

  // Sample registered events
  const registeredEvents = [
    {
      id: 1,
      title: 'Beach Cleanup Drive',
      date: '2024-04-15',
      status: 'approved',
      organization: 'Ocean Conservation Society',
      location: 'Miami Beach, FL',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Teaching Workshop',
      date: '2024-04-20',
      status: 'pending',
      organization: 'Education For All',
      location: 'Community Center, Austin',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Health Camp',
      date: '2024-04-25',
      status: 'completed',
      organization: 'Rural Health Initiative',
      location: 'Rural Health Center',
      image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
  ]

  // Sample saved events
  const savedEvents = [
    {
      id: 4,
      title: 'Animal Shelter Support',
      organization: 'City Animal Shelter',
      date: '2024-05-01',
      location: 'City Animal Shelter',
    },
    {
      id: 5,
      title: 'Food Distribution Drive',
      organization: 'Community Food Bank',
      date: '2024-05-05',
      location: 'Downtown Community Center',
    },
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <HiCheckCircle className="w-4 h-4" />
      case 'pending': return <HiClock className="w-4 h-4" />
      case 'rejected': return <HiXCircle className="w-4 h-4" />
      case 'completed': return <HiCheckCircle className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-earth-900">
            Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>!
          </h1>
          <p className="text-earth-600 mt-2">Manage your volunteer activities and track your impact</p>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-display font-semibold text-earth-900 mb-2">
                {user.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-earth-600">
                  <HiMail className="w-5 h-5 mr-2 text-primary-600" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-earth-600">
                  <HiPhone className="w-5 h-5 mr-2 text-primary-600" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-earth-600">
                  <HiClock className="w-5 h-5 mr-2 text-primary-600" />
                  <span>Member since {user.memberSince}</span>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <HiCalendar />, label: 'Events Attended', value: user.eventsAttended, color: 'bg-blue-500' },
            { icon: <HiClock />, label: 'Volunteer Hours', value: user.totalHours, color: 'bg-green-500' },
            { icon: <HiUserGroup />, label: 'NGOs Connected', value: '8', color: 'bg-purple-500' },
            { icon: <HiHeart />, label: 'Impact Score', value: 'A+', color: 'bg-red-500' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className={`inline-block p-3 ${stat.color} bg-opacity-10 rounded-lg text-${stat.color.replace('bg-', '')} mb-4`}>
                <div className="text-2xl">{stat.icon}</div>
              </div>
              <div className="text-2xl font-bold text-earth-900 mb-1">{stat.value}</div>
              <div className="text-earth-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-earth-200">
          <nav className="flex space-x-8">
            {['overview', 'registered', 'saved', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 capitalize font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-primary-600'
                    : 'text-earth-500 hover:text-earth-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  {registeredEvents
                    .filter(e => e.status === 'approved' || e.status === 'pending')
                    .map((event) => (
                      <div key={event.id} className="flex items-center gap-4 p-4 bg-earth-50 rounded-xl">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-earth-900">{event.title}</h4>
                          <p className="text-sm text-earth-600">{event.organization}</p>
                          <div className="flex items-center text-sm text-earth-500 mt-1">
                            <HiCalendar className="w-4 h-4 mr-1" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <HiLocationMarker className="w-4 h-4 ml-3 mr-1" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                          <span className="capitalize">{event.status}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recommended Events */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">
                  Recommended for You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedEvents.map((event) => (
                    <div key={event.id} className="p-4 border border-earth-200 rounded-xl hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-earth-900 mb-1">{event.title}</h4>
                      <p className="text-sm text-earth-600 mb-2">{event.organization}</p>
                      <div className="flex items-center text-sm text-earth-500">
                        <HiCalendar className="w-4 h-4 mr-1" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <HiLocationMarker className="w-4 h-4 ml-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'registered' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">
                My Registered Events
              </h3>
              <div className="space-y-4">
                {registeredEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 bg-earth-50 rounded-xl">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-earth-900">{event.title}</h4>
                      <p className="text-sm text-earth-600 mb-2">{event.organization}</p>
                      <div className="flex items-center text-sm text-earth-500">
                        <HiCalendar className="w-4 h-4 mr-1" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <HiLocationMarker className="w-4 h-4 ml-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                      <span className="capitalize">{event.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">
                Saved Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedEvents.map((event) => (
                  <div key={event.id} className="p-4 border border-earth-200 rounded-xl hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-earth-900 mb-1">{event.title}</h4>
                    <p className="text-sm text-earth-600 mb-2">{event.organization}</p>
                    <div className="flex items-center text-sm text-earth-500 mb-3">
                      <HiCalendar className="w-4 h-4 mr-1" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <HiLocationMarker className="w-4 h-4 ml-3 mr-1" />
                      <span>{event.location}</span>
                    </div>
                    <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                      Register Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">
                Volunteer History
              </h3>
              <div className="space-y-4">
                {registeredEvents
                  .filter(e => e.status === 'completed')
                  .map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 bg-earth-50 rounded-xl">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-earth-900">{event.title}</h4>
                        <p className="text-sm text-earth-600 mb-2">{event.organization}</p>
                        <div className="flex items-center text-sm text-earth-500">
                          <HiCalendar className="w-4 h-4 mr-1" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <HiLocationMarker className="w-4 h-4 ml-3 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-earth-900">4 hours</div>
                        <div className="text-xs text-earth-500">volunteered</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard