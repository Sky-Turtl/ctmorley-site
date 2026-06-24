export function getProductDetail(productFamilies, activeProductId) {
  if (!productFamilies || !activeProductId) return null;

  const parts = activeProductId.split("__");
  if (parts.length < 3) return null;

  const familySlug = parts[0];
  const selectionType = parts[1];
  const model = parts.slice(2).join("__");

  const family = productFamilies[familySlug];
  if (!family) return null;

  const baseSpecs = Array.isArray(family.specs) ? [...family.specs] : [];
  const baseTags = Array.isArray(family.highlightTags)
    ? [...family.highlightTags]
    : [];

  const formatGroupLabel = (group) => {
    const labels = {
      indoor: "Indoor Unit",
      standard: "Standard Heating",
      extreme: "Extreme Heating",
      splitSystemStandard: "Split System Standard",
      splitSystemExtreme: "Split System Extreme",
      condenserStandard: "Condenser Standard",
      condenserExtreme: "Condenser Extreme",
    };

    return labels[group] || group;
  };

  const getModelData = (field) => {
    return (
      family?.[field]?.[selectionType]?.[model] ??
      family?.[field]?.[model] ??
      null
    );
  };

  if (selectionType === "indoor") {
    const unit =
      family.indoorUnits?.find((item) => item.model === model) || null;

    if (!unit) {
      return {
        familySlug,
        selectionType,
        model,
        title: model,
        subtitle: `${family.title} · Indoor Unit`,
        description: family.description,
        specs: [...baseSpecs, { label: "Model", value: model }],
        dimensions: getModelData("dimensions"),
        pipeSizes: getModelData("pipeSizes"),
        operatingRanges: getModelData("operatingRanges"),
        highlightTags: baseTags,
        unit: null,
        family,
      };
    }

    const specs = [
      ...baseSpecs,
      { label: "Model", value: unit.model },
      ...(unit.size ? [{ label: "Size", value: unit.size }] : []),
      ...(unit.voltage ? [{ label: "Voltage", value: unit.voltage }] : []),
      ...(unit.heating
        ? [
            {
              label: "Heating",
              value: Array.isArray(unit.heating)
                ? unit.heating.join(", ")
                : unit.heating,
            },
          ]
        : []),
    ];

    const highlightTags = [...baseTags];

    if (unit.size) highlightTags.push(unit.size);

    if (Array.isArray(unit.heating)) {
      unit.heating.forEach((item) => highlightTags.push(item));
    }

    return {
      familySlug,
      selectionType,
      model,
      title: unit.model,
      subtitle: `${family.title} · Indoor Unit`,
      description: family.description,
      specs,
      dimensions:
        unit.dimensions ??
        getModelData("dimensions") ??
        [],
      pipeSizes:
        unit.pipeSizes ??
        getModelData("pipeSizes") ??
        [],
      operatingRanges:
        unit.operatingRanges ??
        getModelData("operatingRanges") ??
        [],
      ports:
        unit.ports ??
        getModelData("ports") ??
        null,
      mca:
        unit.mca ??
        getModelData("mca") ??
        null,
      highlightTags: [...new Set(highlightTags)],
      unit,
      family,
    };
  }

  return {
    familySlug,
    selectionType,
    model,
    title: model,
    subtitle: `${family.title} · ${formatGroupLabel(selectionType)}`,
    description: family.description,
    specs: [
      ...baseSpecs,
      { label: "Model", value: model },
      { label: "Configuration", value: formatGroupLabel(selectionType) },
    ],
    dimensions: getModelData("dimensions") ?? [],
    pipeSizes: getModelData("pipeSizes") ?? [],
    operatingRanges: getModelData("operatingRanges") ?? [],
    ports: getModelData("ports"),
    mca: getModelData("mca"),
    highlightTags: [
      ...new Set([
        ...baseTags,
        "Outdoor Unit",
        formatGroupLabel(selectionType),
      ]),
    ],
    unit: null,
    family,
  };
}