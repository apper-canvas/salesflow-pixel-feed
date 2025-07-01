import leadsData from '../mockData/leads.json'

class LeadService {
  constructor() {
    this.leads = [...leadsData]
    this.delay = 300
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delay))
  }

  async getAll() {
    await this.delay()
    return [...this.leads]
  }

  async getById(id) {
    await this.delay()
    const lead = this.leads.find(l => l.Id === id)
    if (!lead) {
      throw new Error('Lead not found')
    }
    return { ...lead }
  }

  async create(leadData) {
    await this.delay()
    const newId = Math.max(...this.leads.map(l => l.Id)) + 1
    const newLead = {
      Id: newId,
      ...leadData,
      createdAt: new Date().toISOString()
    }
    this.leads.push(newLead)
    return { ...newLead }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.leads.findIndex(l => l.Id === id)
    if (index === -1) {
      throw new Error('Lead not found')
    }
    this.leads[index] = {
      ...this.leads[index],
      ...updates
    }
    return { ...this.leads[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.leads.findIndex(l => l.Id === id)
    if (index === -1) {
      throw new Error('Lead not found')
    }
    const deletedLead = this.leads.splice(index, 1)[0]
    return { ...deletedLead }
  }
}

export const leadService = new LeadService()