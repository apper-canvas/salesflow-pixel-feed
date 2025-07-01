import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import DealPipeline from '@/components/organisms/DealPipeline'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { dealService } from '@/services/api/dealService'
import { contactService } from '@/services/api/contactService'
import { toast } from 'react-toastify'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [filteredDeals, setFilteredDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('pipeline') // 'pipeline' or 'list'

  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      setDeals(dealsData)
      setContacts(contactsData)
      setFilteredDeals(dealsData)
    } catch (err) {
      setError('Failed to load deals. Please try again.')
      console.error('Deals loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredDeals(deals)
    } else {
      const filtered = deals.filter(deal => {
        const contact = contacts.find(c => c.Id === deal.contactId)
        return (
          deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact?.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
      setFilteredDeals(filtered)
    }
  }, [searchTerm, deals, contacts])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleUpdateDeal = async (dealId, updates) => {
    try {
      await dealService.update(dealId, updates)
      toast.success('Deal updated successfully')
      loadData()
    } catch (err) {
      toast.error('Failed to update deal')
    }
  }

  const handleEditDeal = (deal) => {
    console.log('Edit deal:', deal)
    // Implement edit functionality
  }

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await dealService.delete(dealId)
        toast.success('Deal deleted successfully')
        loadData()
      } catch (err) {
        toast.error('Failed to delete deal')
      }
    }
  }

  const handleAddDeal = () => {
    console.log('Add new deal')
    // Implement add deal functionality
  }

  const calculateStats = () => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
    const wonValue = deals.filter(deal => deal.stage === 'won').reduce((sum, deal) => sum + deal.value, 0)
    const wonCount = deals.filter(deal => deal.stage === 'won').length
    const lostCount = deals.filter(deal => deal.stage === 'lost').length
    const winRate = deals.length > 0 ? ((wonCount / deals.length) * 100).toFixed(1) : 0

    return { totalValue, wonValue, wonCount, lostCount, winRate }
  }

  if (loading) return <Loading type="pipeline" />
  if (error) return <Error message={error} onRetry={loadData} />

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Deals Pipeline
          </h1>
          <p className="text-text-secondary mt-1">
            Track and manage your sales opportunities through the pipeline.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'pipeline' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('pipeline')}
              icon="Kanban"
            >
              Pipeline
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
          <Button
            variant="primary"
            onClick={handleAddDeal}
            icon="Plus"
          >
            Add Deal
          </Button>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-primary font-medium">Total Pipeline</p>
          <p className="text-2xl font-bold text-primary">
            ${(stats.totalValue / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="bg-gradient-to-r from-success/10 to-accent-light/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-success font-medium">Won Value</p>
          <p className="text-2xl font-bold text-success">
            ${(stats.wonValue / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="bg-gradient-to-r from-warning/10 to-yellow-400/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-warning font-medium">Win Rate</p>
          <p className="text-2xl font-bold text-warning">{stats.winRate}%</p>
        </div>
        <div className="bg-gradient-to-r from-info/10 to-blue-400/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-info font-medium">Won Deals</p>
          <p className="text-2xl font-bold text-info">{stats.wonCount}</p>
        </div>
        <div className="bg-gradient-to-r from-error/10 to-red-500/10 border border-error/20 rounded-lg p-4">
          <p className="text-sm text-error font-medium">Lost Deals</p>
          <p className="text-2xl font-bold text-error">{stats.lostCount}</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search deals by name, contact, company, or assignee..."
        />
      </motion.div>

      {/* Pipeline or List View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredDeals.length > 0 ? (
          viewMode === 'pipeline' ? (
            <DealPipeline
              deals={filteredDeals}
              onUpdateDeal={handleUpdateDeal}
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-medium text-text-primary">Deal Name</th>
                      <th className="text-left p-4 font-medium text-text-primary">Contact</th>
                      <th className="text-left p-4 font-medium text-text-primary">Value</th>
                      <th className="text-left p-4 font-medium text-text-primary">Stage</th>
                      <th className="text-left p-4 font-medium text-text-primary">Probability</th>
                      <th className="text-left p-4 font-medium text-text-primary">Close Date</th>
                      <th className="text-left p-4 font-medium text-text-primary">Assigned To</th>
                      <th className="text-right p-4 font-medium text-text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeals.map((deal) => {
                      const contact = contacts.find(c => c.Id === deal.contactId)
                      return (
                        <tr key={deal.Id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-text-primary">{deal.name}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-text-primary">{contact?.name || 'Unknown'}</p>
                              <p className="text-sm text-text-secondary">{contact?.company || 'No Company'}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-success">${deal.value.toLocaleString()}</p>
                          </td>
                          <td className="p-4">
                            <span className={`status-badge status-${deal.stage}`}>{deal.stage}</span>
                          </td>
                          <td className="p-4">
                            <p className="text-text-primary">{deal.probability}%</p>
                          </td>
                          <td className="p-4">
                            <p className="text-text-secondary">{new Date(deal.expectedCloseDate).toLocaleDateString()}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-text-primary">{deal.assignedTo}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditDeal(deal)}
                                icon="Edit"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDeal(deal.Id)}
                                icon="Trash2"
                                className="text-error hover:text-error hover:bg-error/10"
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <Empty
            title={searchTerm ? "No deals found" : "No deals yet"}
            description={
              searchTerm
                ? `No deals match "${searchTerm}". Try adjusting your search.`
                : "Start building your sales pipeline by adding your first deal."
            }
            icon={searchTerm ? "Search" : "DollarSign"}
            actionLabel={searchTerm ? undefined : "Add First Deal"}
            onAction={searchTerm ? undefined : handleAddDeal}
          />
        )}
      </motion.div>
    </div>
  )
}

export default Deals