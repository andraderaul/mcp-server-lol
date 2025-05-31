import type { HttpClient } from "../../core/http-client.js";

// Types for LoL Esports API
interface League {
  name: string;
  slug: string;
}

export interface Team {
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
}

interface Match {
  id: string;
  flags: string[];
  teams: Team[];
  strategy: {
    type: string;
    count: number;
  };
}

interface Event {
  startTime: string;
  state: "completed" | "unstarted" | "inProgress";
  type: string;
  blockName: string;
  league: League;
  match: Match;
}

interface SchedulePages {
  older?: string;
  newer?: string;
}

interface Schedule {
  pages: SchedulePages;
  events: Event[];
}

interface ScheduleResponse {
  data: {
    schedule: Schedule;
  };
}

// Types for getLeagues endpoint
interface LeagueDetails {
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
}

interface LeaguesResponse {
  data: {
    leagues: LeagueDetails[];
  };
}

// Types for getLive endpoint
interface LiveResponse {
  data: {
    schedule: {
      events: Event[];
    };
  };
}

// Types for getEventDetails endpoint
interface EventTeam {
  id: string;
  name: string;
  code: string;
  image: string;
  result: {
    gameWins: number;
  };
}

interface GameTeam {
  id: string;
  side: "blue" | "red";
}

interface VOD {
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

interface Game {
  number: number;
  id: string;
  state: "completed" | "unstarted" | "inProgress";
  teams: GameTeam[];
  vods: VOD[];
}

interface EventMatch {
  strategy: {
    count: number;
  };
  teams: EventTeam[];
  games: Game[];
}

interface EventDetailsData {
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
  match: EventMatch;
  streams: unknown[];
}

interface EventDetailsResponse {
  data: {
    event: EventDetailsData;
  };
}

export default class LiveService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get the schedule of League of Legends esports matches
   */
  async getSchedule(language = "en-US", leagueId?: string): Promise<Schedule> {
    try {
      const response = await this.httpClient.get<ScheduleResponse>(
        `/persisted/gw/getSchedule?hl=${language}${
          leagueId ? `&leagueId=${leagueId}` : ""
        }`
      );

      return response.data.schedule;
    } catch (error) {
      console.error("Error fetching schedule:", error);
      throw new Error("Failed to fetch LoL esports schedule");
    }
  }

  /**
   * Get upcoming matches (not completed)
   */
  async getUpcomingMatches(language = "en-US"): Promise<Event[]> {
    const schedule = await this.getSchedule(language);
    return schedule.events.filter((event) => event.state !== "completed");
  }

  /**
   * Get completed matches
   */
  async getCompletedMatches(language = "en-US"): Promise<Event[]> {
    const schedule = await this.getSchedule(language);
    return schedule.events.filter((event) => event.state === "completed");
  }

  /**
   * Get matches for a specific league
   */
  async getMatchesForLeague(
    leagueSlug: string,
    language = "en-US"
  ): Promise<Event[]> {
    const schedule = await this.getSchedule(language);
    return schedule.events.filter((event) => event.league.slug === leagueSlug);
  }

  /**
   * Get live matches (in progress)
   */
  async getLiveMatches(language = "en-US"): Promise<Event[]> {
    const schedule = await this.getSchedule(language);
    return schedule.events.filter((event) => event.state === "inProgress");
  }

  /**
   * Get all available leagues from current schedule
   */
  async getAvailableLeagues(language = "en-US"): Promise<League[]> {
    const schedule = await this.getSchedule(language);
    const uniqueLeagues = new Map<string, League>();

    for (const event of schedule.events) {
      if (!uniqueLeagues.has(event.league.slug)) {
        uniqueLeagues.set(event.league.slug, event.league);
      }
    }

    return Array.from(uniqueLeagues.values());
  }

  /**
   * Get live events (currently happening)
   */
  async getLive(language = "en-US"): Promise<Event[]> {
    try {
      const response = await this.httpClient.get<LiveResponse>(
        `/persisted/gw/getLive?hl=${language}`
      );
      return response.data.schedule.events;
    } catch (error) {
      console.error("Error fetching live events:", error);
      throw new Error("Failed to fetch live LoL esports events");
    }
  }

  /**
   * Get detailed information about a specific event
   */
  async getEventDetails(
    eventId: string,
    language = "en-US"
  ): Promise<EventDetailsData> {
    try {
      const response = await this.httpClient.get<EventDetailsResponse>(
        `/persisted/gw/getEventDetails?hl=${language}&id=${eventId}`
      );
      return response.data.event;
    } catch (error) {
      console.error("Error fetching event details:", error);
      throw new Error(`Failed to fetch details for event ${eventId}`);
    }
  }

  /**
   * Get all available leagues with detailed information
   */
  async getLeagues(language = "en-US"): Promise<LeagueDetails[]> {
    try {
      const response = await this.httpClient.get<LeaguesResponse>(
        `/persisted/gw/getLeagues?hl=${language}`
      );
      return response.data.leagues;
    } catch (error) {
      console.error("Error fetching leagues:", error);
      throw new Error("Failed to fetch LoL esports leagues");
    }
  }

  /**
   * Get leagues by region
   */
  async getLeaguesByRegion(
    region: string,
    language = "en-US"
  ): Promise<LeagueDetails[]> {
    const leagues = await this.getLeagues(language);
    return leagues.filter((league) => league.region === region);
  }

  /**
   * Get leagues by status (selected, hidden, etc.)
   */
  async getLeaguesByStatus(
    status: "force_selected" | "selected" | "not_selected" | "hidden",
    language = "en-US"
  ): Promise<LeagueDetails[]> {
    const leagues = await this.getLeagues(language);
    return leagues.filter((league) => league.displayPriority.status === status);
  }

  /**
   * Get available regions
   */
  async getAvailableRegions(language = "en-US"): Promise<string[]> {
    const leagues = await this.getLeagues(language);
    const uniqueRegions = new Set<string>();

    for (const league of leagues) {
      uniqueRegions.add(league.region);
    }

    return Array.from(uniqueRegions);
  }

  /**
   * Check if there are any live matches currently
   */
  async hasLiveMatches(language = "en-US"): Promise<boolean> {
    const liveEvents = await this.getLive(language);
    return liveEvents.length > 0;
  }

  /**
   * Get event details with VODs for a specific match
   */
  async getMatchVODs(eventId: string, language = "en-US"): Promise<VOD[]> {
    const eventDetails = await this.getEventDetails(eventId, language);
    const allVODs: VOD[] = [];

    for (const game of eventDetails.match.games) {
      allVODs.push(...game.vods);
    }

    return allVODs;
  }
}
