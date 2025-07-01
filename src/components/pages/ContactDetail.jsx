import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ActivityFeed from '@/components/organisms/ActivityFeed'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { taskService } from '@/services/api/taskService'
import { activityService } from '@/services/api/activityService'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

const ContactDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [relatedData, setRelatedData] = useState({
    deals: [],
    tasks: [],
    activities: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const loadContactData = async () => {
    try {
      setError('')
      setLoading(true)

      const contactData = await contactService.getById(parseInt(id))
      setContact(contactData)

      // Load related data
      const [allDeals, allTasks, allActivities] = await Promise.all([
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll()
      ])

      // Filter related data
      const deals = allDeals.filter(deal => deal.contactId === parseInt(id))
      const tasks = allTasks.filter(task => 
        task.relatedTo && task.relatedTo.type === 'contact' && task.relatedTo.id === parseInt(id)
      )
      const activities = allActivities.filter(activity =>
        activity.relatedTo && activity.relatedTo.type === 'contact' && activity.relatedTo.id === parseInt(id)
      )

      setRelatedData({ deals, tasks, activities })
    } catch (err) {
      setError('Failed to load contact details. Please try again.')
      console.error('Contact detail loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContactData()
  }, [id])

  const handleEdit = () => {
    console.log('Edit contact:', contact)
    // Implement edit functionality
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.delete(parseInt(id))
        toast.success('Contact deleted successfully')
        navigate('/contacts')
      } catch (err) {
        toast.error('Failed to delete contact')
      }
    }
  }

  const handleAddDeal = () => {
    console.log('Add deal for contact:', contact)
    // Implement add deal functionality
  }

  const handleAddTask = () => {
    console.log('Add task for contact:', contact)
    // Implement add task functionality
  }

  const handleLogActivity = () => {
    console.log('Log activity for contact:', contact)
    // Implement log activity functionality
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadContactData} />
  if (!contact) return <Error message="Contact not found" />

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'User' },
    { key: 'deals', label: 'Deals', icon: 'DollarSign', count: relatedData.deals.length },
    { key: 'tasks', label: 'Tasks', icon: 'CheckSquare', count: relatedData.tasks.length },
    { key: 'activities', label: 'Activities', icon: 'Activity', count: relatedData.activities.length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/contacts')}
            icon="ArrowLeft"
          >
            Back to Contacts
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={handleEdit} icon="Edit">
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete} icon="Trash2">
            Delete
          </Button>
        </div>
      </div>

      {/* Contact Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">{contact.name}</h1>
                <p className="text-lg text-text-secondary">{contact.position} at {contact.company}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="primary" onClick={handleAddDeal} icon="Plus">
                  Add Deal
                </Button>
                <Button variant="secondary" onClick={handleLogActivity} icon="MessageSquare">
                  Log Activity
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-text-secondary">
                  <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                  <span className="text-sm">Email</span>
                </div>
                <p className="font-medium text-text-primary">{contact.email}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-text-secondary">
                  <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                  <span className="text-sm">Phone</span>
                </div>
                <p className="font-medium text-text-primary">{contact.phone}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-text-secondary">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                  <span className="text-sm">Added</span>
                </div>
                <p className="font-medium text-text-primary">
                  {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            {contact.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center text-text-secondary mb-2">
                  <ApperIcon name="Tag" className="w-4 h-4 mr-2" />
                  <span className="text-sm">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <Badge variant="default" size="sm">
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Company</p>
                      <p className="font-medium text-text-primary">{contact.company}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Position</p>
                      <p className="font-medium text-text-primary">{contact.position}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Email</p>
                      <p className="font-medium text-text-primary">{contact.email}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Phone</p>
                      <p className="font-medium text-text-primary">{contact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-success/10 to-accent-light/10 border border-success/20 rounded-lg">
                      <p className="text-sm text-success font-medium">Active Deals</p>
                      <p className="text-2xl font-bold text-success">{relatedData.deals.length}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-warning/10 to-yellow-400/10 border border-warning/20 rounded-lg">
                      <p className="text-sm text-warning font-medium">Open Tasks</p>
                      <p className="text-2xl font-bold text-warning">
                        {relatedData.tasks.filter(t => !t.completed).length}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-info/10 to-blue-400/10 border border-info/20 rounded-lg">
                      <p className="text-sm text-info font-medium">Activities</p>
                      <p className="text-2xl font-bold text-info">{relatedData.activities.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">Related Deals</h3>
                <Button variant="primary" onClick={handleAddDeal} icon="Plus">
                  Add Deal
                </Button>
              </div>
              {relatedData.deals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedData.deals.map((deal) => (
                    <div key={deal.Id} className="card">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-text-primary">{deal.name}</h4>
                        <Badge variant={deal.stage}>{deal.stage}</Badge>
                      </div>
                      <p className="text-2xl font-bold text-success mb-2">
                        ${deal.value.toLocaleString()}
                      </p>
                      <div className="text-sm text-text-secondary space-y-1">
                        <div>Probability: {deal.probability}%</div>
                        <div>Expected Close: {format(new Date(deal.expectedCloseDate), 'MMM dd, yyyy')}</div>
                        <div>Assigned to: {deal.assignedTo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="DollarSign" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No deals yet</h3>
                  <p className="text-text-secondary mb-4">Create a deal to start tracking sales opportunities with this contact.</p>
                  <Button variant="primary" onClick={handleAddDeal} icon="Plus">
                    Add First Deal
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">Related Tasks</h3>
                <Button variant="primary" onClick={handleAddTask} icon="Plus">
                  Add Task
                </Button>
              </div>
              {relatedData.tasks.length > 0 ? (
                <div className="space-y-4">
                  {relatedData.tasks.map((task) => (
                    <div key={task.Id} className="card">
                      <div className="flex items-start space-x-4">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                          task.completed 
                            ? 'bg-success border-success text-white' 
                            : 'border-gray-300'
                        }`}>
                          {task.completed && <ApperIcon name="Check" className="w-3 h-3" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-medium ${task.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                              {task.title}
                            </h4>
                            <Badge variant={task.priority}>{task.priority}</Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-text-secondary mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center text-sm text-text-secondary space-x-4">
                            <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                            <span>Assigned to: {task.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="CheckSquare" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No tasks yet</h3>
                  <p className="text-text-secondary mb-4">Create tasks to track follow-ups and actions for this contact.</p>
                  <Button variant="primary" onClick={handleAddTask} icon="Plus">
                    Add First Task
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              {relatedData.activities.length > 0 ? (
                <ActivityFeed activities={relatedData.activities} showFilters={false} />
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="Activity" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No activities yet</h3>
                  <p className="text-text-secondary mb-4">Activities will appear here as you interact with this contact.</p>
                  <Button variant="primary" onClick={handleLogActivity} icon="Plus">
                    Log Activity
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ContactDetail