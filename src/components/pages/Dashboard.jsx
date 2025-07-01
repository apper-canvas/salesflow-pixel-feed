import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import DealPipeline from '@/components/organisms/DealPipeline'
import ActivityFeed from '@/components/organisms/ActivityFeed'
import TaskCalendar from '@/components/organisms/TaskCalendar'
import QuickActionMenu from '@/components/molecules/QuickActionMenu'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { taskService } from '@/services/api/taskService'
import { activityService } from '@/services/api/activityService'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [data, setData] = useState({
    contacts: [],
    deals: [],
    tasks: [],
    activities: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboardData = async () => {
    try {
      setError('')
      setLoading(true)

      const [contacts, deals, tasks, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll()
      ])

      setData({ contacts, deals, tasks, activities })
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.')
      console.error('Dashboard data loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleUpdateDeal = async (dealId, updates) => {
    try {
      await dealService.update(dealId, updates)
      toast.success('Deal updated successfully')
      loadDashboardData()
    } catch (err) {
      toast.error('Failed to update deal')
    }
  }

  const handleEditDeal = (deal) => {
    // Implement deal editing modal/form
    console.log('Edit deal:', deal)
  }

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await dealService.delete(dealId)
        toast.success('Deal deleted successfully')
        loadDashboardData()
      } catch (err) {
        toast.error('Failed to delete deal')
      }
    }
  }

  const handleTaskClick = (task) => {
    console.log('Task clicked:', task)
  }

  const handleEditTask = (task) => {
    console.log('Edit task:', task)
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const task = data.tasks.find(t => t.Id === taskId)
      await taskService.update(taskId, { completed: !task.completed })
      toast.success('Task updated successfully')
      loadDashboardData()
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleQuickActions = {
    onAddContact: () => console.log('Add contact'),
    onAddDeal: () => console.log('Add deal'),
    onAddTask: () => console.log('Add task')
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const stats = {
    totalContacts: data.contacts.length,
    totalDeals: data.deals.length,
    pipelineValue: data.deals.reduce((sum, deal) => sum + deal.value, 0),
    wonDeals: data.deals.filter(deal => deal.stage === 'won').length,
    pendingTasks: data.tasks.filter(task => !task.completed).length,
    recentActivities: data.activities.length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-text-secondary mt-1">
            Welcome back! Here's what's happening with your sales.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts.toLocaleString()}
            change="+12% from last month"
            changeType="positive"
            icon="Users"
            color="primary"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Pipeline Value"
            value={`$${(stats.pipelineValue / 1000).toFixed(0)}K`}
            change="+23% from last month"
            changeType="positive"
            icon="DollarSign"
            color="success"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Deals Won"
            value={stats.wonDeals.toString()}
            change="+8% from last month"
            changeType="positive"
            icon="Trophy"
            color="warning"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks.toString()}
            change="-5% from last week"
            changeType="positive"
            icon="CheckSquare"
            color="info"
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pipeline - Takes 2 columns on xl screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-2"
        >
          <DealPipeline
            deals={data.deals}
            onUpdateDeal={handleUpdateDeal}
            onEditDeal={handleEditDeal}
            onDeleteDeal={handleDeleteDeal}
          />
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ActivityFeed activities={data.activities.slice(0, 8)} />
        </motion.div>
      </div>

      {/* Tasks Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <TaskCalendar
          tasks={data.tasks}
          onTaskClick={handleTaskClick}
          onEditTask={handleEditTask}
          onToggleComplete={handleToggleComplete}
        />
      </motion.div>

      <QuickActionMenu {...handleQuickActions} />
    </div>
  )
}

export default Dashboard