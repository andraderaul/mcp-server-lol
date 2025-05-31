// Data Transfer Objects - Types that come from the LoL Esports API

// Base interface for common event properties
interface BaseEvent {
  startTime: string;
  state: "completed" | "unstarted" | "inProgress";
  blockName: string;
  league: {
    name: string;
    slug: string;
  };
}

// Event with match (type: "match")
interface MatchEvent extends BaseEvent {
  type: "match";
  match: {
    id: string;
    flags: string[];
    teams: Array<{
      name: string;
      code: string;
      image: string;
      result: {
        outcome: "win" | "loss" | null;
        gameWins: number;
      };
      record: {
        wins: number;
        losses: number;
      };
    }>;
    strategy: {
      type: string;
      count: number;
    };
  };
}

// Event without match (type: "show")
interface ShowEvent extends BaseEvent {
  type: "show";
  match?: never; // Explicitly indicate match shouldn't exist for show events
}

// Union type for all possible events
export type Event = MatchEvent | ShowEvent;

export interface ScheduleResponse {
  data: {
    schedule: {
      pages: {
        older?: string;
        newer?: string;
      };
      events: Event[];
    };
  };
}

export interface LiveResponse {
  data: {
    schedule: {
      events: Event[];
    };
  };
}

export interface EventDetailsResponse {
  data: {
    event: {
      id: string;
      type: string;
      tournament: {
        id: string;
      };
      league: {
        id: string;
        slug: string;
        image: string;
        name: string;
      };
      match: {
        strategy: {
          count: number;
        };
        teams: Array<{
          id: string;
          name: string;
          code: string;
          image: string;
          result: {
            gameWins: number;
          };
        }>;
        games: Array<{
          number: number;
          id: string;
          state: "completed" | "unstarted" | "inProgress";
          teams: Array<{
            id: string;
            side: "blue" | "red";
          }>;
          vods: Array<VODResponse>;
        }>;
      };
      streams: unknown[];
    };
  };
}

export interface LeaguesResponse {
  data: {
    leagues: Array<{
      id: string;
      slug: string;
      name: string;
      region: string;
      image: string;
      priority: number;
      displayPriority: {
        position: number;
        status: "force_selected" | "selected" | "not_selected" | "hidden";
      };
    }>;
  };
}

export interface VODResponse {
  id: string;
  parameter: string;
  locale: string;
  mediaLocale: {
    locale: string;
    englishName: string;
    translatedName: string;
  };
  provider: string;
  offset: number;
  firstFrameTime: string;
  startMillis: number | null;
  endMillis: number | null;
}
