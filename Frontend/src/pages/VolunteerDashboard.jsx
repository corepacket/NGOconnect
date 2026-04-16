import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { logoutVolunteer, updateVolunteerProfilePic } from '../service/auth.service'
import {
  HiCalendar,
  HiUserGroup,
  HiHeart,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiLocationMarker,
  HiMail,
  HiPhone,
  HiLogout,
  HiX,
  HiSave,
} from 'react-icons/hi'
import { FaHandsHelping } from 'react-icons/fa'
import { useAuth } from '../auth/AuthContext'
import toast from 'react-hot-toast'

const VolunteerDashboard = () => {
  const { auth, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [profileUploading, setProfileUploading] = useState(false)
  
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

  const registeredEvents = [
    {
      id: 1,
      title: 'Beach Cleanup Drive',
      date: '2024-04-15',
      status: 'approved',
      organization: 'Ocean Conservation Society',
      location: 'Miami Beach, FL',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Teaching Workshop',
      date: '2024-04-20',
      status: 'pending',
      organization: 'Education For All',
      location: 'Community Center, Austin',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Health Camp',
      date: '2024-04-25',
      status: 'completed',
      organization: 'Rural Health Initiative',
      location: 'Rural Health Center',
      image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ]

  const savedEvents = [
    { id: 4, title: 'Animal Shelter Support', organization: 'City Animal Shelter', date: '2024-05-01', location: 'City Animal Shelter' },
    { id: 5, title: 'Food Distribution Drive', organization: 'Community Food Bank', date: '2024-05-05', location: 'Downtown Community Center' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <HiCheckCircle className="w-4 h-4" />
      case 'pending': return <HiClock className="w-4 h-4" />
      case 'rejected': return <HiXCircle className="w-4 h-4" />
      case 'completed': return <HiCheckCircle className="w-4 h-4" />
      default: return null
    }
  }

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
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 capitalize font-medium transition-colors relative ${
                  activeTab === tab ? 'text-primary-600' : 'text-earth-500 hover:text-earth-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="volunteerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {registeredEvents
                    .filter((e) => e.status === 'approved' || e.status === 'pending')
                    .map((event) => (
                      <div key={event.id} className="flex items-center gap-4 p-4 bg-earth-50 rounded-xl">
                        <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
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
            </div>
          )}

          {activeTab === 'registered' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">My Registered Events</h3>
              <div className="space-y-4">
                {registeredEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 bg-earth-50 rounded-xl">
                    <img src={event.image} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
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
              <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Saved Events</h3>
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
                    <Link
                      to="/events"
                      className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Register Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-display font-semibold text-earth-900 mb-4">Volunteer History</h3>
              <div className="space-y-4">
                {registeredEvents
                  .filter((e) => e.status === 'completed')
                  .map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 bg-earth-50 rounded-xl">
                      <img src={event.image} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
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
