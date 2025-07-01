import activitiesData from '../mockData/activities.json'

class ActivityService {
  constructor() {
    this.activities = [...activitiesData]
this.delayMs = 300
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delayMs))
  }

  async getAll() {
    await this.delay()
    return [...this.activities]
  }

  async getById(id) {
    await this.delay()
    const activity = this.activities.find(a => a.Id === id)
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { ...activity }
  }

  async create(activityData) {
    await this.delay()
    const newId = Math.max(...this.activities.map(a => a.Id)) + 1
    const newActivity = {
      Id: newId,
      ...activityData,
      timestamp: new Date().toISOString()
    }
    this.activities.unshift(newActivity) // Add to beginning for chronological order
    return { ...newActivity }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.activities.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    this.activities[index] = {
      ...this.activities[index],
      ...updates
    }
    return { ...this.activities[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.activities.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    const deletedActivity = this.activities.splice(index, 1)[0]
    return { ...deletedActivity }
  }
}

export const activityService = new ActivityService()