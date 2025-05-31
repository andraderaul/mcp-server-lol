import type { LiveDatasource } from "../data/live-datasource.interface.js";
import type { Event } from "../entities/event.entity.js";
import { GetScheduleUseCase } from "./get-schedule.usecase.js";

export class GetUpcomingMatchesUseCase {
  private getScheduleUseCase: GetScheduleUseCase;

  constructor(private datasource: LiveDatasource) {
    this.getScheduleUseCase = new GetScheduleUseCase(datasource);
  }

  async execute(language = "en-US", limit = 10): Promise<Event[]> {
    try {
      const schedule = await this.getScheduleUseCase.execute(language);

      // Business logic: filter upcoming events and apply limit
      const upcomingEvents = schedule.events
        .filter((event) => event.isUpcoming())
        .sort((a, b) => a.getStartTime().getTime() - b.getStartTime().getTime())
        .slice(0, limit);

      return upcomingEvents;
    } catch (error) {
      console.error("Error in GetUpcomingMatchesUseCase:", error);
      throw new Error("Failed to get upcoming matches");
    }
  }
}
