import contactsData from '../mockData/contacts.json'

class ContactService {
  constructor() {
    this.contacts = [...contactsData]
    this.delay = 300 // Realistic API delay
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delay))
  }

  async getAll() {
    await this.delay()
    return [...this.contacts]
  }

  async getById(id) {
    await this.delay()
    const contact = this.contacts.find(c => c.Id === id)
    if (!contact) {
      throw new Error('Contact not found')
    }
    return { ...contact }
  }

  async create(contactData) {
    await this.delay()
    const newId = Math.max(...this.contacts.map(c => c.Id)) + 1
    const newContact = {
      Id: newId,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.contacts.push(newContact)
    return { ...newContact }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.contacts.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    this.contacts[index] = {
      ...this.contacts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return { ...this.contacts[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.contacts.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    const deletedContact = this.contacts.splice(index, 1)[0]
    return { ...deletedContact }
  }
}

export const contactService = new ContactService()