import type { LiveDatasource } from "../data/live-datasource.interface.js";
import { GetLiveMatchesUseCase } from "./get-live-matches.usecase.js";

export class CheckLiveMatchesUseCase {
  private getLiveMatchesUseCase: GetLiveMatchesUseCase;

  constructor(private datasource: LiveDatasource) {
    this.getLiveMatchesUseCase = new GetLiveMatchesUseCase(datasource);
  }

  async execute(language = "en-US"): Promise<boolean> {
    try {
      const liveMatches = await this.getLiveMatchesUseCase.execute(language);
      return liveMatches.length > 0;
    } catch (error) {
      console.error("Error in CheckLiveMatchesUseCase:", error);
      throw new Error("Failed to check for live matches");
    }
  }

  async getLiveMatchCount(language = "en-US"): Promise<number> {
    try {
      const liveMatches = await this.getLiveMatchesUseCase.execute(language);
      return liveMatches.length;
    } catch (error) {
      console.error(
        "Error in CheckLiveMatchesUseCase.getLiveMatchCount:",
        error
      );
      throw new Error("Failed to get live match count");
    }
  }
}
