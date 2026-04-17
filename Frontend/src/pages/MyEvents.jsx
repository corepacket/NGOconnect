import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiCalendar, HiUserGroup, HiLocationMarker, HiClock, HiHeart, HiX, HiArrowLeft } from 'react-icons/hi'
import { getSavedEvents, unsaveEvent, getRegisteredEvents } from '../service/user.service'
import { useAuth } from '../auth/AuthContext'
import toast from 'react-hot-toast'
import { normalizeEvents } from '../lib/event-utils'

const MyEvents = () => {
  const { tab } = useParams()
  const navigate = useNavigate()
  const { auth } = useAuth()
  
  const [activeTab, setActiveTab] = useState(tab || 'registered')
  const [savedEvents, setSavedEvents] = useState([])
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [unSaving, setUnSaving] = useState(null)

  useEffect(() => {
    setActiveTab(tab || 'registered')
  }, [tab])

  useEffect(() => {
    if (activeTab === 'saved') {
      loadSavedEvents()
    } else if (activeTab === 'registered') {
      loadRegisteredEvents()
    }
  }, [activeTab])

  const loadSavedEvents = async () => {
    try {
      setLoading(true)
      const data = await getSavedEvents()
      setSavedEvents(normalizeEvents(data.events || []))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load saved events')
      setSavedEvents([])
    } finally {
      setLoading(false)
    }
  }

  const loadRegisteredEvents = async () => {
    try {
      setLoading(true)
      const data = await getRegisteredEvents()
      console.log('Registered events data:', data)
      console.log('Normalized events:', normalizeEvents(data.events || []))
      setRegisteredEvents(normalizeEvents(data.events || []))
    } catch (err) {
      console.error('Error loading registered events:', err)
      toast.error(err.response?.data?.message || 'Failed to load registered events')
      setRegisteredEvents([])
    } finally {
      setLoading(false)
    }
  }

  const handleUnsaveEvent = async (eventId) => {
    try {
      setUnSaving(eventId)
      await unsaveEvent(eventId)
      toast.success('Event removed from saved events')
      setSavedEvents(prev => prev.filter(event => event._id !== eventId))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unsave event')
    } finally {
      setUnSaving(null)
    }
  }

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    navigate(`/dashboard/volunteer/my-events/${newTab}`, { replace: false })
  }

  const user = {
    name: auth?.user?.fullname || 'Volunteer',
    avatar: auth?.user?.profilePic || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
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
          <button
            onClick={() => navigate('/dashboard/volunteer')}
            className="inline-flex items-center gap-2 text-earth-600 hover:text-primary-600 mb-6 text-sm font-medium"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-2">
            My Events
          </h1>
          <p className="text-earth-600">Manage your volunteer activities and saved opportunities</p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 border-b border-earth-200">
          <nav className="flex space-x-8">
            {['registered', 'saved', 'history'].map((tabName) => (
              <button
                key={tabName}
                onClick={() => handleTabChange(tabName)}
                className={`pb-4 px-1 capitalize font-medium transition-colors relative ${
                  activeTab === tabName ? 'text-primary-600' : 'text-earth-500 hover:text-earth-700'
                }`}
              >
                {tabName}
                {activeTab === tabName && (
                  <motion.div layoutId="myEventsTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Saved Events</h3>
                
                {loading ? (
                  <div className="text-sm text-earth-500 py-8 text-center">Loading saved events...</div>
                ) : savedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedEvents.map((event) => (
                      <div key={event._id} className="bg-white border border-earth-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <img 
                          src={event.image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'200\' viewBox=\'0 0 400 200\'%3E%3Crect fill=\'%23f3f4f6\' width=\'400\' height=\'200\'/%3E%3Ctext fill=\'%236b7280\' font-family=\'Arial\' font-size=\'16\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EEvent Image%3C/text%3E%3C/svg%3E'} 
                          alt={event.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-earth-900 mb-2">{event.title}</h4>
                          <p className="text-sm text-earth-600 mb-3 line-clamp-2">{event.description}</p>
                          
                          <div className="space-y-2 text-sm text-earth-600 mb-4">
                            <div className="flex items-center">
                              <HiCalendar className="w-4 h-4 mr-2 text-primary-600" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <HiLocationMarker className="w-4 h-4 mr-2 text-primary-600" />
                              <span className="truncate">{event.location?.address || 'Location TBD'}</span>
                            </div>
                            <div className="flex items-center">
                              <HiUserGroup className="w-4 h-4 mr-2 text-primary-600" />
                              <span>{event.currentVolunteers || 0} / {event.maxVolunteers} volunteers</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/events/${event._id}`)}
                              className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
                            >
                              View Event
                            </button>
                            <button
                              onClick={() => handleUnsaveEvent(event._id)}
                              disabled={unSaving === event._id}
                              className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors disabled:opacity-70"
                            >
                              {unSaving === event._id ? 'Removing...' : 'Remove'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 rounded-xl border border-dashed border-earth-200 bg-earth-50/80">
                    <HiHeart className="w-12 h-12 text-earth-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-earth-900 mb-2">No saved events yet</h3>
                    <p className="text-earth-600 mb-4">Start exploring and save events that interest you!</p>
                    <button
                      onClick={() => navigate('/events')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700"
                    >
                      Explore Events
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'registered' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Registered Events</h3>
                
                {loading ? (
                  <div className="text-sm text-earth-500 py-8 text-center">Loading registered events...</div>
                ) : registeredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredEvents.map((event) => (
                      <div key={event._id} className="bg-white border border-earth-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <img 
                          src={event.image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'200\' viewBox=\'0 0 400 200\'%3E%3Crect fill=\'%23f3f4f6\' width=\'400\' height=\'200\'/%3E%3Ctext fill=\'%236b7280\' font-family=\'Arial\' font-size=\'16\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EEvent Image%3C/text%3E%3C/svg%3E'} 
                          alt={event.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-earth-900 mb-2">{event.title}</h4>
                          <p className="text-sm text-earth-600 mb-3 line-clamp-2">{event.description}</p>
                          
                          <div className="space-y-2 text-sm text-earth-600 mb-4">
                            <div className="flex items-center">
                              <HiCalendar className="w-4 h-4 mr-2 text-primary-600" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <HiLocationMarker className="w-4 h-4 mr-2 text-primary-600" />
                              <span className="truncate">{event.location?.address || 'Location TBD'}</span>
                            </div>
                            <div className="flex items-center">
                              <HiUserGroup className="w-4 h-4 mr-2 text-primary-600" />
                              <span>{event.currentVolunteers || 0} / {event.maxVolunteers} volunteers</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/events/${event._id}`)}
                              className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
                            >
                              View Event
                            </button>
                            <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                              event.registrationStatus === 'approved' 
                                ? 'bg-green-100 text-green-700' 
                                : event.registrationStatus === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {event.registrationStatus === 'approved' 
                                ? 'Approved' 
                                : event.registrationStatus === 'rejected'
                                ? 'Rejected'
                                : 'Pending'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 rounded-xl border border-dashed border-earth-200 bg-earth-50/80">
                    <HiCalendar className="w-12 h-12 text-earth-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-earth-900 mb-2">No registered events yet</h3>
                    <p className="text-earth-600 mb-4">Apply to events to track your volunteer activities!</p>
                    <button
                      onClick={() => navigate('/events')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700"
                    >
                      Find Events
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Event History</h3>
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-earth-200 bg-earth-50/80">
                  <HiClock className="w-12 h-12 text-earth-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-earth-900 mb-2">No past events yet</h3>
                  <p className="text-earth-600 mb-4">Your completed volunteer activities will appear here!</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default MyEvents
