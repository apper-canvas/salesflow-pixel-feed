import { useState } from 'react'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuClick, onGlobalSearch }) => {
  const [notifications] = useState([
    { id: 1, message: "New lead assigned to you", time: "2 min ago" },
    { id: 2, message: "Deal 'Enterprise Contract' moved to negotiation", time: "1 hour ago" },
    { id: 3, message: "Task deadline approaching", time: "3 hours ago" },
  ])

  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onMenuClick}
            className="lg:hidden"
            icon="Menu"
          />
          <div className="hidden sm:block">
            <SearchBar 
              onSearch={onGlobalSearch}
              placeholder="Search contacts, deals, tasks..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="sm:hidden">
            <Button variant="ghost" icon="Search" />
          </div>
          
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <ApperIcon name="Bell" className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm text-text-primary mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <Button variant="ghost" className="w-full text-center">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-text-primary">Sales Team</p>
              <p className="text-xs text-text-secondary">Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header