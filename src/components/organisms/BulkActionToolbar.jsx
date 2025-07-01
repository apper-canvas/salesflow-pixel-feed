import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CSVLink } from 'react-csv'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'

const BulkActionToolbar = ({ 
  selectedItems, 
  onClearSelection, 
  onBulkDelete, 
  onBulkUpdate,
  entityType = 'items',
  updateFields = [],
  className = ''
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateData, setUpdateData] = useState({})

  const selectedCount = selectedItems.length

  if (selectedCount === 0) return null

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedCount} ${entityType}? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      await onBulkDelete(selectedItems.map(item => item.Id))
      toast.success(`Successfully deleted ${selectedCount} ${entityType}`)
      onClearSelection()
    } catch (error) {
      toast.error(`Failed to delete ${entityType}. Please try again.`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBulkUpdate = async () => {
    if (Object.keys(updateData).length === 0) {
      toast.warning('Please select fields to update')
      return
    }

    setIsUpdating(true)
    try {
      await onBulkUpdate(selectedItems.map(item => item.Id), updateData)
      toast.success(`Successfully updated ${selectedCount} ${entityType}`)
      setShowUpdateForm(false)
      setUpdateData({})
      onClearSelection()
    } catch (error) {
      toast.error(`Failed to update ${entityType}. Please try again.`)
    } finally {
      setIsUpdating(false)
    }
  }

  const getExportData = () => {
    return selectedItems.map(item => {
      const exportItem = { ...item }
      // Remove Id field from export for cleaner CSV
      delete exportItem.Id
      return exportItem
    })
  }

  const getExportHeaders = () => {
    if (selectedItems.length === 0) return []
    const firstItem = selectedItems[0]
    return Object.keys(firstItem)
      .filter(key => key !== 'Id')
      .map(key => ({ label: key.charAt(0).toUpperCase() + key.slice(1), key }))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{selectedCount}</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {selectedCount} {entityType} selected
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Export Action */}
              <CSVLink
                data={getExportData()}
                headers={getExportHeaders()}
                filename={`${entityType}-export-${new Date().toISOString().split('T')[0]}.csv`}
                className="inline-flex"
              >
                <Button variant="ghost" size="sm" icon="Download">
                  Export
                </Button>
              </CSVLink>

              {/* Update Action */}
              {updateFields.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Edit"
                  onClick={() => setShowUpdateForm(!showUpdateForm)}
                >
                  Update
                </Button>
              )}

              {/* Delete Action */}
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="text-error hover:text-error hover:bg-error/10"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onClearSelection}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        {/* Update Form */}
        <AnimatePresence>
          {showUpdateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {updateFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <Select
                        value={updateData[field.key] || ''}
                        onChange={(e) => setUpdateData(prev => ({
                          ...prev,
                          [field.key]: e.target.value
                        }))}
                        className="w-full"
                      >
                        <option value="">-- Select {field.label} --</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={updateData[field.key] || ''}
                        onChange={(e) => setUpdateData(prev => ({
                          ...prev,
                          [field.key]: e.target.value
                        }))}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowUpdateForm(false)
                    setUpdateData({})
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBulkUpdate}
                  disabled={isUpdating || Object.keys(updateData).length === 0}
                >
                  {isUpdating ? 'Updating...' : `Update ${selectedCount} ${entityType}`}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default BulkActionToolbar