import type { HttpClient } from "../../../core/http-client.js";
import type { LiveDatasource } from "./live-datasource.interface.js";
import type {
  ScheduleResponse,
  LiveResponse,
  EventDetailsResponse,
  LeaguesResponse,
} from "./dto.js";

export class LiveDatasourceImpl implements LiveDatasource {
  constructor(private httpClient: HttpClient) {}

  async getSchedule(
    language = "en-US",
    leagueId?: string
  ): Promise<ScheduleResponse> {
    try {
      return await this.httpClient.get<ScheduleResponse>(
        `/persisted/gw/getSchedule?hl=${language}${
          leagueId ? `&leagueId=${leagueId}` : ""
        }`
      );
    } catch (error) {
      console.error("Error in LiveDatasource.getSchedule:", error);
      throw new Error("Failed to fetch schedule from API");
    }
  }

  async getLive(language = "en-US"): Promise<LiveResponse> {
    try {
      return await this.httpClient.get<LiveResponse>(
        `/persisted/gw/getLive?hl=${language}`
      );
    } catch (error) {
      console.error("Error in LiveDatasource.getLive:", error);
      throw new Error("Failed to fetch live matches from API");
    }
  }

  async getEventDetails(
    eventId: string,
    language = "en-US"
  ): Promise<EventDetailsResponse> {
    try {
      return await this.httpClient.get<EventDetailsResponse>(
        `/persisted/gw/getEventDetails?hl=${language}&id=${eventId}`
      );
    } catch (error) {
      console.error("Error in LiveDatasource.getEventDetails:", error);
      throw new Error("Failed to fetch event details from API");
    }
  }

  async getLeagues(language = "en-US"): Promise<LeaguesResponse> {
    try {
      return await this.httpClient.get<LeaguesResponse>(
        `/persisted/gw/getLeagues?hl=${language}`
      );
    } catch (error) {
      console.error("Error in LiveDatasource.getLeagues:", error);
      throw new Error("Failed to fetch leagues from API");
    }
  }
}
