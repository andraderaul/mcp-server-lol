// Data mappers - Convert DTOs to Domain Entities
import type {
  VODResponse,
  ScheduleResponse,
  LiveResponse,
  LeaguesResponse,
} from "./dto.js";
import { Event } from "../entities/event.entity.js";
import { Match } from "../entities/match.entity.js";
import { Team } from "../entities/team.entity.js";
import { League } from "../entities/league.entity.js";

export function mapVODFromDTO(dto: VODResponse): VODResponse {
  // For now, VOD DTO is the same as entity
  // But this could change in the future
  return dto;
}

// Map Team DTO to Team Entity
export function mapTeamFromDTO(
  teamData: ScheduleResponse["data"]["schedule"]["events"][0]["match"]["teams"][0]
): Team {
  return new Team(
    teamData.name,
    teamData.code,
    teamData.image,
    teamData.result,
    teamData.record
  );
}

// Map Match DTO to Match Entity
export function mapMatchFromDTO(
  matchData: ScheduleResponse["data"]["schedule"]["events"][0]["match"]
): Match {
  const teams = matchData.teams.map(mapTeamFromDTO);

  return new Match(matchData.id, teams, matchData.strategy, matchData.flags);
}

// Map Event DTO to Event Entity
export function mapEventFromDTO(
  eventData: ScheduleResponse["data"]["schedule"]["events"][0]
): Event {
  const match = mapMatchFromDTO(eventData.match);

  return new Event(
    eventData.startTime,
    eventData.state,
    eventData.type,
    eventData.blockName,
    eventData.league,
    match
  );
}

// Map Event from Live DTO to Event Entity (same structure as schedule)
export function mapEventFromLiveDTO(
  eventData: LiveResponse["data"]["schedule"]["events"][0]
): Event {
  // LiveResponse has the same structure as ScheduleResponse for events
  return mapEventFromDTO(
    eventData as ScheduleResponse["data"]["schedule"]["events"][0]
  );
}

// Map League DTO to League Entity
export function mapLeagueFromDTO(
  leagueData: LeaguesResponse["data"]["leagues"][0]
): League {
  return new League(
    leagueData.id,
    leagueData.slug,
    leagueData.name,
    leagueData.region,
    leagueData.image,
    leagueData.priority,
    leagueData.displayPriority
  );
}
