import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiCalendar, HiLocationMarker, HiUserGroup } from 'react-icons/hi'
import { format } from 'date-fns'

const EventCard = ({ event }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-display font-semibold text-earth-900 mb-2 line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-earth-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-earth-500 text-sm">
            <HiCalendar className="w-4 h-4 mr-2 text-primary-600" />
            <span>{format(new Date(event.date), 'PPP')}</span>
          </div>
          <div className="flex items-center text-earth-500 text-sm">
            <HiLocationMarker className="w-4 h-4 mr-2 text-primary-600" />
            <span>{event.location || 'Location TBD'}</span>
          </div>
          <div className="flex items-center text-earth-500 text-sm">
            <HiUserGroup className="w-4 h-4 mr-2 text-primary-600" />
            <span>
              {event.volunteers?.length || 0} / {event.maxVolunteers || '∞'} Volunteers
            </span>
          </div>
        </div>

        {/* Skills */}
        {event.skillsRequired && event.skillsRequired.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {event.skillsRequired.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-earth-100 text-earth-700 text-xs rounded-md"
                >
                  {skill}
                </span>
              ))}
              {event.skillsRequired.length > 3 && (
                <span className="px-2 py-1 bg-earth-100 text-earth-700 text-xs rounded-md">
                  +{event.skillsRequired.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Button */}
        <Link
          to={`/events/${event._id}`}
          className="block w-full text-center px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  )
}

export default EventCard