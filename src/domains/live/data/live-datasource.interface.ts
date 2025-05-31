import type {
  ScheduleResponse,
  LiveResponse,
  EventDetailsResponse,
  LeaguesResponse,
} from "./dto.js";

export interface LiveDatasource {
  getSchedule(language: string, leagueId?: string): Promise<ScheduleResponse>;
  getLive(language: string): Promise<LiveResponse>;
  getEventDetails(
    eventId: string,
    language: string
  ): Promise<EventDetailsResponse>;
  getLeagues(language: string): Promise<LeaguesResponse>;
}
