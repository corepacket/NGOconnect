import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HiCalendar,
  HiLocationMarker,
  HiClock,
  HiUserGroup,
  HiPhotograph,
  HiArrowLeft,
} from 'react-icons/hi'
import { updateEvent, fetchEventById } from '../service/event.service'

const EditEvent = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'Community',
    location: '',
    date: '',
    timings: '',
    maxVolunteers: '',
    skillsRequired: '',
    requirements: '',
    benefits: '',
  })

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await fetchEventById(id)
        if (event) {
          setFormData({
            title: event.title || '',
            description: event.description || '',
            longDescription: event.longDescription || '',
            category: event.category || 'Community',
            location: event.location?.address || event.location || '',
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
            timings: event.timings || '',
            maxVolunteers: event.maxVolunteers || '',
            skillsRequired: event.skillsRequired || '',
            requirements: event.requirements || '',
            benefits: event.benefits || '',
          })
        } else {
          toast.error('Event not found')
          navigate('/dashboard/ngo')
        }
      } catch (err) {
        toast.error('Failed to load event details')
        navigate('/dashboard/ngo')
      } finally {
        setLoadingEvent(false)
      }
    }

    if (id) {
      loadEvent()
    } else {
      toast.error('Event ID not provided')
      navigate('/dashboard/ngo')
    }
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title?.trim() || !formData.description?.trim() || !formData.location?.trim()) {
      toast.error('Please fill title, description, and location.')
      return
    }
    if (!formData.date || !formData.timings || !formData.maxVolunteers) {
      toast.error('Date, time, and max volunteers are required.')
      return
    }

    setIsLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', formData.title.trim())
      fd.append('description', formData.description.trim())
      fd.append('longDescription', (formData.longDescription || formData.description).trim())
      fd.append('category', formData.category || 'General')
      fd.append('location', formData.location.trim())
      fd.append('date', formData.date)
      fd.append('timings', formData.timings.trim())
      fd.append('maxVolunteers', String(Number(formData.maxVolunteers)))
      if (formData.skillsRequired.trim()) {
        fd.append('skillsRequired', formData.skillsRequired)
      }
      if (formData.requirements.trim()) {
        fd.append('requirements', formData.requirements)
      }
      if (formData.benefits.trim()) {
        fd.append('benefits', formData.benefits)
      }
      if (imageFile) {
        fd.append('image', imageFile)
      }

      await updateEvent(id, fd)
      toast.success('Event updated successfully.')
      navigate('/dashboard/ngo')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update event. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-earth-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-earth-600">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Link
            to="/dashboard/ngo"
            className="inline-flex items-center gap-2 text-earth-600 hover:text-primary-600 mb-6 text-sm font-medium"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>

          <div className="bg-white rounded-2xl shadow-lg border border-earth-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 text-white">
              <h1 className="text-2xl md:text-3xl font-display font-bold">Edit volunteer event</h1>
              <p className="mt-2 text-white/90 text-sm max-w-xl">
                Update the details for your volunteer event. Changes will be reflected immediately on the listings page.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-earth-800 mb-1">Event title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="e.g. Weekend river cleanup"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-800 mb-1">Short description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y"
                  placeholder="One or two sentences for the listing card"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-800 mb-1">Full description (optional)</label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y"
                  placeholder="Details, what to bring, meeting point..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-800 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {['Community', 'Environment', 'Education', 'Health', 'Disaster relief', 'General'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800 mb-1 flex items-center gap-1">
                    <HiUserGroup className="w-4 h-4 text-primary-600" />
                    Max volunteers
                  </label>
                  <input
                    name="maxVolunteers"
                    type="number"
                    min={1}
                    value={formData.maxVolunteers}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-800 mb-1 flex items-center gap-1">
                  <HiLocationMarker className="w-4 h-4 text-primary-600" />
                  Location
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Address or area name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-800 mb-1 flex items-center gap-1">
                    <HiCalendar className="w-4 h-4 text-primary-600" />
                    Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-800 mb-1 flex items-center gap-1">
                    <HiClock className="w-4 h-4 text-primary-600" />
                    Time
                  </label>
                  <input
                    name="timings"
                    value={formData.timings}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g. 9:00 AM - 1:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-800 mb-1">Skills needed (comma-separated)</label>
                <input
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. Teaching, First aid, Driving"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-800 mb-1">Requirements (comma-separated, optional)</label>
                <input
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Defaults apply if left empty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-800 mb-1">Benefits for volunteers (comma-separated, optional)</label>
                <input
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-earth-200 px-4 py-2.5 text-earth-900 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-800 mb-1 flex items-center gap-1">
                  <HiPhotograph className="w-4 h-4 text-primary-600" />
                  Update cover image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-earth-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {imageFile && (
                  <p className="mt-2 text-sm text-earth-600">New image selected: {imageFile.name}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex justify-center items-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {isLoading ? 'Updating...' : 'Update event'}
                </button>
                <Link
                  to="/dashboard/ngo"
                  className="flex-1 inline-flex justify-center items-center px-6 py-3 rounded-lg border border-earth-200 text-earth-700 font-medium hover:bg-earth-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EditEvent
