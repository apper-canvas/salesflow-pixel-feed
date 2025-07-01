import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const TaskCalendar = ({ tasks, onTaskClick, onEditTask, onToggleComplete }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' or 'list'

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  const getTasksForDate = (date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    )
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'success'
    }
    return colors[priority] || 'default'
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  if (viewMode === 'list') {
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Tasks</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              icon="Calendar"
            >
              Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              icon="List"
            >
              List
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card cursor-pointer hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}
              onClick={() => onTaskClick(task)}
            >
              <div className="flex items-start space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleComplete(task.Id)
                  }}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    task.completed 
                      ? 'bg-success border-success text-white' 
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {task.completed && <ApperIcon name="Check" className="w-3 h-3" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getPriorityColor(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditTask(task)
                        }}
                        className="p-1"
                      >
                        <ApperIcon name="Edit" className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-text-secondary mb-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center text-sm text-text-secondary space-x-4">
                    <div className="flex items-center">
                      <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                      {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="User" className="w-4 h-4 mr-1" />
                      {task.assignedTo}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-text-primary">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(-1)}
              icon="ChevronLeft"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(1)}
              icon="ChevronRight"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            icon="Calendar"
          >
            Calendar
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            icon="List"
          >
            List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-text-secondary">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dayTasks = getTasksForDate(day)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isCurrentDay = isToday(day)

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`min-h-[100px] p-2 border border-gray-100 rounded-lg ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isCurrentDay ? 'ring-2 ring-primary' : ''}`}
            >
              <div className={`text-sm mb-1 ${
                isCurrentMonth ? 'text-text-primary' : 'text-text-secondary'
              } ${isCurrentDay ? 'font-bold text-primary' : ''}`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.Id}
                    onClick={() => onTaskClick(task)}
                    className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                      task.priority === 'high' ? 'bg-error/10 text-error' :
                      task.priority === 'medium' ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    }`}
                  >
                    {task.title.substring(0, 20)}...
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-text-secondary">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default TaskCalendar