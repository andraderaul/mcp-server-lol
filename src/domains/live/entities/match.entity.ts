import type { Team } from "./team.entity.js";

export interface MatchStrategy {
  type: string;
  count: number;
}

export class Match {
  constructor(
    public readonly id: string,
    public readonly teams: Team[],
    public readonly strategy: MatchStrategy,
    public readonly flags: string[]
  ) {}

  public isCompleted(): boolean {
    return this.teams.some((team) => team.isMatchCompleted());
  }

  public getWinner(): Team | null {
    return this.teams.find((team) => team.hasWon()) || null;
  }

  public getLoser(): Team | null {
    return this.teams.find((team) => team.hasLost()) || null;
  }

  public isBestOfSeries(): boolean {
    return this.strategy.count > 1;
  }

  public getBestOfCount(): number {
    return this.strategy.count;
  }

  public getSeriesType(): string {
    const count = this.strategy.count;
    if (count === 1) return "Best of 1";
    if (count === 3) return "Best of 3";
    if (count === 5) return "Best of 5";
    return `Best of ${count}`;
  }

  public getCurrentScore(): string {
    if (!this.isCompleted()) return "0-0";

    const team1Score = this.teams[0]?.result.gameWins || 0;
    const team2Score = this.teams[1]?.result.gameWins || 0;

    return `${team1Score}-${team2Score}`;
  }

  /** Keep this method for now, but we should remove it later */
  public getMatchTitle(): string {
    const team1 = this.teams[0]?.name || "TBD";
    const team2 = this.teams[1]?.name || "TBD";

    return `${team1} vs ${team2} - ${this.getSeriesType()}`;
  }

  public hasFlag(flag: string): boolean {
    return this.flags.includes(flag);
  }

  public isPlayoffMatch(): boolean {
    return this.hasFlag("playoff") || this.hasFlag("playoffs");
  }

  public isRegularSeasonMatch(): boolean {
    return this.hasFlag("regular_season");
  }

  public getTeamByName(teamName: string): Team | null {
    return (
      this.teams.find(
        (team) =>
          team.name.toLowerCase() === teamName.toLowerCase() ||
          team.code.toLowerCase() === teamName.toLowerCase()
      ) || null
    );
  }
}
