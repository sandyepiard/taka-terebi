export const mediaTypes = [
  "Série",
  "Film",
  "Animes",
  "Ebook",
  "Games",
] as const;
export type MediaType = (typeof mediaTypes)[number];

export interface Media {
  title: string;
  type: MediaType;
}
