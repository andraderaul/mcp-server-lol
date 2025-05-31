import type { LiveDatasource } from "../data/live-datasource.interface.js";
import type { Event } from "../entities/event.entity.js";
import { GetScheduleUseCase } from "./get-schedule.usecase.js";

export class GetMatchesForLeagueUseCase {
  private getScheduleUseCase: GetScheduleUseCase;

  constructor(private datasource: LiveDatasource) {
    this.getScheduleUseCase = new GetScheduleUseCase(datasource);
  }

  async execute(leagueSlug: string, language = "en-US"): Promise<Event[]> {
    try {
      const schedule = await this.getScheduleUseCase.execute(language);

      // Business logic: filter events by league slug
      return schedule.events.filter((event) => event.isLeagueMatch(leagueSlug));
    } catch (error) {
      console.error("Error in GetMatchesForLeagueUseCase:", error);
      throw new Error(`Failed to get matches for league ${leagueSlug}`);
    }
  }

  async getUpcomingForLeague(
    leagueSlug: string,
    language = "en-US"
  ): Promise<Event[]> {
    const matches = await this.execute(leagueSlug, language);
    return matches.filter((event) => event.isUpcoming());
  }

  async getLiveForLeague(
    leagueSlug: string,
    language = "en-US"
  ): Promise<Event[]> {
    const matches = await this.execute(leagueSlug, language);
    return matches.filter((event) => event.isLive());
  }

  async getCompletedForLeague(
    leagueSlug: string,
    language = "en-US"
  ): Promise<Event[]> {
    const matches = await this.execute(leagueSlug, language);
    return matches.filter((event) => event.isCompleted());
  }
}
