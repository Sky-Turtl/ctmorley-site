import { productFamilies } from "../data/products";

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

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

  return results;
};

const scoreSearchResult = (item, query) => {
  const q = normalize(query);
  if (!q) return -1;

  const model = normalize(item.model);
  const title = normalize(item.familyTitle);
  const text = item.searchText;

  let score = 0;

  if (model === q) score += 2000;
  if (model.startsWith(q)) score += 1200;
  if (model.includes(q)) score += 600;

  if (title.includes(q)) score += 120;
  if (text.includes(q)) score += 80;

  const queryParts = q.split(" ").filter((part) => part.length >= 3);

  queryParts.forEach((part) => {
    if (model.startsWith(part)) score += 120;
    else if (model.includes(part)) score += 60;

    if (title.includes(part)) score += 20;
    if (text.includes(part)) score += 10;
  });

  const wantsMOU = q.includes("mou");
  const wantsMIU = q.includes("miu");

  if (wantsMOU && !model.includes("mou")) {
    score -= 500;
  }

  if (wantsMIU && !model.includes("miu")) {
    score -= 500;
  }

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

  const normalizedQuery = normalize(trimmed);
  const queryParts = normalizedQuery
    .split(" ")
    .filter((part) => part.length >= 3);

  return searchIndex
    .filter((item) => {
      const model = normalize(item.model);
      const title = normalize(item.familyTitle);
      const text = item.searchText;

      if (
        model === normalizedQuery ||
        model.startsWith(normalizedQuery) ||
        model.includes(normalizedQuery)
      ) {
        return true;
      }

      return queryParts.every(
        (part) =>
          model.includes(part) || title.includes(part) || text.includes(part)
      );
    })
    .map((item) => ({
      ...item,
      score: scoreSearchResult(item, trimmed),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
};
