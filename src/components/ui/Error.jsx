import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-error/10 to-red-500/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-text-secondary mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          icon="RotateCcw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default Error