import type { HttpClient } from "../../core/http-client.js";
import { LiveDatasourceImpl } from "./data/live-datasource.js";

// Use Cases
import { GetScheduleUseCase } from "./usecases/get-schedule.usecase.js";
import { GetUpcomingMatchesUseCase } from "./usecases/get-upcoming-matches.usecase.js";
import { GetLiveMatchesUseCase } from "./usecases/get-live-matches.usecase.js";
import { GetLeaguesUseCase } from "./usecases/get-leagues.usecase.js";
import { GetMatchesForLeagueUseCase } from "./usecases/get-matches-for-league.usecase.js";
import { GetEventDetailsUseCase } from "./usecases/get-event-details.usecase.js";
import { CheckLiveMatchesUseCase } from "./usecases/check-live-matches.usecase.js";

/**
 * Factory function for Live Domain dependency injection
 * Creates the complete Live domain with all use cases properly wired
 */
export function createLiveDomain(httpClient: HttpClient) {
  // Create datasource
  const datasource = new LiveDatasourceImpl(httpClient);

  // Create use cases with datasource injection
  return {
    usecases: {
      getSchedule: new GetScheduleUseCase(datasource),
      getUpcomingMatches: new GetUpcomingMatchesUseCase(datasource),
      getLiveMatches: new GetLiveMatchesUseCase(datasource),
      getLeagues: new GetLeaguesUseCase(datasource),
      getMatchesForLeague: new GetMatchesForLeagueUseCase(datasource),
      getEventDetails: new GetEventDetailsUseCase(datasource),
      checkLiveMatches: new CheckLiveMatchesUseCase(datasource),
    },
    // Export datasource if needed for direct access
    datasource,
  };
}

// Export types that might be needed by consumers
export type LiveDomain = ReturnType<typeof createLiveDomain>;
