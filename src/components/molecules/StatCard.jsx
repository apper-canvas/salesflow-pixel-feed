import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon,
  color = 'primary',
  className = '' 
}) => {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-primary/10 to-primary-light/10 border-primary/20',
    success: 'bg-gradient-to-br from-success/10 to-accent-light/10 border-success/20',
    warning: 'bg-gradient-to-br from-warning/10 to-yellow-400/10 border-warning/20',
    info: 'bg-gradient-to-br from-info/10 to-blue-400/10 border-info/20',
  }

  const iconColors = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`card border-2 ${colorClasses[color]} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary mb-2">{value}</p>
          {change && (
            <div className={`flex items-center text-sm ${
              changeType === 'positive' ? 'text-success' : 'text-error'
            }`}>
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                className="w-4 h-4 mr-1" 
              />
              <span>{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-white shadow-sm ${iconColors[color]}`}>
            <ApperIcon name={icon} className="w-8 h-8" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatCard