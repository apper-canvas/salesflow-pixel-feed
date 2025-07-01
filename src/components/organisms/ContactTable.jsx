import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import BulkActionToolbar from '@/components/organisms/BulkActionToolbar'
import { format } from 'date-fns'

const ContactTable = ({ contacts, onEdit, onDelete, onBulkUpdate, onBulkDelete }) => {
  const navigate = useNavigate()
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedContacts, setSelectedContacts] = useState([])
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    const direction = sortDirection === 'asc' ? 1 : -1

    if (typeof aValue === 'string') {
      return aValue.localeCompare(bValue) * direction
    }
    return (aValue - bValue) * direction
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-gray-400" />
    return sortDirection === 'asc' 
      ? <ApperIcon name="ArrowUp" className="w-4 h-4 text-primary" />
      : <ApperIcon name="ArrowDown" className="w-4 h-4 text-primary" />
}

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedContacts(sortedContacts)
    } else {
      setSelectedContacts([])
    }
  }

  const handleSelectContact = (contact, checked) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contact])
    } else {
      setSelectedContacts(prev => prev.filter(c => c.Id !== contact.Id))
    }
  }

  const isSelected = (contactId) => {
    return selectedContacts.some(c => c.Id === contactId)
  }

  const isAllSelected = sortedContacts.length > 0 && selectedContacts.length === sortedContacts.length
  const isPartialSelected = selectedContacts.length > 0 && selectedContacts.length < sortedContacts.length

  const handleBulkDelete = async (contactIds) => {
    // Simulate bulk delete operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    contactIds.forEach(id => onDelete(id))
  }

  const handleBulkUpdate = async (contactIds, updateData) => {
    // Simulate bulk update operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In a real app, this would call the backend API
    toast.info('Bulk update functionality would be implemented with backend integration')
  }

  const updateFields = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'lead', label: 'Lead' },
        { value: 'customer', label: 'Customer' }
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

  return (
    <div className="space-y-4">
      <BulkActionToolbar
        selectedItems={selectedContacts}
        onClearSelection={() => setSelectedContacts([])}
        onBulkDelete={handleBulkDelete}
        onBulkUpdate={handleBulkUpdate}
        entityType="contacts"
        updateFields={updateFields}
      />
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-gray-200">
              <tr>
                <th className="text-left p-4 w-12">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isPartialSelected
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                  </div>
                </th>
                <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 font-medium text-text-primary hover:text-primary"
                >
                  <span>Name</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('company')}
                  className="flex items-center space-x-2 font-medium text-text-primary hover:text-primary"
                >
                  <span>Company</span>
                  <SortIcon field="company" />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="font-medium text-text-primary">Contact</span>
              </th>
              <th className="text-left p-4">
                <span className="font-medium text-text-primary">Tags</span>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center space-x-2 font-medium text-text-primary hover:text-primary"
                >
                  <span>Added</span>
                  <SortIcon field="createdAt" />
                </button>
              </th>
              <th className="text-right p-4">
                <span className="font-medium text-text-primary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
{sortedContacts.map((contact, index) => (
              <motion.tr
                key={contact.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  isSelected(contact.Id) ? 'bg-primary/5' : ''
                }`}
                onClick={() => navigate(`/contacts/${contact.Id}`)}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected(contact.Id)}
                      onChange={(e) => handleSelectContact(contact, e.target.checked)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{contact.name}</p>
                      <p className="text-sm text-text-secondary">{contact.position}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-medium text-text-primary">{contact.company}</p>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <p className="text-sm text-text-primary">{contact.email}</p>
                    <p className="text-sm text-text-secondary">{contact.phone}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {contact.tags.length > 2 && (
                      <Badge variant="default" size="sm">
                        +{contact.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-text-secondary">
                    {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(contact)
                      }}
                      icon="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(contact.Id)
                      }}
                      icon="Trash2"
                      className="text-error hover:text-error hover:bg-error/10"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
</table>
      </div>
    </div>
    </div>
  )
}

export default ContactTable