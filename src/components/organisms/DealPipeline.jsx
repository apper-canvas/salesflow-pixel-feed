import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { format } from 'date-fns'

const DealPipeline = ({ deals, onUpdateDeal, onEditDeal, onDeleteDeal }) => {
  const stages = [
    { name: 'New', key: 'new', color: 'info' },
    { name: 'Qualified', key: 'qualified', color: 'primary' },
    { name: 'Proposal', key: 'proposal', color: 'warning' },
    { name: 'Negotiation', key: 'negotiation', color: 'secondary' },
    { name: 'Won', key: 'won', color: 'success' },
    { name: 'Lost', key: 'lost', color: 'error' },
  ]

  const [draggedDeal, setDraggedDeal] = useState(null)

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Sales Pipeline</h2>
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
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    whileHover={{ scale: 1.02 }}
                    className="card cursor-move hover:shadow-md"
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
  )
}

export default DealPipeline