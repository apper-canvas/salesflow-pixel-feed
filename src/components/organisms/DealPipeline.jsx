import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import BulkActionToolbar from '@/components/organisms/BulkActionToolbar'
import { format } from 'date-fns'

const DealPipeline = ({ deals, onUpdateDeal, onEditDeal, onDeleteDeal, onBulkUpdate, onBulkDelete }) => {
  const stages = [
    { name: 'New', key: 'new', color: 'info' },
    { name: 'Qualified', key: 'qualified', color: 'primary' },
    { name: 'Proposal', key: 'proposal', color: 'warning' },
    { name: 'Negotiation', key: 'negotiation', color: 'secondary' },
    { name: 'Won', key: 'won', color: 'success' },
    { name: 'Lost', key: 'lost', color: 'error' },
  ]
const [draggedDeal, setDraggedDeal] = useState(null)
  const [selectedDeals, setSelectedDeals] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage)
  }

  const getStageTotal = (stage) => {
    return getDealsByStage(stage).reduce((total, deal) => total + deal.value, 0)
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, newStage) => {
    e.preventDefault()
    if (draggedDeal && draggedDeal.stage !== newStage) {
      onUpdateDeal(draggedDeal.Id, { stage: newStage })
    }
    setDraggedDeal(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
}).format(amount)
  }

  const handleSelectDeal = (deal, selected) => {
    if (selected) {
      setSelectedDeals(prev => [...prev, deal])
    } else {
      setSelectedDeals(prev => prev.filter(d => d.Id !== deal.Id))
    }
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      setIsSelectionMode(true)
    }
  }

  const handleKeyUp = (e) => {
    if (!e.ctrlKey && !e.metaKey) {
      setIsSelectionMode(false)
    }
  }

  const isSelected = (dealId) => {
    return selectedDeals.some(d => d.Id === dealId)
  }

  const handleBulkDelete = async (dealIds) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    dealIds.forEach(id => onDeleteDeal(id))
  }

  const handleBulkUpdate = async (dealIds, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.info('Bulk update functionality would be implemented with backend integration')
  }

  const handleDealClick = (deal) => {
    if (isSelectionMode) {
      handleSelectDeal(deal, !isSelected(deal.Id))
    } else {
      onEditDeal(deal)
    }
  }

  const updateFields = [
    {
      key: 'stage',
      label: 'Stage',
      type: 'select',
      options: [
        { value: 'new', label: 'New' },
        { value: 'qualified', label: 'Qualified' },
        { value: 'proposal', label: 'Proposal' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'won', label: 'Won' },
        { value: 'lost', label: 'Lost' }
      ]
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      type: 'select',
      options: [
        { value: 'john-doe', label: 'John Doe' },
        { value: 'jane-smith', label: 'Jane Smith' },
        { value: 'mike-johnson', label: 'Mike Johnson' }
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ]
    }
  ]

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
return (
    <div className="space-y-4">
      <BulkActionToolbar
        selectedItems={selectedDeals}
        onClearSelection={() => setSelectedDeals([])}
        onBulkDelete={handleBulkDelete}
        onBulkUpdate={handleBulkUpdate}
        entityType="deals"
        updateFields={updateFields}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-text-primary">Sales Pipeline</h2>
            {isSelectionMode && (
              <Badge variant="info" size="sm" className="animate-pulse">
                Selection Mode - Click deals to select
              </Badge>
            )}
          </div>
          <div className="text-sm text-text-secondary">
            Total Pipeline Value: {formatCurrency(deals.reduce((total, deal) => total + deal.value, 0))}
          </div>
        </div>
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.key)
          const stageTotal = getStageTotal(stage.key)

          return (
            <div
              key={stage.key}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.key)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-text-primary flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 bg-${stage.color}`}></div>
                    {stage.name}
                    <Badge variant="default" size="sm" className="ml-2">
                      {stageDeals.length}
                    </Badge>
                  </h3>
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  {formatCurrency(stageTotal)}
                </p>
              </div>

              <div className="space-y-3 min-h-[400px]">
{stageDeals.map((deal) => (
                  <motion.div
                    key={deal.Id}
                    draggable={!isSelectionMode}
                    onDragStart={(e) => handleDragStart(e, deal)}
                    whileHover={{ scale: 1.02 }}
                    className={`card hover:shadow-md transition-colors ${
                      isSelectionMode ? 'cursor-pointer' : 'cursor-move'
                    } ${isSelected(deal.Id) ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                    onClick={() => handleDealClick(deal)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-text-primary text-sm">
                        {deal.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditDeal(deal)}
                          className="p-1"
                        >
                          <ApperIcon name="Edit" className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteDeal(deal.Id)}
                          className="p-1 text-error hover:text-error"
                        >
                          <ApperIcon name="Trash2" className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-success">
                          {formatCurrency(deal.value)}
                        </span>
                        <Badge variant={stage.key} size="sm">
                          {deal.probability}%
                        </Badge>
                      </div>

                      <div className="flex items-center text-sm text-text-secondary">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                        {format(new Date(deal.expectedCloseDate), 'MMM dd')}
                      </div>

                      <div className="flex items-center text-sm text-text-secondary">
                        <ApperIcon name="User" className="w-4 h-4 mr-1" />
                        {deal.assignedTo}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-text-secondary text-sm">Drop deals here</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
</div>
      </div>
    </div>
  )
}

export default DealPipeline