import type { Match } from "./match.entity.js";

export type EventState = "completed" | "unstarted" | "inProgress";

export interface EventLeague {
  name: string;
  slug: string;
}

export class Event {
  constructor(
    public readonly startTime: string,
    public readonly state: EventState,
    public readonly type: string,
    public readonly blockName: string,
    public readonly league: EventLeague,
    public readonly match: Match
  ) {}

  public isLive(): boolean {
    return this.state === "inProgress";
  }

  public isUpcoming(): boolean {
    return this.state === "unstarted";
  }

  public isCompleted(): boolean {
    return this.state === "completed";
  }

  public hasStarted(): boolean {
    return new Date(this.startTime) <= new Date();
  }

  public getStartTime(): Date {
    return new Date(this.startTime);
  }

  public getTimeUntilStart(): number {
    const now = new Date();
    const start = this.getStartTime();
    return start.getTime() - now.getTime();
  }

  public getTimeUntilStartInMinutes(): number {
    return Math.floor(this.getTimeUntilStart() / (1000 * 60));
  }

  public getTimeUntilStartInHours(): number {
    return Math.floor(this.getTimeUntilStart() / (1000 * 60 * 60));
  }

  public isStartingSoon(minutesThreshold = 30): boolean {
    if (!this.isUpcoming()) return false;

    const minutesUntilStart = this.getTimeUntilStartInMinutes();
    return minutesUntilStart <= minutesThreshold && minutesUntilStart >= 0;
  }

  public getFormattedStartTime(): string {
    return this.getStartTime().toISOString();
  }

  public isLeagueMatch(leagueSlug: string): boolean {
    return this.league.slug.toLowerCase() === leagueSlug.toLowerCase();
  }

  public getMatchId(): string {
    return this.match.id;
  }

  public getTeamNames(): string[] {
    return this.match.teams.map((team) => team.name);
  }

  public getTeamCodes(): string[] {
    return this.match.teams.map((team) => team.code);
  }

  public isBestOfMatch(): boolean {
    return this.match.isBestOfSeries();
  }
}
