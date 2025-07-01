import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Contacts', href: '/contacts', icon: 'Users' },
    { name: 'Leads', href: '/leads', icon: 'Target' },
    { name: 'Deals', href: '/deals', icon: 'DollarSign' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Activities', href: '/activities', icon: 'Activity' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              SalesFlow
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary border border-primary/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-2 h-2 bg-primary rounded-full"
                  />
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gradient-to-r from-primary/5 to-primary-light/5 border border-primary/10 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-success to-accent-light rounded-full flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Sales Performance
                </p>
                <p className="text-xs text-text-secondary">
                  Up 23% this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar