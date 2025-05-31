import type { HttpClient } from "../../core/http-client.js";
import type { Cache } from "../../core/cache/cache.interface.js";
import { LiveDatasourceImpl } from "./data/live-datasource.js";

// Use Cases
import { GetScheduleUseCase } from "./usecases/get-schedule.usecase.js";
import { GetUpcomingMatchesUseCase } from "./usecases/get-upcoming-matches.usecase.js";
import { GetLiveMatchesUseCase } from "./usecases/get-live-matches.usecase.js";
import { GetLeaguesUseCase } from "./usecases/get-leagues.usecase.js";
import { GetMatchesForLeagueUseCase } from "./usecases/get-matches-for-league.usecase.js";
import { GetEventDetailsUseCase } from "./usecases/get-event-details.usecase.js";
import { CheckLiveMatchesUseCase } from "./usecases/check-live-matches.usecase.js";
import { CachedLiveDatasourceImpl } from "./data/cached-live-datasource.js";

/**
 * Factory function for Live Domain dependency injection
 * Creates the complete Live domain with all use cases properly wired
 */
export function createLiveDomain(httpClient: HttpClient, cache: Cache) {
  // Create datasource
  const datasource = new LiveDatasourceImpl(httpClient);
  const cachedDatasource = new CachedLiveDatasourceImpl(datasource, cache);

  // Create use cases with datasource injection
  return {
    usecases: {
      getSchedule: new GetScheduleUseCase(cachedDatasource),
      getUpcomingMatches: new GetUpcomingMatchesUseCase(cachedDatasource),
      getLiveMatches: new GetLiveMatchesUseCase(cachedDatasource),
      getLeagues: new GetLeaguesUseCase(cachedDatasource),
      getMatchesForLeague: new GetMatchesForLeagueUseCase(cachedDatasource),
      getEventDetails: new GetEventDetailsUseCase(cachedDatasource),
      checkLiveMatches: new CheckLiveMatchesUseCase(cachedDatasource),
    },
    // Export datasource if needed for direct access
    datasource,
    cachedDatasource,
  };
}

// Export types that might be needed by consumers
export type LiveDomain = ReturnType<typeof createLiveDomain>;
