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
        className="cursor-pointer bg-transparent p-0 text-left text-sm text-slate-700 transition hover:text-orange-700"
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
          className="cursor-pointer mb-6 text-sm font-semibold text-orange-700 hover:text-orange-800"
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
    dimensions = null,
    pipeSizes = null,
    operatingRanges = null,
    ports = null,
    mca = null,
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

  // Check if this is a pairing page (model contains " / ")
  const isPairingPage = (unit?.model || detail?.model)?.includes(" / ");

  // Extract models from pairing string if applicable
  const extractPairingModels = (modelStr) => {
    if (!modelStr || !modelStr.includes(" / ")) return { indoor: null, outdoor: null };
    const [indoor, outdoor] = modelStr.split(" / ").map(m => m.trim());
    return { indoor, outdoor };
  };

  const pairingModels = extractPairingModels(unit?.model || detail?.model);

  // Get the appropriate submittal URL based on page type
  const submittalUrl = (() => {
    if (isPairingPage) {
      // For pairing pages, look for the pairing submittal
      if (pairingModels.indoor && pairingModels.outdoor) {
        return getPairedSubmittalUrl(pairingModels.indoor, pairingModels.outdoor);
      }
    } else if (selectionType === "indoor") {
      // For indoor unit pages, try single zone, then multi zone, then direct model
      const directUrl = 
        unit?.singleZoneSubmittalUrl ||
        family?.singleZoneSubmittalUrl ||
        getSubmittalUrlFromFilename(unit?.model);
      if (directUrl) return directUrl;

      // Try paired submittal with first outdoor model
      const firstOutdoor = Object.values(compatibleSingleZone)?.[0]?.[0];
      if (firstOutdoor) {
        return getPairedSubmittalUrl(unit?.model, firstOutdoor);
      }
      return null;
    } else {
      // For outdoor units, just use the model name
      return getSubmittalUrlFromFilename(unit?.model || detail?.model);
    }
    return null;
  })();

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

  const getUnitImagePath = (model, unitObj) => {
    if (!model) return null;
    
    // Handle paired models: remove spaces and replace "/" with "&"
    // Ensure MOU comes before MIU in paired units
    // e.g., "MIU-B09W-2 / MOU-B09H-2" becomes "MOU-B09H-2&MIU-B09W-2"
    if (model.includes(" / ")) {
      const [first, second] = model.split(" / ").map(m => m.trim());
      // Ensure MOU is first, then MIU
      const mou = [first, second].find(m => m.startsWith("MOU"));
      const miu = [first, second].find(m => m.startsWith("MIU"));
      const normalizedModel = mou && miu ? `${mou}&${miu}` : model.replace(/\s*\/\s*/g, "&");
      return `${import.meta.env.BASE_URL}unit-images/${normalizedModel}-cover.png`;
    }
    
    // For single MIU units with compatible outdoor units, create paired image path
    if (model.startsWith("MIU") && unitObj?.compatibleMultiZoneOutdoorUnits) {
      const standardOutdoor = unitObj.compatibleMultiZoneOutdoorUnits.standard?.[0];
      if (standardOutdoor) {
        return `${import.meta.env.BASE_URL}unit-images/${standardOutdoor}&${model}-cover.png`;
      }
    }
    
    // For MOU units, try to find corresponding MIU by replacing MOU with MIU
    // For extreme models (VH), remove the H to get the base MIU model
    // e.g., MOU-B48VH-4 → MIU-B48V-4, MOU-B48V-4 → MIU-B48V-4
    // if (model.startsWith("MOU")) {
    //   return `${import.meta.env.BASE_URL}unit-images/${model}-cover.png`;
    // }

    return `${import.meta.env.BASE_URL}unit-images/${model}-cover.png`;
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <button
        onClick={handleBack}
        className="mb-6 cursor-pointer text-sm font-semibold text-orange-700 hover:text-orange-800"
      >
        ← Back to Products
      </button>

      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-center h-64 border border-slate-200 rounded">
              {getUnitImagePath(unit?.model || detail?.model, unit) ? (
                <img
                  src={getUnitImagePath(unit?.model || detail?.model, unit)}
                  alt={unit?.model || detail?.model}
                  className="max-h-full max-w-full object-contain p-4"
                />
              ) : (
                <div className="text-slate-400">No unit image available</div>
              )}
            </div>

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
              {renderDocButton("Submittal", submittalUrl, true)}
              {renderDocButton("Technical Documents", technicalDocsUrl)}
            </div>

            {!submittalUrl &&
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
          {!isPairingPage && selectionType === "indoor" &&
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
                )}
              </div>
            )}

          {!isPairingPage && selectionType === "indoor" &&
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

            {dimensions && Object.keys(dimensions).length > 0 && (
              <>
                <h2 className="mt-6 text-lg font-semibold text-slate-900">
                  Dimensions
                </h2>

                <div className="mt-4 divide-y divide-slate-200">
                  {Object.entries(dimensions).map(([section, values]) => (
                    <div
                      key={section}
                      className="grid grid-cols-2 gap-4 py-3"
                    >
                      <div className="text-sm font-medium text-slate-500">
                        {section} (W x D x H)
                      </div>

                      <div className="text-sm text-slate-900">
                        {values.width}" × {values.depth}" × {values.height}"
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {pipeSizes && Object.keys(pipeSizes).length > 0 && (
              <>
                <h2 className="mt-6 text-lg font-semibold text-slate-900">
                  Pipe Sizes
                </h2>

                <div className="mt-4 divide-y divide-slate-200">
                  {Object.entries(pipeSizes).map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-2 gap-4 py-3"
                    >
                      <div className="text-sm font-medium text-slate-500">
                        {label}
                      </div>

                      <div className="text-sm text-slate-900">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {operatingRanges && Object.keys(operatingRanges).length > 0 && (
              <>
                <h2 className="mt-6 text-lg font-semibold text-slate-900">
                  Operating Ranges
                </h2>

                <div className="mt-4 divide-y divide-slate-200">
                  {operatingRanges.Cooling && (
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <div className="text-sm font-medium text-slate-500">
                        Cooling
                      </div>
                      <div className="text-sm text-slate-900">
                        {operatingRanges.Cooling.f[0]}°F to {operatingRanges.Cooling.f[1]}°F
                        ({operatingRanges.Cooling.c[0]}°C to {operatingRanges.Cooling.c[1]}°C)
                      </div>
                    </div>
                  )}

                  {operatingRanges.Heating && (
                    <div className="grid grid-cols-2 gap-4 py-3">
                      <div className="text-sm font-medium text-slate-500">
                        Heating
                      </div>
                      <div className="text-sm text-slate-900">
                        {operatingRanges.Heating.f[0]}°F to {operatingRanges.Heating.f[1]}°F 
                        ({operatingRanges.Heating.c[0]}°C to {operatingRanges.Heating.c[1]}°C)
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {ports && Object.keys(ports).length > 0 && (
              <>
                <h2 className="mt-6 text-lg font-semibold text-slate-900">
                  Ports
                </h2>

                <div className="mt-4 divide-y divide-slate-200">
                  <div className="grid grid-cols-2 gap-4 py-3">
                    <div className="text-sm font-medium text-slate-500">
                      Maximum Indoor Units
                    </div>

                    <div className="text-sm text-slate-900">
                      {ports}
                    </div>
                  </div>
                </div>
              </>
            )}

            {mca && Object.keys(mca).length > 0 && (
              <>
                <h2 className="mt-6 text-lg font-semibold text-slate-900">
                  Electrical
                </h2>

                <div className="mt-4 divide-y divide-slate-200">
                  <div className="grid grid-cols-2 gap-4 py-3">
                    <div className="text-sm font-medium text-slate-500">
                      MCA
                    </div>

                    <div className="text-sm text-slate-900">
                      {mca} A
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}