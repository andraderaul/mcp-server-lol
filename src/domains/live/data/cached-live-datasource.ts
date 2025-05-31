// src/domains/live/data/cached-live-datasource.ts
import type { Cache } from "../../../core/cache/cache.interface.js";
import type { LiveDatasource } from "./live-datasource.interface.js";
import type {
  ScheduleResponse,
  LiveResponse,
  EventDetailsResponse,
  LeaguesResponse,
} from "./dto.js";
import { times } from "../../../core/constants/times.js";

const CACHE_TTL = {
  STATIC: times.DAY * 1,
  DYNAMIC: times.MINUTES * 5,
  LIVE: times.SECONDS * 30,
  HISTORICAL: times.DAYS * 7,
} as const;

export class CachedLiveDatasourceImpl implements LiveDatasource {
  constructor(private datasource: LiveDatasource, private cache: Cache) {}

  async getSchedule(
    language = "en-US",
    leagueId?: string
  ): Promise<ScheduleResponse> {
    const cacheKey = `schedule:${language}:${leagueId || "all"}`;

    // Try cache first
    const cached = await this.cache.get<ScheduleResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Cache miss - fetch from API
    const result = await this.datasource.getSchedule(language, leagueId);

    // Cache with dynamic TTL
    await this.cache.set(cacheKey, result, CACHE_TTL.DYNAMIC);

    return result;
  }

  async getLive(language = "en-US"): Promise<LiveResponse> {
    const cacheKey = `live:${language}`;

    const cached = await this.cache.get<LiveResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.datasource.getLive(language);

    // Short TTL for live data
    await this.cache.set(cacheKey, result, CACHE_TTL.LIVE);

    return result;
  }

  async getEventDetails(
    eventId: string,
    language = "en-US"
  ): Promise<EventDetailsResponse> {
    const cacheKey = `event:${eventId}:${language}`;

    const cached = await this.cache.get<EventDetailsResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.datasource.getEventDetails(eventId, language);

    // Long TTL for historical data
    await this.cache.set(cacheKey, result, CACHE_TTL.HISTORICAL);

    return result;
  }

  async getLeagues(language = "en-US"): Promise<LeaguesResponse> {
    const cacheKey = `leagues:${language}`;

    const cached = await this.cache.get<LeaguesResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.datasource.getLeagues(language);

    // Very long TTL for static data
    await this.cache.set(cacheKey, result, CACHE_TTL.STATIC);

    return result;
  }
}
