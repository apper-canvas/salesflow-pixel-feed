import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import ContactTable from '@/components/organisms/ContactTable'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { contactService } from '@/services/api/contactService'
import { toast } from 'react-toastify'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const loadContacts = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await contactService.getAll()
      setContacts(data)
      setFilteredContacts(data)
    } catch (err) {
      setError('Failed to load contacts. Please try again.')
      console.error('Contacts loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredContacts(contacts)
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredContacts(filtered)
    }
  }, [searchTerm, contacts])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleEdit = (contact) => {
    console.log('Edit contact:', contact)
    // Implement edit modal/form
  }

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.delete(contactId)
        toast.success('Contact deleted successfully')
        loadContacts()
      } catch (err) {
        toast.error('Failed to delete contact')
      }
    }
  }

  const handleAddContact = () => {
    console.log('Add new contact')
    // Implement add contact modal/form
  }

  const handleImportContacts = () => {
    console.log('Import contacts from CSV')
    // Implement CSV import functionality
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadContacts} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Contacts
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your customer relationships and contact information.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={handleImportContacts}
            icon="Upload"
          >
            Import CSV
          </Button>
          <Button
            variant="primary"
            onClick={handleAddContact}
            icon="Plus"
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between space-x-4"
      >
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search contacts by name, email, company, or tags..."
        />
        <div className="flex items-center space-x-2">
          <Button variant="ghost" icon="Filter">
            Filter
          </Button>
          <Button variant="ghost" icon="Download">
            Export
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-primary font-medium">Total Contacts</p>
          <p className="text-2xl font-bold text-primary">{contacts.length}</p>
        </div>
        <div className="bg-gradient-to-r from-success/10 to-accent-light/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-success font-medium">This Month</p>
          <p className="text-2xl font-bold text-success">
            {contacts.filter(c => {
              const monthAgo = new Date()
              monthAgo.setMonth(monthAgo.getMonth() - 1)
              return new Date(c.createdAt) > monthAgo
            }).length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-warning/10 to-yellow-400/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-warning font-medium">Companies</p>
          <p className="text-2xl font-bold text-warning">
            {new Set(contacts.map(c => c.company)).size}
          </p>
        </div>
        <div className="bg-gradient-to-r from-info/10 to-blue-400/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-info font-medium">Showing</p>
          <p className="text-2xl font-bold text-info">{filteredContacts.length}</p>
        </div>
      </motion.div>

      {/* Contacts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredContacts.length > 0 ? (
          <ContactTable
            contacts={filteredContacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <Empty
            title={searchTerm ? "No contacts found" : "No contacts yet"}
            description={
              searchTerm
                ? `No contacts match "${searchTerm}". Try adjusting your search.`
                : "Start building your customer database by adding your first contact."
            }
            icon={searchTerm ? "Search" : "Users"}
            actionLabel={searchTerm ? undefined : "Add First Contact"}
            onAction={searchTerm ? undefined : handleAddContact}
          />
        )}
      </motion.div>
    </div>
  )
}

export default Contacts