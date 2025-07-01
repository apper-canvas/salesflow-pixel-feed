import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const ActivityFeed = ({ activities, showFilters = true }) => {
  const getActivityIcon = (type) => {
    const icons = {
      call: 'Phone',
      email: 'Mail',
      meeting: 'Users',
      task: 'CheckSquare',
      note: 'FileText',
      deal: 'DollarSign',
      contact: 'User',
      lead: 'Target',
    }
    return icons[type] || 'Activity'
  }

  const getActivityColor = (type) => {
    const colors = {
      call: 'info',
      email: 'primary',
      meeting: 'success',
      task: 'warning',
      note: 'default',
      deal: 'success',
      contact: 'primary',
      lead: 'warning',
    }
    return colors[type] || 'default'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Recent Activities</h2>
        {showFilters && (
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="cursor-pointer hover:bg-gray-200">
              All Types
            </Badge>
            <Badge variant="default" className="cursor-pointer hover:bg-gray-200">
              Today
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${getActivityColor(activity.type)}/10`}>
              <ApperIcon 
                name={getActivityIcon(activity.type)} 
                className={`w-5 h-5 text-${getActivityColor(activity.type)}`} 
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-text-primary">
                  {activity.description}
                </p>
                <Badge variant={getActivityColor(activity.type)} size="sm">
                  {activity.type}
                </Badge>
              </div>

              <div className="flex items-center text-sm text-text-secondary space-x-4">
                <span>{format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                <span>{activity.userId}</span>
                {activity.relatedTo && (
                  <span className="flex items-center">
                    <ApperIcon name="Link" className="w-3 h-3 mr-1" />
                    {activity.relatedTo.type}: {activity.relatedTo.name}
                  </span>
                )}
              </div>

              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-text-secondary">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Activity" className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No activities yet</h3>
            <p className="text-text-secondary">Start interacting with contacts and deals to see activities here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityFeed