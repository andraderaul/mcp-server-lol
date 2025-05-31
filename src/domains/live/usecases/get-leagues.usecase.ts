import type { LiveDatasource } from "../data/live-datasource.interface.js";
import type { League } from "../entities/league.entity.js";
import { mapLeagueFromDTO } from "../data/mappers.js";

export class GetLeaguesUseCase {
  constructor(private datasource: LiveDatasource) {}

  async execute(language = "en-US"): Promise<League[]> {
    try {
      const response = await this.datasource.getLeagues(language);

      // Transform DTO to domain entities using mappers
      const leagues = response.data.leagues.map(mapLeagueFromDTO);

      return leagues;
    } catch (error) {
      console.error("Error in GetLeaguesUseCase:", error);
      throw new Error("Failed to get leagues");
    }
  }

  async getByRegion(region: string, language = "en-US"): Promise<League[]> {
    const leagues = await this.execute(language);
    return leagues.filter((league) => league.region === region);
  }

  async getByStatus(
    status: "force_selected" | "selected" | "not_selected" | "hidden",
    language = "en-US"
  ): Promise<League[]> {
    const leagues = await this.execute(language);
    return leagues.filter((league) => league.displayPriority.status === status);
  }

  async getAvailableRegions(language = "en-US"): Promise<string[]> {
    const leagues = await this.execute(language);
    const uniqueRegions = new Set<string>();

    for (const league of leagues) {
      uniqueRegions.add(league.region);
    }

    return Array.from(uniqueRegions);
  }

  async getVisibleLeagues(language = "en-US"): Promise<League[]> {
    const leagues = await this.execute(language);
    return leagues.filter((league) => league.isVisible());
  }

  async getSelectedLeagues(language = "en-US"): Promise<League[]> {
    const leagues = await this.execute(language);
    return leagues.filter((league) => league.isSelected());
  }
}
