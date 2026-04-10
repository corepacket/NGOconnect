import { motion } from 'framer-motion'

const VolunteerList = ({ volunteers, maxVolunteers }) => {
  if (!volunteers || volunteers.length === 0) {
    return (
      <div className="text-center py-8 text-earth-500">
        <div className="text-lg font-medium mb-2">No volunteers yet</div>
        <div className="text-sm">Be the first to apply for this event!</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-earth-900">Registered Volunteers</h3>
        <span className="text-sm text-earth-600">
          {volunteers.length} / {maxVolunteers || 'Unlimited'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {volunteers.map((volunteer, index) => (
          <motion.div
            key={volunteer.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 bg-earth-50 rounded-lg hover:bg-earth-100 transition-colors"
          >
            <img
              src={volunteer.avatar || `https://images.unsplash.com/photo-${1507003211169 + index}-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`}
              alt={volunteer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-earth-900 truncate">
                {volunteer.name}
              </div>
              <div className="text-sm text-earth-600">
                Volunteer
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {volunteers.length < maxVolunteers && (
        <div className="text-center py-4 text-earth-500 text-sm">
          {maxVolunteers - volunteers.length} spots remaining
        </div>
      )}
    </div>
  )
}

export default VolunteerList
