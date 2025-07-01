import tasksData from '../mockData/tasks.json'

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
    this.delay = 300
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.delay))
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(t => t.Id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay()
    const newId = Math.max(...this.tasks.map(t => t.Id)) + 1
    const newTask = {
      Id: newId,
      ...taskData,
      completed: false
    }
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    this.tasks[index] = {
      ...this.tasks[index],
      ...updates
    }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    const deletedTask = this.tasks.splice(index, 1)[0]
    return { ...deletedTask }
  }
}

export const taskService = new TaskService()