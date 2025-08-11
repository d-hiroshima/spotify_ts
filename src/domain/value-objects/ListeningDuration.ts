export class ListeningDuration {
  constructor(private readonly milliseconds: number) {
    if (milliseconds < 0) {
      throw new Error('Duration cannot be negative')
    }
  }

  static fromMilliseconds(ms: number): ListeningDuration {
    return new ListeningDuration(ms)
  }

  getMilliseconds(): number {
    return this.milliseconds
  }

  getSeconds(): number {
    return Math.floor(this.milliseconds / 1000)
  }

  getMinutes(): number {
    return Math.floor(this.milliseconds / (1000 * 60))
  }

  getHours(): number {
    return Math.floor(this.milliseconds / (1000 * 60 * 60))
  }

  isSkipped(trackDuration: number): boolean {
    // Consider a track skipped if played less than 30 seconds or less than 50% of duration
    return this.milliseconds < 30000 || this.milliseconds < trackDuration * 0.5
  }
}