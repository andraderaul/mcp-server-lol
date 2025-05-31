export type LeagueStatus =
  | "force_selected"
  | "selected"
  | "not_selected"
  | "hidden";

export interface LeagueDisplayPriority {
  position: number;
  status: LeagueStatus;
}

export class League {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly name: string,
    public readonly region: string,
    public readonly image: string,
    public readonly priority: number,
    public readonly displayPriority: LeagueDisplayPriority
  ) {}

  public isRegionalLeague(): boolean {
    const regionalLeagues = ["LCS", "LEC", "LCK", "LPL"];
    return regionalLeagues.includes(this.slug.toUpperCase());
  }

  public isInternationalLeague(): boolean {
    const internationalLeagues = ["MSI", "WORLDS", "WCS"];
    return internationalLeagues.some((league) =>
      this.slug.toUpperCase().includes(league)
    );
  }

  public isVisible(): boolean {
    return this.displayPriority.status !== "hidden";
  }

  public isSelected(): boolean {
    return ["force_selected", "selected"].includes(this.displayPriority.status);
  }

  public getRegionCode(): string {
    // Extract region from common patterns
    const regionMap: Record<string, string> = {
      AMERICAS: "NA",
      EMEA: "EU",
      ASIA: "AS",
      NORTH_AMERICA: "NA",
      EUROPE: "EU",
      KOREA: "KR",
      CHINA: "CN",
    };

    return regionMap[this.region.toUpperCase()] || this.region;
  }
}
