export const digimonFandomBaseSiteUrl = "https://digimon.fandom.com/wiki";
export const digimonFandomSiteUrl = `${digimonFandomBaseSiteUrl}/wiki/Digimon_Wiki`;

export const digimonLevel = ["Fresh"] as const;
export type DigimonLevel = (typeof digimonLevel)[number];

export interface BaseDigimon {
  name: string;
  imageUrl?: string;
  detailsUrl?: string;
}

export interface DigimonDetails {
  name: string;
  imageUrl?: string;
  level: string;
  type: string;
  attributes: string[];
  families: string[];
  size: string;
  debut: string;
  priorForms: string[];
  nextForms: string[];
  // digiFuseForms: string[]
  partners: string[];
  voiceActors: string[];
  otherNames: string[];
  variations: string[];
}

export interface Digimon {
  currForm: DigimonDetails;
  digivolutions: DigimonDetails[];
}
