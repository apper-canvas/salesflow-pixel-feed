import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item.",
  icon = "Inbox",
  actionLabel,
  onAction,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>
      
      <p className="text-text-secondary mb-8 max-w-md">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty