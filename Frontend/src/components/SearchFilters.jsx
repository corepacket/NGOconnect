import { useState } from 'react'
import { HiSearch, HiFilter } from 'react-icons/hi'

const SearchFilters = ({ onSearch, onFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: '',
  })

  const categories = [
    'Education',
    'Healthcare',
    'Environment',
    'Animal Welfare',
    'Disaster Relief',
    'Community Development',
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events by title, description, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors flex items-center gap-2"
        >
          <HiFilter className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </form>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-earth-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter city or area"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilters