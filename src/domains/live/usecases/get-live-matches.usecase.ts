import type { LiveDatasource } from "../data/live-datasource.interface.js";
import type { Event } from "../entities/event.entity.js";
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
}
