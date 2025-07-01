import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import TaskCalendar from '@/components/organisms/TaskCalendar'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { taskService } from '@/services/api/taskService'
import { toast } from 'react-toastify'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const loadTasks = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await taskService.getAll()
      setTasks(data)
      setFilteredTasks(data)
    } catch (err) {
      setError('Failed to load tasks. Please try again.')
      console.error('Tasks loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    let filtered = tasks

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority)
    }

    if (filterStatus === 'completed') {
      filtered = filtered.filter(task => task.completed)
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(task => !task.completed)
    }

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTasks(filtered)
  }, [searchTerm, filterPriority, filterStatus, tasks])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleTaskClick = (task) => {
    console.log('Task clicked:', task)
    // Implement task detail view or edit modal
  }

  const handleEditTask = (task) => {
    console.log('Edit task:', task)
    // Implement edit functionality
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId)
      await taskService.update(taskId, { completed: !task.completed })
      toast.success(`Task marked as ${task.completed ? 'pending' : 'completed'}`)
      loadTasks()
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId)
        toast.success('Task deleted successfully')
        loadTasks()
      } catch (err) {
        toast.error('Failed to delete task')
      }
    }
  }

  const handleAddTask = () => {
    console.log('Add new task')
    // Implement add task functionality
  }

  const calculateStats = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = total - completed
    const overdue = tasks.filter(task => 
      !task.completed && new Date(task.dueDate) < new Date()
    ).length
    const highPriority = tasks.filter(task => 
      !task.completed && task.priority === 'high'
    ).length

    return { total, completed, pending, overdue, highPriority }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTasks} />

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your tasks and stay on top of your schedule.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleAddTask}
          icon="Plus"
        >
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-primary font-medium">Total Tasks</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-r from-success/10 to-accent-light/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-success font-medium">Completed</p>
          <p className="text-2xl font-bold text-success">{stats.completed}</p>
        </div>
        <div className="bg-gradient-to-r from-warning/10 to-yellow-400/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-warning font-medium">Pending</p>
          <p className="text-2xl font-bold text-warning">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-r from-error/10 to-red-500/10 border border-error/20 rounded-lg p-4">
          <p className="text-sm text-error font-medium">Overdue</p>
          <p className="text-2xl font-bold text-error">{stats.overdue}</p>
        </div>
        <div className="bg-gradient-to-r from-info/10 to-blue-400/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-info font-medium">High Priority</p>
          <p className="text-2xl font-bold text-info">{stats.highPriority}</p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4"
      >
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search tasks by title, description, or assignee..."
        />
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-sm border border-gray-200 rounded px-3 py-2"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </motion.div>

      {/* Tasks Calendar/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredTasks.length > 0 ? (
          <TaskCalendar
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onEditTask={handleEditTask}
            onToggleComplete={handleToggleComplete}
          />
        ) : (
          <Empty
            title={searchTerm || filterPriority !== 'all' || filterStatus !== 'all' ? "No tasks found" : "No tasks yet"}
            description={
              searchTerm || filterPriority !== 'all' || filterStatus !== 'all'
                ? "No tasks match your current filters. Try adjusting your search or filter criteria."
                : "Start organizing your work by creating your first task."
            }
            icon={searchTerm || filterPriority !== 'all' || filterStatus !== 'all' ? "Search" : "CheckSquare"}
            actionLabel={searchTerm || filterPriority !== 'all' || filterStatus !== 'all' ? undefined : "Add First Task"}
            onAction={searchTerm || filterPriority !== 'all' || filterStatus !== 'all' ? undefined : handleAddTask}
          />
        )}
      </motion.div>
    </div>
  )
}

export default Tasks