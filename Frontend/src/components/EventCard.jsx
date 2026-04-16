import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiCalendar, HiLocationMarker, HiUserGroup } from 'react-icons/hi'
import { format } from 'date-fns'
import { normalizeEvent } from '../lib/event-utils'

const EventCard = ({ event }) => {
  const normalizedEvent = normalizeEvent(event)
  const eventDate = normalizedEvent.date ? format(new Date(normalizedEvent.date), 'PPP') : 'Date TBD'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group flex h-full flex-col bg-white rounded-2xl shadow-lg overflow-hidden border border-earth-100 hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={normalizedEvent.image}
          alt={normalizedEvent.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-hope-600 to-compassion-600 text-white text-xs font-semibold rounded-full">
            {normalizedEvent.category}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-earth-800">
            {normalizedEvent.spotsLeft} spots left
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 mb-2">
          {normalizedEvent.organization.name}
        </p>
        <h3 className="text-xl font-display font-semibold text-earth-900 mb-2 line-clamp-1">
          {normalizedEvent.title}
        </h3>
        
        <p className="text-earth-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {normalizedEvent.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-earth-500 text-sm">
            <HiCalendar className="w-4 h-4 mr-2 text-hope-600" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center text-earth-500 text-sm">
            <HiLocationMarker className="w-4 h-4 mr-2 text-hope-600" />
            <span className="line-clamp-1">{normalizedEvent.locationText}</span>
          </div>
          <div className="flex items-center text-earth-500 text-sm">
            <HiUserGroup className="w-4 h-4 mr-2 text-hope-600" />
            <span>
              {normalizedEvent.currentVolunteers} / {normalizedEvent.maxVolunteers || '∞'} Volunteers
            </span>
          </div>
        </div>

        {normalizedEvent.volunteers.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {normalizedEvent.volunteers.slice(0, 3).map((volunteer, index) => (
                  <img
                    key={volunteer.id || index}
                    src={volunteer.avatar || `https://images.unsplash.com/photo-${1507003211169 + index}-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`}
                    alt={volunteer.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-sm text-earth-600">
                {normalizedEvent.currentVolunteers} volunteer{normalizedEvent.currentVolunteers !== 1 ? 's' : ''} registered
              </span>
            </div>
          </div>
        )}

        {normalizedEvent.skillsRequired.length > 0 && (
          <div className="mb-5">
            <div className="flex flex-wrap gap-2">
              {normalizedEvent.skillsRequired.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-hope-100 text-hope-700 text-xs rounded-md"
                >
                  {skill}
                </span>
              ))}
              {normalizedEvent.skillsRequired.length > 3 && (
                <span className="px-2 py-1 bg-hope-100 text-hope-700 text-xs rounded-md">
                  +{normalizedEvent.skillsRequired.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <Link
          to={`/events/${normalizedEvent._id}`}
          className="mt-auto block w-full text-center px-4 py-3 bg-gradient-to-r from-hope-600 to-compassion-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  )
}

export default EventCard