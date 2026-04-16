import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { logoutVolunteer, updateVolunteerProfilePic } from '../service/auth.service'
import {
  HiCalendar,
  HiUserGroup,
  HiHeart,
  HiClock,
  HiMail,
  HiPhone,
  HiLogout,
  HiX,
  HiSave,
} from 'react-icons/hi'
import { useAuth } from '../auth/AuthContext'
import toast from 'react-hot-toast'
import { fetchEvents } from '../service/event.service'
import { normalizeEvents } from '../lib/event-utils'
import EventCard from '../components/EventCard'

const VolunteerDashboard = () => {
  const { auth, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [profileUploading, setProfileUploading] = useState(false)
  const [discoverEvents, setDiscoverEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  
  const [profileData, setProfileData] = useState({
    name: auth?.user?.fullname || auth?.user?.name || 'Volunteer',
    email: auth?.user?.email || 'volunteer@example.com',
    phone: auth?.user?.phoneNumber || auth?.user?.phone || '+1 234 567 890',
    bio: '',
    skills: [],
    availability: 'weekends',
    interests: [],
    memberSince: auth?.user?.memberSince || new Date('2023-01-15').toLocaleString('default', { month: 'long', year: 'numeric' }),
  })

  const availableSkills = [
    'Teaching', 'Healthcare', 'Environmental Conservation', 'Animal Care',
    'Event Management', 'Fundraising', 'Social Media', 'Web Development',
    'Graphic Design', 'Photography', 'Writing', 'Public Speaking',
    'First Aid', 'Counseling', 'Legal Aid', 'Research'
  ]

  const interests = [
    'Education', 'Healthcare', 'Environment', 'Animal Welfare',
    'Elderly Care', 'Youth Development', 'Arts & Culture', 'Sports',
    'Technology', 'Community Service', 'Disaster Relief', 'Human Rights'
  ]

  const user = {
    name: profileData.name,
    email: profileData.email,
    phone: profileData.phone,
    avatar:
      auth?.user?.profilePic ||
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    memberSince: profileData.memberSince,
    totalHours: auth?.user?.totalHours || 48,
    eventsAttended: auth?.user?.eventsAttended || 12,
  }

  useEffect(() => {
    let cancelled = false

    const loadEvents = async () => {
      try {
        const data = await fetchEvents()
        if (!cancelled) setDiscoverEvents(normalizeEvents(data))
      } catch (err) {
        if (!cancelled) toast.error(err.response?.data?.message || 'Could not load event feed')
      } finally {
        if (!cancelled) setEventsLoading(false)
      }
    }

    loadEvents()
    return () => {
      cancelled = true
    }
  }, [])

  const handleLogout = async() => {
    try{
      await logoutVolunteer();

    }catch(err){
      console.error("Volunteer logout unsuccessfull")
    }
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    // Here you would typically make an API call to update the profile
    console.log('Updating profile:', profileData)
    toast.success('Profile updated successfully!')
    setShowEditProfile(false)
  }

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfileUploading(true)
    try {
      const updatedUser = await updateVolunteerProfilePic(file)
      updateUser(updatedUser)
      toast.success('Profile image updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile image')
    } finally {
      setProfileUploading(false)
      e.target.value = ''
    }
  }

  const handleSkillToggle = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleInterestToggle = (interest) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const recommendedEvents = useMemo(
    () => discoverEvents.filter((event) => event.spotsLeft > 0).slice(0, 6),
    [discoverEvents]
  )

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
              Welcome back, <span className="gradient-text">{String(user.name).split(' ')[0]}</span>!
            </h1>
            <p className="text-earth-600 mt-2">Manage your volunteer activities and track your impact</p>
            <Link
              to="/dashboard/volunteer/my-events"
              className="inline-flex mt-3 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700"
            >
              Open My Registered/Saved/History
            </Link>
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
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-display font-semibold text-earth-900 mb-2">{user.name}</h2>
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
              <div className="mt-3">
                <label className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-earth-200 rounded-lg cursor-pointer hover:bg-earth-50">
                  <span>{profileUploading ? 'Uploading photo...' : 'Change photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    disabled={profileUploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <button 
              onClick={() => setShowEditProfile(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <HiCalendar />, label: 'Events Attended', value: user.eventsAttended, color: 'bg-blue-500' },
            { icon: <HiClock />, label: 'Volunteer Hours', value: user.totalHours, color: 'bg-green-500' },
            { icon: <HiUserGroup />, label: 'Open Opportunities', value: recommendedEvents.length, color: 'bg-purple-500' },
            { icon: <HiHeart />, label: 'Community Impact', value: discoverEvents.length ? 'Growing' : 'Start now', color: 'bg-red-500' },
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
            {['overview', 'registered', 'saved', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'overview') {
                    setActiveTab('overview')
                  } else {
                    navigate('/dashboard/volunteer/my-events', { replace: false })
                  }
                }}
                className={`pb-4 px-1 capitalize font-medium transition-colors relative ${
                  tab === 'overview' && activeTab === 'overview'
                    ? 'text-primary-600'
                    : 'text-earth-500 hover:text-earth-700'
                }`}
              >
                {tab}
                {tab === 'overview' && activeTab === 'overview' && (
                  <motion.div
                    layoutId="volunteerTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-display font-semibold text-earth-900">Recommended Events</h3>
                  <Link to="/events" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                    View all
                  </Link>
                </div>
                {eventsLoading ? (
                  <div className="text-sm text-earth-500 py-8 text-center">Loading event feed...</div>
                ) : recommendedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {recommendedEvents.slice(0, 3).map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-earth-200 bg-earth-50 px-6 py-10 text-center">
                    <p className="text-earth-800 font-medium mb-2">No live opportunities yet</p>
                    <p className="text-earth-500 text-sm">
                      Once NGOs post events or you seed demo data, they will appear here automatically.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* When user clicks Registered/Saved/History, we navigate them to /dashboard/volunteer/my-events,
              so only the overview content is rendered inside this component. */}
        </motion.div>

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-earth-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-earth-900">Edit Profile</h2>
                  <button
                    onClick={() => setShowEditProfile(false)}
                    className="p-2 hover:bg-earth-100 rounded-lg transition-colors"
                  >
                    <HiX className="w-5 h-5 text-earth-600" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-earth-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">Availability</label>
                      <select
                        value={profileData.availability}
                        onChange={(e) => setProfileData(prev => ({ ...prev, availability: e.target.value }))}
                        className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="weekdays">Weekdays</option>
                        <option value="weekends">Weekends</option>
                        <option value="flexible">Flexible</option>
                        <option value="evenings">Evenings</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-earth-700 mb-2">Member Since</label>
                    <input
                      type="text"
                      value={profileData.memberSince}
                      onChange={(e) => setProfileData(prev => ({ ...prev, memberSince: e.target.value }))}
                      className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-earth-50"
                      readOnly
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-earth-700 mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us about yourself and your volunteering interests..."
                    />
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <h3 className="text-lg font-semibold text-earth-900 mb-4">Skills</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableSkills.map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          profileData.skills.includes(skill)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-earth-200 hover:border-earth-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={profileData.skills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Interests Section */}
                <div>
                  <h3 className="text-lg font-semibold text-earth-900 mb-4">Areas of Interest</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interests.map((interest) => (
                      <label
                        key={interest}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          profileData.interests.includes(interest)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-earth-200 hover:border-earth-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={profileData.interests.includes(interest)}
                          onChange={() => handleInterestToggle(interest)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-earth-200">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <HiSave className="w-5 h-5" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="px-6 py-3 border border-earth-200 text-earth-600 rounded-lg hover:bg-earth-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VolunteerDashboard
