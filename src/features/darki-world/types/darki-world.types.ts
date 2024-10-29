export const darkiWorldSiteUrl = "https://darkiworld.org/";

export const mediaTypes = [
  "Série",
  "Film",
  "Animes",
  "Ebook",
  "Games",
  "Personnes",
] as const;
export type MediaType = (typeof mediaTypes)[number];

export interface Media {
  title: string;
  type: MediaType;
  url: string;
  // urlElement: Locator<HTMLAnchorElement>;
}

export type MediasByTypes = {
  [mediaType in MediaType]: Media[];
};

export interface MediaInfos {}
