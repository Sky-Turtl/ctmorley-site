const toBSeriesModel = (value) => {
  if (typeof value !== "string") return value;

  const modelMap = {
    "MOU-2A18G-2": "MOU-3B18G-2",
    "MOU-3A27G-2": "MOU-4B27G-2",
    "MOU-4A36G-2": "MOU-5B36G-2",
    "MOU-5A48G-2": "MOU-6B48G-2",
    "MOU-5A55G-2": "MOU-6B60G-2",

    "MOU-2A18H-2": "MOU-3B18H-2",
    "MOU-3A27H-2": "MOU-4B27H-2",
    "MOU-4A36H-2": "MOU-5B36H-2",
    "MOU-5A48H-2": "MOU-6B48H-2",
    "MOU-5A55H-2": "MOU-6B55H-2",
  };

  if (modelMap[value]) {
    return modelMap[value];
  }

  return value
    .replace(/\b(MIU|MOU)-A/g, "$1-B")
    .replace(/\bMOU-(\d+)A/g, "MOU-$1B")
    .replace(/\bMAC-A/g, "MAC-B");
};

const normalizePairedModel = (pairString) => {
  const [first, second] = pairString.split(" / ").map((item) => item.trim());
  const mou = [first, second].find((item) => item.startsWith("MOU"));
  const miu = [first, second].find((item) => item.startsWith("MIU"));

  return mou && miu ? `${mou}&${miu}` : pairString.replace(/\s*\/\s*/g, "&");
};

export const getUnitImagePath = (model, unitObj) => {
  if (!model) return null;

  const imageModel = toBSeriesModel(model);

  if (imageModel.includes(" / ")) {
    const normalizedModel = normalizePairedModel(imageModel);
    return `${import.meta.env.BASE_URL}unit-images/${normalizedModel}-cover.png`;
  }

  if (imageModel.startsWith("MIU")) {
    const isWallMountedIndoor = /^MIU-B\d{2}W-/.test(imageModel);

    if (isWallMountedIndoor) {
      const singleZoneOutdoor =
        unitObj?.compatibleSingleZoneOutdoorUnits?.standard?.[0] ??
        unitObj?.compatibleSingleZoneOutdoorUnits?.extreme?.[0];

      if (singleZoneOutdoor) {
        return `${import.meta.env.BASE_URL}unit-images/${toBSeriesModel(singleZoneOutdoor)}&${imageModel}-cover.png`;
      }
    }

    const multiZoneOutdoor =
      unitObj?.compatibleMultiZoneOutdoorUnits?.standard?.[0] ??
      unitObj?.compatibleMultiZoneOutdoorUnits?.extreme?.[0];

    if (multiZoneOutdoor) {
      return `${import.meta.env.BASE_URL}unit-images/${toBSeriesModel(multiZoneOutdoor)}&${imageModel}-cover.png`;
    }
  }

  return `${import.meta.env.BASE_URL}unit-images/${imageModel}-cover.png`;
};