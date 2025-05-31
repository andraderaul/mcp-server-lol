import type { LiveDatasource } from "../data/live-datasource.interface.js";
import type { VODResponse, EventDetailsResponse } from "../data/dto.js";

export class GetEventDetailsUseCase {
  constructor(private datasource: LiveDatasource) {}

  async execute(
    eventId: string,
    language = "en-US"
  ): Promise<EventDetailsResponse["data"]["event"]> {
    try {
      const response = await this.datasource.getEventDetails(eventId, language);
      return response.data.event;
    } catch (error) {
      console.error("Error in GetEventDetailsUseCase:", error);
      throw new Error(`Failed to get event details for ${eventId}`);
    }
  }

  async getMatchVODs(
    eventId: string,
    language = "en-US"
  ): Promise<VODResponse[]> {
    try {
      const eventDetails = await this.execute(eventId, language);
      const allVODs: VODResponse[] = [];

      // Business logic: collect all VODs from all games
      for (const game of eventDetails.match.games) {
        allVODs.push(...game.vods);
      }

      return allVODs;
    } catch (error) {
      console.error("Error in GetEventDetailsUseCase.getMatchVODs:", error);
      throw new Error(`Failed to get VODs for event ${eventId}`);
    }
  }

  async hasVODs(eventId: string, language = "en-US"): Promise<boolean> {
    const vods = await this.getMatchVODs(eventId, language);
    return vods.length > 0;
  }

  async getVODsByLocale(
    eventId: string,
    locale: string,
    language = "en-US"
  ): Promise<VODResponse[]> {
    const vods = await this.getMatchVODs(eventId, language);
    return vods.filter((vod) => vod.locale === locale);
  }
}
