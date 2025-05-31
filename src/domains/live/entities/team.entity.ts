export interface TeamResult {
  outcome: "win" | "loss" | null;
  gameWins: number;
}

export interface TeamRecord {
  wins: number;
  losses: number;
}

export class Team {
  constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly image: string,
    public readonly result: TeamResult,
    public readonly record: TeamRecord
  ) {}

  public hasWon(): boolean {
    return this.result.outcome === "win";
  }

  public hasLost(): boolean {
    return this.result.outcome === "loss";
  }

  public isMatchCompleted(): boolean {
    return this.result.outcome !== null;
  }

  public getWinRate(): number {
    const totalGames = this.record.wins + this.record.losses;
    return totalGames > 0 ? this.record.wins / totalGames : 0;
  }

  public getWinRatePercentage(): string {
    return `${(this.getWinRate() * 100).toFixed(1)}%`;
  }

  public getTotalGamesPlayed(): number {
    return this.record.wins + this.record.losses;
  }
}
