import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const QuickActionMenu = ({ onAddContact, onAddDeal, onAddTask }) => {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { label: 'Add Contact', icon: 'UserPlus', action: onAddContact },
    { label: 'Add Deal', icon: 'DollarSign', action: onAddDeal },
    { label: 'Add Task', icon: 'Plus', action: onAddTask },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="secondary"
                  onClick={() => {
                    action.action()
                    setIsOpen(false)
                  }}
                  className="shadow-lg whitespace-nowrap"
                  icon={action.icon}
                >
                  {action.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="primary"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-xl"
        >
          <ApperIcon 
            name={isOpen ? 'X' : 'Plus'} 
            className="w-6 h-6"
          />
        </Button>
      </motion.div>
    </div>
  )
}

export default QuickActionMenu