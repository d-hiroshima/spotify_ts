export class TrackId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('TrackId cannot be empty')
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: TrackId): boolean {
    return this.value === other.value
  }
}