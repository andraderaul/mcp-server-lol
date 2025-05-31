import type { LiveDatasource } from "../data/live-datasource.interface.js";
import type { Event, MatchEvent } from "../entities/event.entity.js";
import { isMatchEvent } from "../entities/event.entity.js";
import { mapEventFromLiveDTO } from "../data/mappers.js";

export class GetLiveMatchesUseCase {
  constructor(private datasource: LiveDatasource) {}

  async execute(language = "en-US"): Promise<Event[]> {
    try {
      const response = await this.datasource.getLive(language);

      // Transform DTO to domain entities using mappers
      const events = response.data.schedule.events.map(mapEventFromLiveDTO);

      // Business logic: only return events that are actually live
      return events.filter((event) => event.isLive());
    } catch (error) {
      console.error("Error in GetLiveMatchesUseCase:", error);
      throw new Error("Failed to get live matches");
    }
  }

  async getLiveMatchEventsOnly(language = "en-US"): Promise<MatchEvent[]> {
    try {
      const liveEvents = await this.execute(language);

      // Business logic: filter only live match events (not shows)
      return liveEvents.filter(isMatchEvent);
    } catch (error) {
      console.error(
        "Error in GetLiveMatchesUseCase.getLiveMatchEventsOnly:",
        error
      );
      throw new Error("Failed to get live match events");
    }
  }

  async getLiveMatchScore(
    teamName: string,
    language: string
  ): Promise<{ eventId: string; title: string; score: string }[]> {
    const liveMatchEvents = await this.getLiveMatchEventsOnly(language);

    // Filter matches that have the specified team
    const liveMatchesForTeam = liveMatchEvents.filter((event) =>
      Boolean(event.match.getTeamByName(teamName))
    );

    // No need for additional checks - TypeScript guarantees event.match exists
    return liveMatchesForTeam.map((event) => ({
      eventId: event.match.id,
      title: event.match.getMatchTitle(),
      score: event.match.getLiveScore(),
    }));
  }
}
