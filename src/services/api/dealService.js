import dealsData from '../mockData/deals.json'

class DealService {
  constructor() {
    this.deals = [...dealsData]
this.delayMs = 300
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delayMs))
  }

  async getAll() {
    await this.delay()
    return [...this.deals]
  }

  async getById(id) {
    await this.delay()
    const deal = this.deals.find(d => d.Id === id)
    if (!deal) {
      throw new Error('Deal not found')
    }
    return { ...deal }
  }

  async create(dealData) {
    await this.delay()
    const newId = Math.max(...this.deals.map(d => d.Id)) + 1
    const newDeal = {
      Id: newId,
      ...dealData,
      status: 'active'
    }
    this.deals.push(newDeal)
    return { ...newDeal }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.deals.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    this.deals[index] = {
      ...this.deals[index],
      ...updates
    }
    return { ...this.deals[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.deals.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    const deletedDeal = this.deals.splice(index, 1)[0]
    return { ...deletedDeal }
  }
}

export const dealService = new DealService()