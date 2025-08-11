export class DateRange {
  constructor(
    private readonly startDate: Date,
    private readonly endDate: Date
  ) {
    if (startDate > endDate) {
      throw new Error('Start date must be before end date')
    }
  }

  static fromPeriod(period: 'week' | 'month' | 'year'): DateRange {
    const endDate = new Date()
    const startDate = new Date()

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    return new DateRange(startDate, endDate)
  }

  getStartDate(): Date {
    return this.startDate
  }

  getEndDate(): Date {
    return this.endDate
  }

  contains(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate
  }

  getDaysCount(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}