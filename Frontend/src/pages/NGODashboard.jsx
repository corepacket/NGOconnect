import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiCalendar,
  HiUserGroup,
  HiLocationMarker,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiLogout,
  HiPlus,
} from 'react-icons/hi'
import { useAuth } from '../auth/AuthContext'
import toast from 'react-hot-toast'

const NGODashboard = () => {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const ngo = auth?.user ?? {
    name: 'Ocean Conservation Society',
    email: 'contact@oceanconservation.org',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    eventsCount: 12,
    totalVolunteers: 245,
    pendingApplications: 8,
  }

  const myEvents = [
    {
      id: 1,
      title: 'Beach Cleanup Drive',
      date: '2024-04-15',
      volunteers: 32,
      maxVolunteers: 50,
      status: 'active',
      location: 'Miami Beach, FL',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Teaching Workshop',
      date: '2024-04-20',
      volunteers: 18,
      maxVolunteers: 20,
      status: 'active',
      location: 'Community Center, Austin',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Health Camp 2024',
      date: '2024-03-10',
      volunteers: 30,
      maxVolunteers: 30,
      status: 'completed',
      location: 'Rural Health Center',
      image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ]

  const applications = [
    { id: 1, volunteerName: 'Sarah Johnson', eventTitle: 'Beach Cleanup Drive', status: 'pending', appliedAt: '2024-04-10' },
    { id: 2, volunteerName: 'Michael Chen', eventTitle: 'Beach Cleanup Drive', status: 'pending', appliedAt: '2024-04-09' },
    { id: 3, volunteerName: 'Priya Patel', eventTitle: 'Teaching Workshop', status: 'approved', appliedAt: '2024-04-08' },
    { id: 4, volunteerName: 'James Wilson', eventTitle: 'Beach Cleanup Drive', status: 'rejected', appliedAt: '2024-04-07' },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-earth-900">
              NGO Dashboard
            </h1>
            <p className="text-earth-600 mt-2">{ngo.name} – Manage your events and volunteers</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-earth-200 rounded-lg text-earth-600 hover:bg-earth-50 hover:text-earth-900 transition-colors"
          >
            <HiLogout className="w-5 h-5" />
            Log out
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={ngo.logo}
              alt={ngo.name}
              className="w-24 h-24 rounded-xl object-cover border-4 border-primary-100"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-display font-semibold text-earth-900 mb-2">{ngo.name}</h2>
              <p className="text-earth-600">{ngo.email}</p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <HiPlus className="w-5 h-5" />
              Post New Event
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <HiCalendar />, label: 'Events Posted', value: ngo.eventsCount ?? 12, color: 'bg-blue-500' },
            { icon: <HiUserGroup />, label: 'Total Volunteers', value: ngo.totalVolunteers ?? 245, color: 'bg-green-500' },
            { icon: <HiClock />, label: 'Pending Applications', value: ngo.pendingApplications ?? 8, color: 'bg-yellow-500' },
            { icon: <HiCheckCircle />, label: 'Completed Events', value: '5', color: 'bg-purple-500' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className={`inline-block p-3 ${stat.color} bg-opacity-10 rounded-lg mb-4`}>
                <div className="text-2xl">{stat.icon}</div>
              </div>
              <div className="text-2xl font-bold text-earth-900 mb-1">{stat.value}</div>
              <div className="text-earth-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mb-6 border-b border-earth-200">
          <nav className="flex space-x-8">
            {['overview', 'events', 'applications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 capitalize font-medium transition-colors relative ${
                  activeTab === tab ? 'text-primary-600' : 'text-earth-500 hover:text-earth-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="ngoTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Your Active Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myEvents
                    .filter((e) => e.status === 'active')
                    .map((event) => (
                      <div key={event.id} className="p-4 border border-earth-200 rounded-xl hover:shadow-md transition-shadow">
                        <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                        <h4 className="font-semibold text-earth-900 mb-1">{event.title}</h4>
                        <div className="flex items-center text-sm text-earth-500 mb-2">
                          <HiCalendar className="w-4 h-4 mr-1" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-earth-600 mb-2">
                          <HiLocationMarker className="w-4 h-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                        <div className="text-sm text-earth-600">
                          {event.volunteers} / {event.maxVolunteers} volunteers
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Recent Volunteer Applications</h3>
                <div className="space-y-3">
                  {applications.filter((a) => a.status === 'pending').slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-earth-50 rounded-xl">
                      <div>
                        <p className="font-medium text-earth-900">{app.volunteerName}</p>
                        <p className="text-sm text-earth-600">{app.eventTitle}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">Approve</button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">All Your Events</h3>
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 bg-earth-50 rounded-xl">
                    <img src={event.image} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-earth-900">{event.title}</h4>
                      <div className="flex items-center text-sm text-earth-500 mt-1">
                        <HiCalendar className="w-4 h-4 mr-1" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <HiLocationMarker className="w-4 h-4 ml-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                      <p className="text-sm text-earth-600 mt-1">
                        {event.volunteers} / {event.maxVolunteers} volunteers
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {event.status}
                    </span>
                    <button className="px-4 py-2 border border-earth-200 rounded-lg text-sm hover:bg-earth-50">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Volunteer Applications</h3>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-earth-50 rounded-xl">
                    <div>
                      <p className="font-medium text-earth-900">{app.volunteerName}</p>
                      <p className="text-sm text-earth-600">{app.eventTitle}</p>
                      <p className="text-xs text-earth-500 mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : app.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {app.status}
                    </span>
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200">
                          <HiCheckCircle className="w-4 h-4 inline" />
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
                          <HiXCircle className="w-4 h-4 inline" />
                        </button>
                      </div>
                    )}
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

export default NGODashboard
