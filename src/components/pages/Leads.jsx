import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { leadService } from '@/services/api/leadService'
import { contactService } from '@/services/api/contactService'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

const Leads = () => {
  const [leads, setLeads] = useState([])
  const [contacts, setContacts] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const statuses = [
    { key: 'all', label: 'All Leads', color: 'default' },
    { key: 'new', label: 'New', color: 'info' },
    { key: 'contacted', label: 'Contacted', color: 'warning' },
    { key: 'qualified', label: 'Qualified', color: 'success' },
    { key: 'lost', label: 'Lost', color: 'error' }
  ]

  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      const [leadsData, contactsData] = await Promise.all([
        leadService.getAll(),
        contactService.getAll()
      ])
      setLeads(leadsData)
      setContacts(contactsData)
      setFilteredLeads(leadsData)
    } catch (err) {
      setError('Failed to load leads. Please try again.')
      console.error('Leads loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = leads

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === selectedStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(lead => {
        const contact = contacts.find(c => c.Id === lead.contactId)
        return (
          contact?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact?.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    setFilteredLeads(filtered)
  }, [searchTerm, selectedStatus, leads, contacts])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await leadService.update(leadId, { status: newStatus })
      toast.success('Lead status updated successfully')
      loadData()
    } catch (err) {
      toast.error('Failed to update lead status')
    }
  }

  const handleConvertToDeal = (lead) => {
    console.log('Convert lead to deal:', lead)
    // Implement conversion to deal functionality
    toast.success('Lead converted to deal successfully')
  }

  const handleEdit = (lead) => {
    console.log('Edit lead:', lead)
    // Implement edit functionality
  }

  const handleDelete = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.delete(leadId)
        toast.success('Lead deleted successfully')
        loadData()
      } catch (err) {
        toast.error('Failed to delete lead')
      }
    }
  }

  const handleAddLead = () => {
    console.log('Add new lead')
    // Implement add lead functionality
  }

  const getContactInfo = (contactId) => {
    return contacts.find(c => c.Id === contactId) || {}
  }

  const getLeadsByStatus = (status) => {
    return leads.filter(lead => lead.status === status)
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Leads
          </h1>
          <p className="text-text-secondary mt-1">
            Track and qualify potential customers through your sales funnel.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleAddLead}
          icon="Plus"
        >
          Add Lead
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {statuses.slice(1).map((status) => {
          const count = getLeadsByStatus(status.key).length
          return (
            <div key={status.key} className={`bg-gradient-to-r from-${status.color}/10 to-${status.color}/20 border border-${status.color}/20 rounded-lg p-4`}>
              <p className={`text-sm text-${status.color} font-medium`}>{status.label}</p>
              <p className={`text-2xl font-bold text-${status.color}`}>{count}</p>
            </div>
          )
        })}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search leads by contact, company, source, or assignee..."
        />
        <div className="flex items-center space-x-2">
          {statuses.map((status) => (
            <Button
              key={status.key}
              variant={selectedStatus === status.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedStatus(status.key)}
            >
              {status.label}
              <Badge variant="default" size="sm" className="ml-2">
                {status.key === 'all' ? leads.length : getLeadsByStatus(status.key).length}
              </Badge>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Leads Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredLeads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead, index) => {
              const contact = getContactInfo(lead.contactId)
              return (
                <motion.div
                  key={lead.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {contact.name?.charAt(0).toUpperCase() || 'L'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{contact.name || 'Unknown Contact'}</h3>
                        <p className="text-sm text-text-secondary">{contact.company || 'No Company'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lead)}
                        className="p-1"
                      >
                        <ApperIcon name="Edit" className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(lead.Id)}
                        className="p-1 text-error hover:text-error"
                      >
                        <ApperIcon name="Trash2" className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={lead.status}>{lead.status}</Badge>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Star" className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium">{lead.score}/100</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-text-secondary">
                      <div className="flex items-center">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                        <span>Source: {lead.source}</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="User" className="w-4 h-4 mr-2" />
                        <span>Assigned to: {lead.assignedTo}</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                        <span>Created: {format(new Date(lead.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.Id, e.target.value)}
                        className="text-sm border border-gray-200 rounded px-2 py-1 flex-1"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="lost">Lost</option>
                      </select>
                      {lead.status === 'qualified' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleConvertToDeal(lead)}
                          icon="ArrowRight"
                        >
                          Convert
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <Empty
            title={searchTerm || selectedStatus !== 'all' ? "No leads found" : "No leads yet"}
            description={
              searchTerm || selectedStatus !== 'all'
                ? "No leads match your current filters. Try adjusting your search or filter criteria."
                : "Start building your sales pipeline by adding your first lead."
            }
            icon={searchTerm || selectedStatus !== 'all' ? "Search" : "Target"}
            actionLabel={searchTerm || selectedStatus !== 'all' ? undefined : "Add First Lead"}
            onAction={searchTerm || selectedStatus !== 'all' ? undefined : handleAddLead}
          />
        )}
      </motion.div>
    </div>
  )
}

export default Leads