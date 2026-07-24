import { productFamilies } from "../data/products";

// Keeps word boundaries (hyphens/punctuation become spaces) — used for
// human-readable multi-word matching.
const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Strips everything except letters/numbers so "MIU-B09W-2", "miu b09w 2" and
// "miub09w2" all compare equal — hyphens and punctuation are ignored entirely.
const compact = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

// Standard Levenshtein edit distance (insertions/deletions/substitutions).
const levenshtein = (a, b) => {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;

  let prev = new Array(n + 1);
  for (let j = 0; j <= n; j += 1) prev[j] = j;

  for (let i = 1; i <= m; i += 1) {
    const cur = [i];
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }

  return prev[n];
};

// Smallest edit distance between `q` and any similar-length window of `target`,
// so a typo in part of a longer code still matches closely. 0 means `q` is an
// exact substring of `target`.
const bestFuzzyDistance = (q, target) => {
  if (!q) return target.length;
  if (!target) return q.length;
  if (target.includes(q)) return 0;

  const lq = q.length;
  const lt = target.length;
  let best = levenshtein(q, target);

  for (let w = Math.max(1, lq - 2); w <= lq + 2 && w <= lt; w += 1) {
    for (let i = 0; i + w <= lt; i += 1) {
      const d = levenshtein(q, target.substr(i, w));
      if (d < best) best = d;
      if (best === 0) return 0;
    }
  }

  return best;
};

const buildSearchIndex = (families) => {
  const results = [];

  Object.entries(families || {}).forEach(([slug, family]) => {
    const familyTitle = family.title || "";
    const familyDescription = family.description || "";
    const refrigerant =
      family.specs?.find((spec) => spec.label === "Refrigerant")?.value || "";
    const market = family.eyebrow || "";

    if (Array.isArray(family.indoorUnits)) {
      family.indoorUnits.forEach((unit) => {
        if (!unit?.model) return;

        results.push({
          id: `${slug}__indoor__${unit.model}`,
          model: unit.model,
          unit,
          title: unit.model,
          subtitle: `${familyTitle} · Indoor Unit`,
          familyTitle,
          familySlug: slug,
          market,
          refrigerant,
          type: "indoor",
          searchText: normalize(
            [
              unit.model,
              familyTitle,
              familyDescription,
              market,
              refrigerant,
              "indoor unit",
            ].join(" ")
          ),
        });
      });
    }

    const collections = [
      family.singleZoneOutdoorUnits,
      family.multiZoneOutdoorUnits,
      family.outdoorUnits,
    ];

    collections.forEach((collection) => {
      if (!collection || typeof collection !== "object") return;

      Object.entries(collection).forEach(([groupName, values]) => {
        if (Array.isArray(values)) {
          values.forEach((model) => {
            if (!model) return;

            results.push({
              id: `${slug}__${groupName}__${model}`,
              model,
              title: model,
              subtitle: `${familyTitle} · ${groupName}`,
              familyTitle,
              familySlug: slug,
              market,
              refrigerant,
              type: groupName,
              searchText: normalize(
                [
                  model,
                  familyTitle,
                  familyDescription,
                  market,
                  refrigerant,
                  groupName,
                ].join(" ")
              ),
            });
          });
        } else if (values && typeof values === "object") {
          Object.values(values).forEach((nestedValues) => {
            if (!Array.isArray(nestedValues)) return;

            nestedValues.forEach((model) => {
              if (!model) return;

              results.push({
                id: `${slug}__${groupName}__${model}`,
                model,
                title: model,
                subtitle: `${familyTitle} · ${groupName}`,
                familyTitle,
                familySlug: slug,
                market,
                refrigerant,
                type: groupName,
                searchText: normalize(
                  [
                    model,
                    familyTitle,
                    familyDescription,
                    market,
                    refrigerant,
                    groupName,
                  ].join(" ")
                ),
              });
            });
          });
        }
      });
    });
  });

  // Precompute punctuation-free forms so matching ignores hyphens/spaces.
  return results.map((item) => ({
    ...item,
    modelCompact: compact(item.model),
    familyTitleCompact: compact(item.familyTitle),
    searchTextCompact: compact(item.searchText),
  }));
};

const scoreSearchResult = (item, query) => {
  const q = compact(query);
  if (!q) return 0;

  const model = item.modelCompact;
  const title = item.familyTitleCompact;
  const text = item.searchTextCompact;

  let score = 0;

  if (model === q) score += 10000;
  else if (model.startsWith(q)) score += 6000;
  else if (model.includes(q)) score += 3000;
  else {
    // No literal match — allow typos within ~40% of the query length.
    const distance = bestFuzzyDistance(q, model);
    const tolerance = Math.max(1, Math.floor(q.length * 0.4));
    if (distance <= tolerance) {
      score += Math.max(200, 2200 - distance * 600);
    }
  }

  if (title.includes(q)) score += 200;
  else if (text.includes(q)) score += 120;

  // Multi-word queries: reward each token, with a little typo tolerance.
  const parts = normalize(query)
    .split(" ")
    .map(compact)
    .filter((part) => part.length >= 2);

  parts.forEach((part) => {
    if (model.includes(part)) score += 150;
    else if (bestFuzzyDistance(part, model) <= 1) score += 90;

    if (title.includes(part)) score += 30;
    else if (text.includes(part)) score += 15;
  });

  if (q.includes("mou") && !model.includes("mou")) score -= 400;
  if (q.includes("miu") && !model.includes("miu")) score -= 400;

  return score;
};

// The index is derived from static data, so build it once and reuse.
let searchIndex = null;

export const getSearchResults = (query, limit = 50) => {
  if (!searchIndex) {
    searchIndex = buildSearchIndex(productFamilies);
  }

  const trimmed = (query || "").trim();
  if (!trimmed) return [];

  const scored = searchIndex
    .map((item) => ({ ...item, score: scoreSearchResult(item, trimmed) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  if (scored.length > 0) {
    return scored.slice(0, limit);
  }

  // Nothing matched even fuzzily — still surface the closest models so the user
  // always gets a suggestion instead of an empty result.
  const q = compact(trimmed);
  return searchIndex
    .map((item) => ({ item, distance: bestFuzzyDistance(q, item.modelCompact) }))
    .sort(
      (a, b) =>
        a.distance - b.distance || a.item.title.localeCompare(b.item.title)
    )
    .slice(0, Math.min(limit, 8))
    .map(({ item }) => ({ ...item, score: 0 }));
};
