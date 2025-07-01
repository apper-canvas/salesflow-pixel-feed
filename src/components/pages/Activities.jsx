import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ActivityFeed from '@/components/organisms/ActivityFeed'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { activityService } from '@/services/api/activityService'
import { format } from 'date-fns'

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('all')

  const activityTypes = [
    { key: 'all', label: 'All Types' },
    { key: 'call', label: 'Calls' },
    { key: 'email', label: 'Emails' },
    { key: 'meeting', label: 'Meetings' },
    { key: 'task', label: 'Tasks' },
    { key: 'note', label: 'Notes' },
    { key: 'deal', label: 'Deals' },
    { key: 'contact', label: 'Contacts' },
    { key: 'lead', label: 'Leads' }
  ]

  const dateFilters = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' }
  ]

  const loadActivities = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await activityService.getAll()
      setActivities(data)
      setFilteredActivities(data)
    } catch (err) {
      setError('Failed to load activities. Please try again.')
      console.error('Activities loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  useEffect(() => {
    let filtered = activities

    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType)
    }

    if (filterDate !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp)
        
        switch (filterDate) {
          case 'today':
            return activityDate >= today
          case 'week':
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            return activityDate >= weekAgo
          case 'month':
            const monthAgo = new Date(today)
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            return activityDate >= monthAgo
          default:
            return true
        }
      })
    }

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.relatedTo && 
         activity.relatedTo.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort by timestamp (most recent first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    setFilteredActivities(filtered)
  }, [searchTerm, filterType, filterDate, activities])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleLogActivity = () => {
    console.log('Log new activity')
    // Implement log activity functionality
  }

  const calculateStats = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayActivities = activities.filter(activity => 
      new Date(activity.timestamp) >= today
    ).length

    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekActivities = activities.filter(activity => 
      new Date(activity.timestamp) >= weekAgo
    ).length

    const typeStats = activityTypes.slice(1).reduce((acc, type) => {
      acc[type.key] = activities.filter(activity => activity.type === type.key).length
      return acc
    }, {})

    return { todayActivities, weekActivities, typeStats }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadActivities} />

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Activities
          </h1>
          <p className="text-text-secondary mt-1">
            Track all interactions and activities across your CRM.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleLogActivity}
          icon="Plus"
        >
          Log Activity
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-primary font-medium">Total Activities</p>
          <p className="text-2xl font-bold text-primary">{activities.length}</p>
        </div>
        <div className="bg-gradient-to-r from-success/10 to-accent-light/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-success font-medium">Today</p>
          <p className="text-2xl font-bold text-success">{stats.todayActivities}</p>
        </div>
        <div className="bg-gradient-to-r from-warning/10 to-yellow-400/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-warning font-medium">This Week</p>
          <p className="text-2xl font-bold text-warning">{stats.weekActivities}</p>
        </div>
        <div className="bg-gradient-to-r from-info/10 to-blue-400/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-info font-medium">Showing</p>
          <p className="text-2xl font-bold text-info">{filteredActivities.length}</p>
        </div>
      </motion.div>

      {/* Type Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3"
      >
        {activityTypes.slice(1).map((type) => (
          <div key={type.key} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-text-secondary">{type.label}</p>
            <p className="text-lg font-semibold text-text-primary">{stats.typeStats[type.key] || 0}</p>
          </div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4"
      >
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search activities by description, user, type, or related entity..."
        />
        <div className="flex items-center space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-gray-200 rounded px-3 py-2"
          >
            {activityTypes.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="text-sm border border-gray-200 rounded px-3 py-2"
          >
            {dateFilters.map((filter) => (
              <option key={filter.key} value={filter.key}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Activities Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredActivities.length > 0 ? (
          <ActivityFeed activities={filteredActivities} showFilters={false} />
        ) : (
          <Empty
            title={searchTerm || filterType !== 'all' || filterDate !== 'all' ? "No activities found" : "No activities yet"}
            description={
              searchTerm || filterType !== 'all' || filterDate !== 'all'
                ? "No activities match your current filters. Try adjusting your search or filter criteria."
                : "Activities will appear here as you interact with contacts, deals, and tasks."
            }
            icon={searchTerm || filterType !== 'all' || filterDate !== 'all' ? "Search" : "Activity"}
            actionLabel={searchTerm || filterType !== 'all' || filterDate !== 'all' ? undefined : "Log Activity"}
            onAction={searchTerm || filterType !== 'all' || filterDate !== 'all' ? undefined : handleLogActivity}
          />
        )}
      </motion.div>
    </div>
  )
}

export default Activities