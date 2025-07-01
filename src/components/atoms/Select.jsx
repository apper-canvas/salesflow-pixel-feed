import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label, 
  options = [], 
  error, 
  placeholder = 'Select an option',
  className = '',
  ...props 
}, ref) => {
  const selectClasses = `input-field pr-12 appearance-none bg-white ${error ? 'border-error focus:ring-error/50 focus:border-error' : ''} ${className}`
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select