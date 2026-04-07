export default function ProductsPage({
  productFamilies,
  activeMarket,
  setActiveMarket,
  activeRefrigerant,
  setActiveRefrigerant,
  openProductDetail,
}) {
  const families = Object.entries(productFamilies || {});

  const heatingLabelMap = {
    standard: "Standard Heating",
    extreme: "Extreme Heating",
  };

  const outdoorGroupLabelMap = {
    standard: "Standard Heating",
    extreme: "Extreme Heating",
    splitSystemStandard: "Split System Standard",
    splitSystemExtreme: "Split System Extreme",
    condenserStandard: "Condenser Standard",
    condenserExtreme: "Condenser Extreme",
  };

  const handleOpenProduct = (productId) => {
    openProductDetail(productId);
  };

  const cleanModels = (models) =>
    Array.isArray(models)
      ? models.filter(
          (model) => typeof model === "string" && model.trim().length > 0
        )
      : [];

  const hasValidModels = (models) =>
    Array.isArray(models) &&
    models.some((model) => typeof model === "string" && model.trim().length > 0);

  const hasHeatingData = (data) => {
    if (!data) return false;

    return Object.values(data).some((values) => {
      if (Array.isArray(values)) {
        return hasValidModels(values);
      }

      if (values && typeof values === "object") {
        return Object.values(values).some((groupModels) =>
          hasValidModels(groupModels)
        );
      }

      return false;
    });
  };

  const hasOutdoorGroups = (outdoorUnits) =>
    !!outdoorUnits && Object.values(outdoorUnits).some((models) => hasValidModels(models));

  const hasIndoorUnits = (units) =>
    Array.isArray(units) &&
    units.some(
      (unit) => typeof unit?.model === "string" && unit.model.trim().length > 0
    );

  const filteredFamilies = families
    .filter(([_, family]) => {
      const eyebrow = (family.eyebrow || "").toLowerCase();
      const refrigerantSpec =
        family.specs?.find((spec) => spec.label === "Refrigerant")?.value || "";

      const matchesMarket =
        activeMarket === "Residential"
          ? eyebrow.includes("residential")
          : activeMarket === "Light Commercial"
          ? eyebrow.includes("light commercial")
          : activeMarket === "Multi-Position AHU"
          ? eyebrow.includes("multi-position ahu")
          : eyebrow.includes("accessories");

      const matchesRefrigerant = refrigerantSpec.includes(activeRefrigerant);

      return matchesMarket && matchesRefrigerant;
    })
    .filter(([_, family]) =>
      hasHeatingData(family.singleZoneOutdoorUnits) ||
      hasHeatingData(family.multiZoneOutdoorUnits) ||
      hasIndoorUnits(family.indoorUnits) ||
      hasOutdoorGroups(family.outdoorUnits)
    );

  const renderHeatingGroups = (familySlug, data) => {
    if (!data) return null;

    const heatingEntries = Object.entries(data).filter(([, values]) => {
      if (Array.isArray(values)) {
        return cleanModels(values).length > 0;
      }

      if (values && typeof values === "object") {
        return Object.values(values).some(
          (groupModels) => cleanModels(groupModels).length > 0
        );
      }

      return false;
    });

    if (heatingEntries.length === 0) return null;

    return (
      <div
        className={`mt-4 grid gap-4 ${
          heatingEntries.length === 1
            ? "md:grid-cols-1"
            : heatingEntries.length === 2
            ? "md:grid-cols-2"
            : "md:grid-cols-3"
        }`}
      >
        {heatingEntries.map(([heatingType, values]) => {
          const isGrouped =
            values && !Array.isArray(values) && typeof values === "object";

          return (
            <div key={`${familySlug}-${heatingType}`}>
              <div className="text-sm font-semibold text-orange-700">
                {heatingLabelMap[heatingType] ?? heatingType}
              </div>

              {isGrouped ? (
                <div className="mt-2 space-y-3">
                  {Object.entries(values)
                    .filter(([, models]) => cleanModels(models).length > 0)
                    .map(([groupLabel, models]) => (
                      <div key={`${familySlug}-${heatingType}-${groupLabel}`}>
                        <div className="text-xs text-slate-700">
                          {groupLabel}
                        </div>
                        <ul className="mt-1 list-disc space-y-1 pl-4">
                          {cleanModels(models).map((model) => (
                            <li key={`${familySlug}-${heatingType}-${model}`}>
                              <button
                                onClick={() =>
                                  handleOpenProduct(
                                    `${familySlug}__${heatingType}__${model}`
                                  )
                                }
                                className="text-sm text-slate-800 hover:text-orange-700"
                              >
                                {model}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              ) : (
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {cleanModels(values).map((model) => (
                    <li key={`${familySlug}-${heatingType}-${model}`}>
                      <button
                        onClick={() =>
                          handleOpenProduct(
                            `${familySlug}__${heatingType}__${model}`
                          )
                        }
                        className="text-sm text-slate-800 hover:text-orange-700"
                      >
                        {model}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderOutdoorGroups = (slug, outdoorUnits) => {
    if (!outdoorUnits) return null;

    const groups = Object.entries(outdoorUnits).filter(
      ([, models]) => cleanModels(models).length > 0
    );

    if (groups.length === 0) return null;

    return (
      <div className="mt-4">
        <div className="text-sm font-semibold text-slate-900">
          Outdoor Units
        </div>

        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {groups.map(([groupName, models]) => (
            <div key={`${slug}-${groupName}`}>
              <div className="text-sm font-semibold text-orange-700">
                {outdoorGroupLabelMap[groupName] ?? groupName}
              </div>

              <ul className="mt-1 list-disc space-y-1 pl-4">
                {cleanModels(models).map((model) => (
                  <li key={`${slug}-${groupName}-${model}`}>
                    <button
                      onClick={() =>
                        handleOpenProduct(`${slug}__${groupName}__${model}`)
                      }
                      className="text-sm text-slate-800 hover:text-orange-700"
                    >
                      {model}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-0">
        <div className="text-md font-semibold text-orange-700">Products</div>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          Browse Product Categories
        </h2>
      </div>

      <div className="mt-1 rounded-sm border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap gap-8 lg:gap-38">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-500">
              Refrigerant Platform
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["R454B", "R410A"].map((refrigerant) => (
                <button
                  key={refrigerant}
                  onClick={() => setActiveRefrigerant(refrigerant)}
                  className={`rounded-sm border px-3 py-2 text-xs font-semibold ${
                    activeRefrigerant === refrigerant
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {refrigerant}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-500">
              Application
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Residential",
                "Light Commercial",
                "Multi-Position AHU",
                "Accessories",
              ].map((market) => (
                <button
                  key={market}
                  onClick={() => setActiveMarket(market)}
                  className={`rounded-sm border px-3 py-2 text-xs font-semibold ${
                    activeMarket === market
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {market}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Selected:</span>
          <span>{activeRefrigerant}</span>
          <span className="text-slate-400">/</span>
          <span>{activeMarket}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {filteredFamilies.map(([slug, family]) => (
          <div key={slug} className="border border-slate-200 bg-white p-6">
            <div className="h-28 bg-slate-100" />

            <div className="mt-6 text-lg font-semibold text-orange-700">
              {family.title}
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {family.description}
            </p>

            {hasHeatingData(family.singleZoneOutdoorUnits) && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-900">
                  Single-Zone Pairings
                </div>
                {renderHeatingGroups(slug, family.singleZoneOutdoorUnits)}
              </div>
            )}

            {hasHeatingData(family.multiZoneOutdoorUnits) && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-900">
                  Multi-Zone Outdoor Units
                </div>
                {renderHeatingGroups(slug, family.multiZoneOutdoorUnits)}
              </div>
            )}

            {hasIndoorUnits(family.indoorUnits) && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-slate-900">
                  Indoor Units
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {family.indoorUnits
                    .filter(
                      (unit) =>
                        typeof unit?.model === "string" &&
                        unit.model.trim().length > 0
                    )
                    .map((unit) => (
                      <li key={unit.model}>
                        <button
                          onClick={() =>
                            handleOpenProduct(`${slug}__indoor__${unit.model}`)
                          }
                          className="text-sm text-slate-800 hover:text-orange-700"
                        >
                          {unit.model}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {hasOutdoorGroups(family.outdoorUnits) &&
              renderOutdoorGroups(slug, family.outdoorUnits)}
          </div>
        ))}
      </div>
    </section>
  );
}