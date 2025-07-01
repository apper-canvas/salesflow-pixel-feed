import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium'
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info',
    new: 'status-new',
    contacted: 'status-contacted',
    qualified: 'status-qualified',
    proposal: 'status-proposal',
    negotiation: 'status-negotiation',
    won: 'status-won',
    lost: 'status-lost',
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <span className={classes}>
      {icon && (
        <ApperIcon name={icon} className="w-3 h-3 mr-1" />
      )}
      {children}
    </span>
  )
}

export default Badge