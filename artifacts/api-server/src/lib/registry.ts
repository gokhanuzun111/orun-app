export const VALID_CLUB_IDS = new Set([
  "master",
  "languages",
  "motorcycles",
  "watches",
  "whisky",
  "cigars",
  "books",
  "film",
  "aviation",
  "gastronomy",
  "cars",
  "philosophy",
  "finance",
  "music",
  "maritime",
  "fitness",
  "history",
  "fashion",
  "agriculture",
  "landscaping",
  "mountaineering",
  "camping",
  "models",
  "dance",
]);

function roomRange(prefix: string, clubId: string, count: number): [string, string][] {
  return Array.from({ length: count }, (_, i) => [`${prefix}-${i + 1}`, clubId] as [string, string]);
}

export const ROOM_CLUB_MAP: Record<string, string> = Object.fromEntries([
  ...["lang-en", "lang-it", "lang-es", "lang-de", "lang-fr", "lang-zh", "lang-ja", "lang-ar"].map(
    (id) => [id, "languages"] as [string, string],
  ),
  ...roomRange("master", "master", 8),
  ...roomRange("moto", "motorcycles", 8),
  ...roomRange("watch", "watches", 8),
  ...roomRange("whisky", "whisky", 8),
  ...roomRange("cigar", "cigars", 8),
  ...roomRange("book", "books", 8),
  ...roomRange("film", "film", 8),
  ...roomRange("avia", "aviation", 8),
  ...roomRange("gastro", "gastronomy", 8),
  ...roomRange("cars", "cars", 8),
  ...roomRange("phil", "philosophy", 8),
  ...roomRange("fin", "finance", 8),
  ...roomRange("music", "music", 8),
  ...roomRange("mar", "maritime", 8),
  ...roomRange("fit", "fitness", 8),
  ...roomRange("hist", "history", 8),
  ...roomRange("fash", "fashion", 8),
  ...roomRange("agr", "agriculture", 8),
  ...roomRange("land", "landscaping", 8),
  ...roomRange("mnt", "mountaineering", 8),
  ...roomRange("camp", "camping", 8),
  ...roomRange("mod", "models", 8),
  ...roomRange("dan", "dance", 8),
]);

const PROFANITY_SET = new Set([
  "orospu", "sik", "göt", "amk", "bok", "oç", "piç", "kahpe",
  "ibne", "götveren", "amcık", "yarrak", "meme", "orosbuçu",
]);

export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  for (const word of words) {
    const clean = word.replace(/[^a-zçğışöü]/g, "");
    if (PROFANITY_SET.has(clean)) return true;
  }
  return false;
}
