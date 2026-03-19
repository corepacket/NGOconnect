import { useState } from 'react'
import SearchFilters from '../components/SearchFilters'
import EventCard from '../components/EventCard'
import { motion } from 'framer-motion'

const Events = () => {
  const [events, setEvents] = useState([
    {
      _id: '1',
      title: 'Beach Cleanup Drive',
      description: 'Join us in cleaning the local beach and protecting marine life. We need enthusiastic volunteers to help collect waste and sort recyclables.',
      date: '2024-04-15',
      category: 'Environment',
      skillsRequired: ['Teamwork', 'Physical Fitness', 'Environmental Awareness'],
      volunteers: [1, 2, 3],
      maxVolunteers: 50,
      location: 'Miami Beach, FL',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '2',
      title: 'Teaching Workshop',
      description: 'Help underprivileged children with their studies in mathematics and science.',
      date: '2024-04-20',
      category: 'Education',
      skillsRequired: ['Teaching', 'Patience', 'Communication'],
      volunteers: [1, 2],
      maxVolunteers: 20,
      location: 'Community Center, Austin',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '3',
      title: 'Health Camp',
      description: 'Medical camp for rural communities providing basic health checkups and medicines.',
      date: '2024-04-25',
      category: 'Healthcare',
      skillsRequired: ['Medical Knowledge', 'First Aid', 'Empathy'],
      volunteers: [1],
      maxVolunteers: 30,
      location: 'Rural Health Center',
      image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '4',
      title: 'Animal Shelter Support',
      description: 'Help care for abandoned animals at the local shelter.',
      date: '2024-05-01',
      category: 'Animal Welfare',
      skillsRequired: ['Animal Care', 'Patience', 'Physical Fitness'],
      volunteers: [1, 2, 3, 4],
      maxVolunteers: 15,
      location: 'City Animal Shelter',
      image: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
  ])

  const handleSearch = (term) => {
    // Implement search logic
    console.log('Searching for:', term)
  }

  const handleFilter = (filters) => {
    // Implement filter logic
    console.log('Applying filters:', filters)
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-4">
            Discover <span className="gradient-text">Volunteer Opportunities</span>
          </h1>
          <p className="text-earth-600 max-w-2xl mx-auto">
            Find events that match your skills and interests. Make a difference in your community.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <SearchFilters onSearch={handleSearch} onFilter={handleFilter} />

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
            Load More Events
          </button>
        </div>
      </div>
    </div>
  )
}

export default Events