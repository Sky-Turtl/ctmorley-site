import { useEffect } from "react";
import { getProductDetail } from "../data/productDetail";
const submittals = import.meta.glob('../assets/Submittals/*.pdf', { eager: true });

export default function ProductDetailPage({
  productFamilies,
  activeProductId,
  openProductDetail,
}) {
  const detail = getProductDetail(productFamilies, activeProductId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const specialOutdoorPairings = {
    "MOU-B09H-2": "MIU-B09W-2 / MOU-B09H-2",
    "MOU-B12H-2": "MIU-B12W-2 / MOU-B12H-2",
    "MOU-B18H-2": "MIU-B18W-2 / MOU-B18H-2",
    "MOU-B24H-2": "MIU-B24W-2 / MOU-B24H-2",
    "MOU-B33H-2": "MIU-B33HW-2 / MOU-B33H-2",

    "MOU-A09H-2": "MIU-A09W-2 / MOU-A09H-2",
    "MOU-A12H-2": "MIU-A12W-2 / MOU-A12H-2",
    "MOU-A18H-2": "MIU-A18W-2 / MOU-A18H-2",
    "MOU-A24H-2": "MIU-A24W-2 / MOU-A24H-2",
    "MOU-A33H-2": "MIU-A33W-2 / MOU-A33H-2",
  };

  const findProductIdByModel = (targetModel) => {
    if (!targetModel || !productFamilies) return null;

    const specialCombinedModel = specialOutdoorPairings[targetModel];
    if (specialCombinedModel) {
      for (const [slug, family] of Object.entries(productFamilies)) {
        const collections = [
          family.singleZoneOutdoorUnits,
          family.multiZoneOutdoorUnits,
          family.outdoorUnits,
        ];

        for (const collection of collections) {
          if (!collection || typeof collection !== "object") continue;

          for (const [groupName, values] of Object.entries(collection)) {
            if (Array.isArray(values) && values.includes(specialCombinedModel)) {
              return `${slug}__${groupName}__${specialCombinedModel}`;
            }

            if (values && typeof values === "object" && !Array.isArray(values)) {
              for (const nestedModels of Object.values(values)) {
                if (
                  Array.isArray(nestedModels) &&
                  nestedModels.includes(specialCombinedModel)
                ) {
                  return `${slug}__${groupName}__${specialCombinedModel}`;
                }
              }
            }
          }
        }
      }
    }

    for (const [slug, family] of Object.entries(productFamilies)) {
      if (Array.isArray(family.indoorUnits)) {
        const indoorMatch = family.indoorUnits.find(
          (unit) => unit.model === targetModel
        );

        if (indoorMatch) {
          return `${slug}__indoor__${targetModel}`;
        }
      }
    }

    for (const [slug, family] of Object.entries(productFamilies)) {
      const collections = [
        family.singleZoneOutdoorUnits,
        family.multiZoneOutdoorUnits,
        family.outdoorUnits,
      ];

      for (const collection of collections) {
        if (!collection || typeof collection !== "object") continue;

        for (const [groupName, values] of Object.entries(collection)) {
          if (Array.isArray(values)) {
            if (values.includes(targetModel)) {
              return `${slug}__${groupName}__${targetModel}`;
            }
          } else if (values && typeof values === "object") {
            for (const nestedValues of Object.values(values)) {
              if (
                Array.isArray(nestedValues) &&
                nestedValues.includes(targetModel)
              ) {
                return `${slug}__${groupName}__${targetModel}`;
              }
            }
          }
        }
      }
    }

    return null;
  };

  const renderLinkedModel = (model) => {
    const productId = findProductIdByModel(model);

    if (!productId) {
      return <span>{model}</span>;
    }

    return (
      <button
        type="button"
        onClick={() => openProductDetail(productId)}
        className="bg-transparent p-0 text-left text-sm text-slate-700 transition hover:text-orange-700"
      >
        {model}
      </button>
    );
  };

  if (!detail) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-10">
        <button
          onClick={handleBack}
          className="mb-6 text-sm font-semibold text-orange-700 hover:text-orange-800"
        >
          ← Back to Products
        </button>

        <div className="border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-900">
            Product not found
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The selected product could not be loaded from the current
            productFamilies data.
          </p>
        </div>
      </section>
    );
  }

  const {
    title,
    subtitle,
    description,
    specs = [],
    highlightTags = [],
    unit,
    family,
    selectionType,
  } = detail;

  const rawCompatibleSingleZone = unit?.compatibleSingleZoneOutdoorUnits;

  const compatibleSingleZoneIsNone =
    Array.isArray(rawCompatibleSingleZone) &&
    rawCompatibleSingleZone.length === 1 &&
    rawCompatibleSingleZone[0] === "None";

  const compatibleSingleZone =
    rawCompatibleSingleZone &&
    typeof rawCompatibleSingleZone === "object" &&
    !Array.isArray(rawCompatibleSingleZone)
      ? rawCompatibleSingleZone
      : {};

  const compatibleMultiZone = family?.compatibleMultiZoneOutdoorUnits || null;

  const normalizeSubmittalKey = (value) =>
    value?.toString().replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();

  const getSubmittalUrlFromFilename = (name) => {
    if (!name) return null;

    const normalizedTarget = normalizeSubmittalKey(name);
    let partialMatch = null;

    for (const [path, module] of Object.entries(submittals)) {
      const fileName = path.split("/").pop().replace(/\.pdf$/i, "");
      const normalizedFileName = normalizeSubmittalKey(fileName);

      if (normalizedFileName === normalizedTarget) {
        return module?.default || module;
      }

      if (!partialMatch && normalizedFileName.includes(normalizedTarget)) {
        partialMatch = module?.default || module;
      }
    }

    return partialMatch;
  };

  const getPairedSubmittalUrl = (indoorModel, outdoorModel) => {
    if (!indoorModel || !outdoorModel) return null;

    // Extract the model codes from the pairing string
    const extractModelCode = (model) => {
      // If it's a pairing string like "MIU-B09W-1 / MOU-B09G-1", extract just the model codes
      const parts = model.split("/").map(p => p.trim());
      return parts.length === 2 ? parts : [model];
    };

    const indoorCode = extractModelCode(indoorModel)[0];
    const outdoorCode = extractModelCode(outdoorModel)[0];

    // Format: outdoor&indoor (e.g., "MOU-B09G-1&MIU-B09W-1")
    const pairedFormat = `${outdoorCode}&${indoorCode}`;
    const normalizedPaired = normalizeSubmittalKey(pairedFormat);

    for (const [path, module] of Object.entries(submittals)) {
      const fileName = path.split("/").pop().replace(/\.pdf$/i, "");
      const normalizedFileName = normalizeSubmittalKey(fileName);

      if (normalizedFileName === normalizedPaired) {
        return module?.default || module;
      }
    }

    // Fallback: try legacy format (both models in any order)
    const normalizedIndoor = normalizeSubmittalKey(indoorCode);
    const normalizedOutdoor = normalizeSubmittalKey(outdoorCode);

    for (const [path, module] of Object.entries(submittals)) {
      const fileName = path.split("/").pop().replace(/\.pdf$/i, "");
      const normalizedFileName = normalizeSubmittalKey(fileName);

      if (
        normalizedFileName.includes(normalizedIndoor) &&
        normalizedFileName.includes(normalizedOutdoor)
      ) {
        return module?.default || module;
      }
    }

    return null;
  };

  const singleZoneSubmittalUrl =
    unit?.singleZoneSubmittalUrl ||
    family?.singleZoneSubmittalUrl ||
    (() => {
      const firstOutdoor = Object.values(compatibleSingleZone)?.[0]?.[0];
      return firstOutdoor ? getPairedSubmittalUrl(unit?.model, firstOutdoor) : null;
    })() ||
    getSubmittalUrlFromFilename(unit?.model);

  const multiZoneSubmittalUrl =
    unit?.multiZoneSubmittalUrl ||
    family?.multiZoneSubmittalUrl ||
    getSubmittalUrlFromFilename(unit?.model);

  const technicalDocsUrl =
    unit?.technicalDocsUrl ||
    family?.technicalDocsUrl ||
    null;

  const renderDocButton = (label, href, primary = false) => {
    if (!href) {
      return (
        <button
          type="button"
          disabled
          className={`inline-flex w-full items-center justify-center rounded-sm border px-4 py-3 text-sm font-semibold transition ${
            primary
              ? "border-slate-200 bg-slate-100 text-slate-400"
              : "border-slate-200 bg-white text-slate-400"
          } cursor-not-allowed`}
        >
          {label}
        </button>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex w-full items-center justify-center rounded-sm border px-4 py-3 text-sm font-semibold transition ${
          primary
            ? "border-orange-600 bg-orange-600 text-white hover:border-orange-700 hover:bg-orange-700"
            : "border-slate-300 bg-white text-slate-800 hover:border-orange-600 hover:text-orange-700"
        }`}
      >
        {label}
      </a>
    );
  };

  const renderHeatingLabel = (group) => {
    if (group === "standard") return "Standard Heating";
    if (group === "extreme") return "Extreme Heating";
    return group;
  };

  const getRequiredAccessories = (model) => {
    if (!model) return [];

    const is410A = model.includes("-A");
    const prefix = is410A ? "T-MBQ4-03E" : "T-MBQ4-03B";

    const accessories = [];

    if (
      model === "MIU-B09C-2" ||
      model === "MIU-B12C-2" ||
      model === "MIU-B18C-2" ||
      model === "MIU-A09C-2" ||
      model === "MIU-A12C-2" ||
      model === "MIU-A18C-2"
    ) {
      accessories.push(prefix);
    }

    if (
      model === "MIU-B09CO-2" ||
      model === "MIU-B12CO-2" ||
      model === "MIU-B18CO-2" ||
      model === "MIU-A09CO-2" ||
      model === "MIU-A12CO-2" ||
      model === "MIU-A18CO-2"
    ) {
      accessories.push(prefix);
    }

    if (model === "MIU-B24C-2" || model === "MIU-A24C-2") {
      accessories.push("T-MBQ4-04B");
    }

    return accessories;
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <button
        onClick={handleBack}
        className="mb-6 text-sm font-semibold text-orange-700 hover:text-orange-800"
      >
        ← Back to Products
      </button>

      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="border border-slate-200 bg-white p-6">
            <div className="h-64 bg-slate-100" />

            <div className="mt-6 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
              {subtitle}
            </div>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>

            {description && (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {description}
              </p>
            )}

            <div className="mt-6 space-y-3">
              {renderDocButton("Single Zone Submittal", singleZoneSubmittalUrl, true)}
              {renderDocButton("Multi Zone Submittal", multiZoneSubmittalUrl)}
              {renderDocButton("Technical Documents", technicalDocsUrl)}
            </div>

            {!singleZoneSubmittalUrl &&
              !multiZoneSubmittalUrl &&
              !technicalDocsUrl && (
                <p className="mt-3 text-xs text-slate-500">
                  Document links have not been added for this product yet.
                </p>
              )}

            {highlightTags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {highlightTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Need a specific document?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              If submittal or technical file links are not added yet, this area
              is ready for them once you attach the URLs in your product data.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {selectionType === "indoor" &&
            (compatibleSingleZoneIsNone || 
              Object.keys(compatibleSingleZone).length > 0 || 
              compatibleMultiZone) && (
              <div className="border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Outdoor Unit Pairings
                </h2>

                {compatibleSingleZoneIsNone && !compatibleMultiZone ? (
                  <p className="mt-4 text-sm text-slate-900">None</p>
                ) : (
                  <>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {Object.keys(compatibleSingleZone).length > 0 && Object.entries(compatibleSingleZone).map(([group, models]) => (
                        <div key={`single-${group}`}>
                          <div className="text-sm font-semibold text-orange-700">
                            {renderHeatingLabel(group)}
                          </div>

                          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                            {models.map((outdoorModel) => (
                              <li key={outdoorModel}>
                                {renderLinkedModel(outdoorModel)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {compatibleMultiZone && Object.entries(compatibleMultiZone).map(([group, models]) => (
                        <div key={`multi-${group}`}>
                          <div className="text-sm font-semibold text-orange-700">
                            {renderHeatingLabel(group)}
                          </div>

                          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                            {models.map((outdoorModel) => (
                              <li key={outdoorModel}>
                                {renderLinkedModel(outdoorModel)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {unit?.model && (
                      <div className="mt-6">
                        {renderDocButton(
                          "Pairing Submittal",
                          (() => {
                            // Get the first outdoor model from combined single and multi zone
                            const firstSingleZoneModel = Object.values(compatibleSingleZone)?.[0]?.[0];
                            const firstMultiZoneModel = Object.values(compatibleMultiZone || {})?.[0]?.[0];
                            const outdoorModel = firstSingleZoneModel || firstMultiZoneModel;

                            if (!outdoorModel) return null;
                            return getPairedSubmittalUrl(unit.model, outdoorModel);
                          })()
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

          {selectionType === "indoor" &&
            unit?.model &&
            getRequiredAccessories(unit.model).length > 0 && (
              <div className="border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Required Accessories
                </h2>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {getRequiredAccessories(unit.model).map((acc) => (
                    <li key={acc}>{acc}</li>
                  ))}
                </ul>
              </div>
            )}

          <div className="border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Specifications
            </h2>

            <div className="mt-4 divide-y divide-slate-200">
              {specs.map((spec, index) => (
                <div
                  key={`${spec.label}-${spec.value}-${index}`}
                  className="grid grid-cols-2 gap-4 py-3"
                >
                  <div className="text-sm font-medium text-slate-500">
                    {spec.label}
                  </div>
                  <div className="text-sm text-slate-900">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}