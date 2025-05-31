// Data mappers - Convert DTOs to Domain Entities
import type {
  VODResponse,
  ScheduleResponse,
  LiveResponse,
  LeaguesResponse,
  Event as EventDTO,
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

// Type guard to check if event has match
function isMatchEvent(event: EventDTO): event is EventDTO & {
  type: "match";
  match: NonNullable<EventDTO["match"]>;
} {
  return event.type === "match" && "match" in event;
}

// Map Team DTO to Team Entity
export function mapTeamFromDTO(
  teamData: NonNullable<EventDTO["match"]>["teams"][0]
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
  matchData: NonNullable<EventDTO["match"]>
): Match {
  const teams = matchData.teams.map(mapTeamFromDTO);

  return new Match(matchData.id, teams, matchData.strategy, matchData.flags);
}

// Map Event DTO to Event Entity
export function mapEventFromDTO(eventData: EventDTO): Event {
  // For match events, map the match data
  if (isMatchEvent(eventData)) {
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

  // For show events, no match data
  return new Event(
    eventData.startTime,
    eventData.state,
    eventData.type,
    eventData.blockName,
    eventData.league
  );
}

// Map Event from Live DTO to Event Entity (same structure as schedule)
export function mapEventFromLiveDTO(
  eventData: LiveResponse["data"]["schedule"]["events"][0]
): Event {
  // LiveResponse has the same structure as ScheduleResponse for events
  return mapEventFromDTO(eventData);
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
