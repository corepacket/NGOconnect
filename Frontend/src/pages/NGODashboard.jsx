import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { logoutNGO } from '../service/auth.service'
import{
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
import { approveRegistration, deleteEvent, fetchNgoApplications, fetchNgoEvents, rejectRegistration, updateEvent } from '../service/event.service'
import { updateNgoLogo as updateNgoLogoApi } from '../service/auth.service'
import { normalizeEvents } from '../lib/event-utils'

const NGODashboard = () => {
  const { auth, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [myEvents, setMyEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [actioning, setActioning] = useState({})
  const [logoUploading, setLogoUploading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchNgoEvents()
        if (!cancelled) setMyEvents(normalizeEvents(data))
      } catch {
        if (!cancelled) {
          setMyEvents([])
          toast.error('Could not load your events. Are you logged in?')
        }
      } finally {
        if (!cancelled) setEventsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchNgoApplications()
        const regs = Array.isArray(data?.registrations) ? data.registrations : []
        if (!cancelled) setApplications(regs)
      } catch {
        if (!cancelled) setApplications([])
      } finally {
        if (!cancelled) setApplicationsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const refreshApplications = async () => {
    const data = await fetchNgoApplications()
    setApplications(Array.isArray(data?.registrations) ? data.registrations : [])
  }
  const refreshMyEvents = async () => {
    const data = await fetchNgoEvents()
    setMyEvents(normalizeEvents(data))
  }

  const handleApprove = async (eventId, registrationId) => {
    const key = `${eventId}:${registrationId}`
    setActioning((p) => ({ ...p, [key]: true }))
    try {
      await approveRegistration(eventId, registrationId)
      toast.success('Approved')
      await refreshApplications()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve')
    } finally {
      setActioning((p) => ({ ...p, [key]: false }))
    }
  }

  const handleReject = async (eventId, registrationId) => {
    const key = `${eventId}:${registrationId}`
    setActioning((p) => ({ ...p, [key]: true }))
    try {
      await rejectRegistration(eventId, registrationId)
      toast.success('Rejected')
      await refreshApplications()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject')
    } finally {
      setActioning((p) => ({ ...p, [key]: false }))
    }
  }

  const mapEventRow = (event) => {
    const d = event.date ? new Date(event.date) : null
    const isPast = d && d < new Date(new Date().setHours(0, 0, 0, 0))
    return {
      id: event._id,
      _id: event._id,
      title: event.title,
      date: event.date,
      timings: event.timings,
      volunteers: Array.isArray(event.volunteers) ? event.volunteers.length : 0,
      maxVolunteers: event.maxVolunteers,
      status: isPast ? 'completed' : 'active',
      location: event.locationText || event.location?.address || 'Location TBD',
      image:
        event.image ||
        'https://images.unsplash.com/photo-1594708767771-a7502209ff51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    }
  }

  const ngo = auth?.user ?? {
    name: 'Ocean Conservation Society',
    email: 'contact@oceanconservation.org',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    eventsCount: 12,
    totalVolunteers: 245,
    pendingApplications: 8,
  }
  const ngoLogo =
    ngo.logo ||
    'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    try {
      const updatedNgo = await updateNgoLogoApi(file)
      updateUser(updatedNgo)
      toast.success('Logo updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update logo')
    } finally {
      setLogoUploading(false)
      e.target.value = ''
    }
  }

  const handleDeleteEvent = async (eventId) => {
    const ok = window.confirm('Delete this event? This action cannot be undone.')
    if (!ok) return
    try {
      await deleteEvent(eventId)
      toast.success('Event deleted')
      await refreshMyEvents()
      await refreshApplications()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event')
    }
  }

  const handleEditEvent = async (event) => {
    if (!event?._id) {
      toast.error('Event data not found')
      return
    }
    const title = window.prompt('Update title', event.title)
    if (title === null) return
    const location = window.prompt('Update location', event.locationText || event.location?.address || '')
    if (location === null) return
    const timings = window.prompt('Update time', event.timings || '')
    if (timings === null) return
    const maxVolunteers = window.prompt('Update max volunteers', String(event.maxVolunteers || ''))
    if (maxVolunteers === null) return

    const payload = new FormData()
    payload.append('title', title.trim())
    payload.append('location', location.trim())
    payload.append('timings', timings.trim())
    payload.append('maxVolunteers', String(Number(maxVolunteers)))

    try {
      await updateEvent(event._id, payload)
      toast.success('Event updated')
      await refreshMyEvents()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update event')
    }
  }

  const dashboardEvents = myEvents.map(mapEventRow)
  const pendingCount = applications.filter((a) => a.status === 'pending').length

  const handleLogout = async () => {
    try {
      await logoutNGO()
    } catch (err) {
      console.error('NGO logout request failed')
    }
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
              src={ngoLogo}
              alt={ngo.name}
              className="w-24 h-24 rounded-xl object-cover border-4 border-primary-100"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-display font-semibold text-earth-900 mb-2">{ngo.name}</h2>
              <p className="text-earth-600">{ngo.email}</p>
              <div className="mt-3">
                <label className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-earth-200 rounded-lg cursor-pointer hover:bg-earth-50">
                  <span>{logoUploading ? 'Uploading logo...' : 'Change logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={logoUploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <Link
              to="/events/new"
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
            { icon: <HiClock />, label: 'Pending Applications', value: pendingCount, color: 'bg-yellow-500' },
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
                {eventsLoading ? (
                  <p className="text-earth-500 text-sm py-8 text-center">Loading your events…</p>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardEvents
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
                  {dashboardEvents.filter((e) => e.status === 'active').length === 0 && (
                    <div className="col-span-full text-center py-10 px-4 rounded-xl border border-dashed border-earth-200 bg-earth-50/80">
                      <p className="text-earth-700 font-medium mb-1">No upcoming events yet</p>
                      <p className="text-earth-500 text-sm mb-4">Create an event so volunteers can find you on the listings page.</p>
                      <Link
                        to="/events/new"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700"
                      >
                        <HiPlus className="w-4 h-4" />
                        Post your first event
                      </Link>
                    </div>
                  )}
                </div>
                )}
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Recent Volunteer Applications</h3>
                <div className="space-y-3">
                  {applicationsLoading ? (
                    <div className="text-center py-8 text-earth-500 text-sm">Loading applications…</div>
                  ) : (
                    applications
                      .filter((a) => a.status === 'pending')
                      .slice(0, 3)
                      .map((app) => {
                        const key = `${app.event?._id}:${app._id}`
                        return (
                          <div key={app._id} className="flex items-center justify-between p-4 bg-earth-50 rounded-xl">
                            <div>
                              <p className="font-medium text-earth-900">{app.user?.fullname || 'Volunteer'}</p>
                              <p className="text-sm text-earth-600">{app.event?.title || 'Event'}</p>
                              <p className="text-xs text-earth-500 mt-1">{app.user?.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={actioning[key]}
                                onClick={() => handleApprove(app.event?._id, app._id)}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 disabled:opacity-60"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={actioning[key]}
                                onClick={() => handleReject(app.event?._id, app._id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 disabled:opacity-60"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )
                      })
                  )}
                  {!applicationsLoading && applications.filter((a) => a.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-earth-500 text-sm">No pending applications.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">All Your Events</h3>
              {eventsLoading ? (
                <p className="text-earth-500 text-sm py-8 text-center">Loading…</p>
              ) : (
              <div className="space-y-4">
                {dashboardEvents.map((event) => (
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
                    <button
                      type="button"
                      onClick={() => handleEditEvent(myEvents.find((e) => e._id === event.id))}
                      className="px-4 py-2 border border-earth-200 rounded-lg text-sm hover:bg-earth-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {dashboardEvents.length === 0 && (
                  <div className="text-center py-12 px-4 rounded-xl border border-dashed border-earth-200 bg-earth-50/80">
                    <p className="text-earth-700 font-medium mb-1">You have not posted any events</p>
                    <p className="text-earth-500 text-sm mb-4">Events you publish will show here and on the public volunteer page.</p>
                    <Link
                      to="/events/new"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg text-sm font-semibold"
                    >
                      <HiPlus className="w-4 h-4" />
                      Post an event
                    </Link>
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Volunteer Applications</h3>
              <div className="space-y-4">
                {applicationsLoading ? (
                  <div className="text-center py-10 text-earth-500 text-sm">Loading…</div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-10 text-earth-500 text-sm">No applications yet.</div>
                ) : (
                  applications.map((app) => {
                    const key = `${app.event?._id}:${app._id}`
                    return (
                      <div key={app._id} className="flex items-center justify-between p-4 bg-earth-50 rounded-xl gap-4">
                        <div className="min-w-0">
                          <p className="font-medium text-earth-900 truncate">{app.user?.fullname || 'Volunteer'}</p>
                          <p className="text-sm text-earth-600 truncate">{app.event?.title || 'Event'}</p>
                          <p className="text-xs text-earth-500 mt-1">
                            Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}
                            {app.user?.email ? ` • ${app.user.email}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
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
                              <button
                                type="button"
                                disabled={actioning[key]}
                                onClick={() => handleApprove(app.event?._id, app._id)}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 disabled:opacity-60"
                                title="Approve"
                              >
                                <HiCheckCircle className="w-4 h-4 inline" />
                              </button>
                              <button
                                type="button"
                                disabled={actioning[key]}
                                onClick={() => handleReject(app.event?._id, app._id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 disabled:opacity-60"
                                title="Reject"
                              >
                                <HiXCircle className="w-4 h-4 inline" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default NGODashboard
