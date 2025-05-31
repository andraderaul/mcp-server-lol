import type { LiveDatasource } from "../data/live-datasource.interface.js";
import type { Event, MatchEvent } from "../entities/event.entity.js";
import { isMatchEvent } from "../entities/event.entity.js";
import { mapEventFromDTO } from "../data/mappers.js";

export interface ScheduleData {
  pages: {
    older?: string;
    newer?: string;
  };
  events: Event[];
}

export class GetScheduleUseCase {
  constructor(private datasource: LiveDatasource) {}

  async execute(language = "en-US", leagueId?: string): Promise<ScheduleData> {
    try {
      const response = await this.datasource.getSchedule(language, leagueId);

      // Transform DTO to domain entities using mappers
      const events = response.data.schedule.events.map(mapEventFromDTO);

      return {
        pages: response.data.schedule.pages,
        events,
      };
    } catch (error) {
      console.error("Error in GetScheduleUseCase:", error);
      throw new Error("Failed to get schedule");
    }
  }

  async getMatchEventsOnly(
    language = "en-US",
    leagueId?: string
  ): Promise<MatchEvent[]> {
    try {
      const schedule = await this.execute(language, leagueId);

      // Business logic: filter only match events (not shows)
      return schedule.events.filter(isMatchEvent);
    } catch (error) {
      console.error("Error in GetScheduleUseCase.getMatchEventsOnly:", error);
      throw new Error("Failed to get schedule match events");
    }
  }
}
