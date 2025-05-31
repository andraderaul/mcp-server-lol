import type { Match } from "./match.entity.js";

export type EventState = "completed" | "unstarted" | "inProgress";
export type EventType = "match" | "show";

export interface EventLeague {
  name: string;
  slug: string;
}

export class Event {
  constructor(
    public readonly startTime: string,
    public readonly state: EventState,
    public readonly type: EventType,
    public readonly blockName: string,
    public readonly league: EventLeague,
    public readonly match?: Match
  ) {}

  public isMatchEvent(): boolean {
    return this.type === "match" && this.match !== undefined;
  }

  public isShowEvent(): boolean {
    return this.type === "show";
  }

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
    if (!this.match) {
      throw new Error("Cannot get match ID for show events");
    }
    return this.match.id;
  }

  public getTeamNames(): string[] {
    if (!this.match) {
      throw new Error("Cannot get team names for show events");
    }
    return this.match.teams.map((team) => team.name);
  }

  public getTeamCodes(): string[] {
    if (!this.match) {
      throw new Error("Cannot get team codes for show events");
    }
    return this.match.teams.map((team) => team.code);
  }

  public isBestOfMatch(): boolean {
    if (!this.match) {
      throw new Error("Cannot check best of match for show events");
    }
    return this.match.isBestOfSeries();
  }
}

// Type guard to narrow Event to MatchEvent
export function isMatchEvent(event: Event): event is MatchEvent {
  return event.isMatchEvent();
}

// Type that guarantees the event has a match
export type MatchEvent = Event & {
  readonly match: Match;
  readonly type: "match";
};
