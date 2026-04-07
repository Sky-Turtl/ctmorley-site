const replaceBSeriesWithASeries = (value) => {
  if (typeof value === "string") {
    return value.replace(/\b(M[IO]U)-B/g, "$1-A");
  }

  if (Array.isArray(value)) {
    return value.map(replaceBSeriesWithASeries);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        replaceBSeriesWithASeries(nestedValue),
      ])
    );
  }

  return value;
};

const deepClone = (value) => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

const setFamilyRefrigerant = (family, refrigerant) => {
  const nextFamily = deepClone(family);

  if (Array.isArray(nextFamily.specs)) {
    nextFamily.specs = nextFamily.specs.map((spec) =>
      spec.label === "Refrigerant"
        ? { ...spec, value: refrigerant }
        : spec
    );
  }

  if (Array.isArray(nextFamily.highlightTags)) {
    nextFamily.highlightTags = [...new Set([...nextFamily.highlightTags, refrigerant])];
  }

  if (nextFamily.title && refrigerant === "R410A") {
    nextFamily.title = `${nextFamily.title} (R410A)`;
  }

  if (nextFamily.title && refrigerant === "R454B") {
    nextFamily.title = `${nextFamily.title} (R454B)`;
  }

  return nextFamily;
};

const pruneMissingModels = (value, missingModels) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return missingModels.has(trimmed) ? null : trimmed;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => pruneMissingModels(item, missingModels))
      .filter((item) => item !== null);
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, nestedValue]) => [key, pruneMissingModels(nestedValue, missingModels)])
      .filter(([, nestedValue]) => {
        if (nestedValue === null) return false;
        if (Array.isArray(nestedValue)) return nestedValue.length > 0;
        if (nestedValue && typeof nestedValue === "object") {
          return Object.keys(nestedValue).length > 0;
        }
        return true;
      });

    return Object.fromEntries(entries);
  }

  return value;
};

/*
  These are the R410A models that should NOT exist based on the model list you sent.
  If any of these are actually real, remove them from this set.
*/
const missingR410AModels = new Set([
  "MIU-A33HW-2",
  "MIU-A12F-2",
  "MIU-A16F-2",
  "MIU-A18V-2",
  "MIU-A24V-2",
  "MIU-A30V-2",
  "MIU-A36V-2",
  "MOU-A24V-4",
  "MOU-A30V-4",
  "MOU-A24VH-4",
  "MOU-A30VH-4",
  "MIU-A24V-4",
  "MIU-A30V-4",
]);

const residentialMultiZoneOutdoorUnits454B = {
  standard: [
    "MOU-3B18G-2",
    "MOU-4B27G-2",
    "MOU-5B36G-2",
    "MOU-6B48G-2",
    "MOU-6B60G-2",
  ],
  extreme: [
    "MOU-3B18H-2",
    "MOU-4B27H-2",
    "MOU-5B36H-2",
    "MOU-6B48H-2",
    "MOU-6B55H-2",
  ],
};

const residentialMultiZoneOutdoorUnitsR410A = {
  standard: [
    "MOU-2A18G-2",
    "MOU-3A27G-2",
    "MOU-4A36G-2",
    "MOU-5A48G-2",
    "MOU-5A55G-2",
  ],
  extreme: [
    "MOU-2A18H-2",
    "MOU-3A27H-2",
    "MOU-4A36H-2",
    "MOU-5A48H-2",
    "MOU-5A55H-2",
  ],
};

const baseProductFamilies454B = {
  "residential-single-zone-wall-mounted": {
    eyebrow: "Residential Systems",
    categoryLabel: "Residential Single-Zone Outdoor + Pairings",
    title: "Single-Zone Wall Mounted Pairings",
    description:
      "CT Morley residential single-zone wall mounted systems organized as direct indoor and outdoor pairings by voltage and heating type.",
    specs: [
      { label: "System Type", value: "Residential Single-Zone" },
      { label: "Mounting", value: "High Wall Indoor Unit" },
      { label: "Application", value: "Residential" },
      { label: "Heating", value: "Standard / Extreme" },
      { label: "Voltage", value: "110V / 220V" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["Wall Mounted", "Single-Zone", "Direct Pairing"],
    singleZoneOutdoorUnits: {
      standard: {
        "110V": [
          "MIU-B09W-1 / MOU-B09G-1",
          "MIU-B12W-1 / MOU-B12G-1",
        ],
        "220V": [
          "MIU-B09GW-2 / MOU-B09G-2",
          "MIU-B12GW-2 / MOU-B12G-2",
          "MIU-B18GW-2 / MOU-B18G-2",
          "MIU-B24GW-2 / MOU-B24G-2",
          "MIU-B30W-2 / MOU-B30G-2",
          "MIU-B36W-2 / MOU-B36G-2",
        ],
      },
      extreme: [
        "MIU-B09W-2 / MOU-B09H-2",
        "MIU-B12W-2 / MOU-B12H-2",
        "MIU-B18W-2 / MOU-B18H-2",
        "MIU-B24W-2 / MOU-B24H-2",
        "MIU-B33HW-2 / MOU-B33H-2",
      ],
    },
  },

  "residential-multi-zone-outdoor": {
    eyebrow: "Residential Systems",
    categoryLabel: "Residential Multi-Zone Outdoor",
    title: "Multi-Zone Outdoor Units",
    description:
      "CT Morley residential multi-zone outdoor units support a range of compatible indoor families across ducted, cassette, floor mounted, AHU, and wall mounted applications.",
    specs: [
      { label: "System Type", value: "Residential Multi-Zone" },
      { label: "Mounting", value: "Outdoor Unit" },
      { label: "Application", value: "Residential" },
      { label: "Heating", value: "Standard / Extreme" },
      { label: "Voltage", value: "220V" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["Multi-Zone Outdoor", "Residential", "Heating + Cooling"],
    outdoorUnits: residentialMultiZoneOutdoorUnits454B,
  },

  "residential-shared-wall-mounted": {
    eyebrow: "Residential Systems",
    categoryLabel: "Residential Shared Indoor Family",
    title: "Wall Mounted Indoor Units",
    description:
      "CT Morley residential wall mounted indoor units that can be used across compatible applications, including multi-zone systems and selected single-zone outdoor pairings.",
    specs: [
      { label: "Indoor Type", value: "High Wall Indoor Unit" },
      { label: "Application", value: "Residential" },
      { label: "Heating", value: "Extreme" },
      { label: "Voltage", value: "220V" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["Wall Mounted", "Shared Indoor Platform", "Residential"],
    indoorUnits: [
      {
        model: "MIU-B06W-2",
        size: "06",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: ["None"]
      },
      {
        model: "MIU-B09W-2",
        size: "09",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B09H-2"],
        },
      },
      {
        model: "MIU-B12W-2",
        size: "12",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B12H-2"],
        },
      },
      {
        model: "MIU-B18W-2",
        size: "18",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B18H-2"],
        },
      },
      {
        model: "MIU-B24W-2",
        size: "24",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B24H-2"],
        },
      },
    ],
    compatibleMultiZoneOutdoorUnits: residentialMultiZoneOutdoorUnits454B,
  },

  "residential-shared-ducted": {
    eyebrow: "Residential Systems",
    categoryLabel: "Residential Shared Indoor Family",
    title: "Ducted Indoor Units",
    description:
      "CT Morley residential ducted indoor units provide a concealed installation option for both single-zone and compatible multi-zone applications.",
    specs: [
      { label: "Indoor Type", value: "Concealed Ducted Indoor Unit" },
      { label: "Application", value: "Residential" },
      { label: "Heating", value: "Extreme" },
      { label: "Voltage", value: "220V" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["Ducted", "Shared Indoor Platform", "Residential"],
    indoorUnits: [
      {
        model: "MIU-B09D-2",
        size: "09",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B09H-2"],
        },
      },
      {
        model: "MIU-B12D-2",
        size: "12",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B12H-2"],
        },
      },
      {
        model: "MIU-B18D-2",
        size: "18",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B18H-2"],
        },
      },
      {
        model: "MIU-B24D-2",
        size: "24",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B24H-2"],
        },
      },
    ],
    compatibleMultiZoneOutdoorUnits: residentialMultiZoneOutdoorUnits454B,
  },

  "residential-shared-one-way-cassette": {
    eyebrow: "Residential Systems",
    categoryLabel: "Residential Shared Indoor Family",
    title: "1-Way Cassette Indoor Units",
    description:
      "CT Morley residential one-way cassette indoor units provide a compact ceiling-mounted solution for both single-zone and compatible multi-zone applications.",
    specs: [
      { label: "Indoor Type", value: "One-Way Ceiling Cassette" },
      { label: "Application", value: "Residential" },
      { label: "Heating", value: "Extreme" },
      { label: "Voltage", value: "220V" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["1-Way Cassette", "Shared Indoor Platform", "Residential"],
    indoorUnits: [
      {
        model: "MIU-B09CO-2",
        size: "09",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B09H-2"],
        },
      },
      {
        model: "MIU-B12CO-2",
        size: "12",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B12H-2"],
        },
      },
      {
        model: "MIU-B18CO-2",
        size: "18",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B18H-2"],
        },
      },
    ],
    compatibleMultiZoneOutdoorUnits: residentialMultiZoneOutdoorUnits454B,
  },

  "residential-shared-four-way-cassette": {
    eyebrow: "Residential Systems",
    categoryLabel: "Residential Shared Indoor Family",
    title: "4-Way Cassette Indoor Units",
    description:
      "CT Morley residential 4-way cassette indoor units are designed for ceiling-mounted applications across both single-zone and compatible multi-zone systems.",
    specs: [
      { label: "Indoor Type", value: "4-Way Ceiling Cassette" },
      { label: "Application", value: "Residential" },
      { label: "Heating", value: "Extreme" },
      { label: "Voltage", value: "220V" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["4-Way Cassette", "Shared Indoor Platform", "Residential"],
    indoorUnits: [
      {
        model: "MIU-B09C-2",
        size: "09",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B09H-2"],
        },
      },
      {
        model: "MIU-B12C-2",
        size: "12",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B12H-2"],
        },
      },
      {
        model: "MIU-B18C-2",
        size: "18",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B18H-2"],
        },
      },
      {
        model: "MIU-B24C-2",
        size: "24",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B24H-2"],
        },
      },
    ],
    compatibleMultiZoneOutdoorUnits: residentialMultiZoneOutdoorUnits454B,
  },

  "residential-shared-floor-mounted": {
    eyebrow: "Residential Systems",
    categoryLabel: "Residential Shared Indoor Family",
    title: "Floor Mounted Indoor Units",
    description:
      "CT Morley residential floor mounted indoor units provide an alternate installation style for both single-zone and compatible multi-zone applications.",
    specs: [
      { label: "Indoor Type", value: "Floor Mounted Indoor Unit" },
      { label: "Application", value: "Residential" },
      { label: "Heating", value: "Extreme" },
      { label: "Voltage", value: "220V" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["Floor Mounted", "Shared Indoor Platform", "Residential"],
    indoorUnits: [
      {
        model: "MIU-B12F-2",
        size: "12",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B12H-2"],
        },
      },
      {
        model: "MIU-B16F-2",
        size: "16",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B18H-2"],
        },
      },
      {
        model: "MIU-B18F-2",
        size: "18",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B18H-2"],
        },
      },
      {
        model: "MIU-B24F-2",
        size: "24",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B24H-2"],
        },
      },
    ],
    compatibleMultiZoneOutdoorUnits: residentialMultiZoneOutdoorUnits454B,
  },

  "residential-shared-ahu": {
    eyebrow: "Residential Systems",
    categoryLabel: "Residential Shared Indoor Family",
    title: "AHU Indoor Units",
    description:
      "CT Morley residential AHU indoor units support ducted single-zone applications and compatible multi-zone systems depending on outdoor unit selection.",
    specs: [
      { label: "Indoor Type", value: "AHU / Air Handler" },
      { label: "Application", value: "Residential" },
      { label: "Heating", value: "Extreme" },
      { label: "Voltage", value: "220V" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["AHU", "Shared Indoor Platform", "Residential"],
    indoorUnits: [
      {
        model: "MIU-B18V-2",
        size: "18",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B18H-2"],
        },
      },
      {
        model: "MIU-B24V-2",
        size: "24",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B24H-2"],
        },
      },
      {
        model: "MIU-B30V-2",
        size: "30",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B30H-2"],
        },
      },
      {
        model: "MIU-B36V-2",
        size: "36",
        voltage: "220V",
        heating: ["Extreme"],
        compatibleSingleZoneOutdoorUnits: {
          extreme: ["MOU-B36H-2"],
        },
      },
    ],
    compatibleMultiZoneOutdoorUnits: residentialMultiZoneOutdoorUnits454B,
  },

  "residential-a-coil": {
    eyebrow: "Residential Systems",
    categoryLabel: "Residential A Coil",
    title: "A Coil",
    description:
      "CT Morley residential A Coil units for matched residential applications.",
    specs: [
      { label: "Indoor Type", value: "A Coil" },
      { label: "Application", value: "Residential" },
      { label: "Voltage", value: "Varies by system" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Cooling / Heat Pump Match" },
    ],
    highlightTags: ["A Coil", "Residential", "Indoor Unit"],
    indoorUnits: [
      { model: "MAC-A3617", size: "36" },
      { model: "MAC-A4821", size: "48" },
      { model: "MAC-A6024", size: "60" },
    ],
  },

  "light-commercial-split-system-outdoor": {
    eyebrow: "Light Commercial Systems",
    categoryLabel: "Light Commercial Outdoor",
    title: "Split System Outdoor Units",
    description:
      "CT Morley light commercial split system outdoor units for larger-capacity applications, available in standard and extreme heating configurations.",
    specs: [
      { label: "System Type", value: "Light Commercial" },
      { label: "Mounting", value: "Outdoor Unit" },
      { label: "Application", value: "Light Commercial" },
      { label: "Heating", value: "Standard / Extreme" },
      { label: "Voltage", value: "Varies by system" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["Outdoor Unit", "Split System", "Light Commercial"],
    outdoorUnits: {
      splitSystemStandard: ["MOU-B36L-2", "MOU-B48L-2", "MOU-B60L-2"],
      splitSystemExtreme: ["MOU-B36LH-2", "MOU-B48LH-2", "MOU-B55LH-2"],
    },
  },

  "light-commercial-condenser-outdoor": {
    eyebrow: "Multi-Position AHU Systems",
    categoryLabel: "Light Commercial Outdoor",
    title: "Condenser Outdoor Units",
    description:
      "CT Morley light commercial condenser outdoor units for AHU and related larger-capacity applications, available in standard and extreme heating configurations.",
    specs: [
      { label: "System Type", value: "Light Commercial" },
      { label: "Mounting", value: "Outdoor Unit" },
      { label: "Application", value: "Light Commercial" },
      { label: "Heating", value: "Standard / Extreme" },
      { label: "Voltage", value: "Varies by system" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["Outdoor Unit", "Condenser", "Light Commercial"],
    outdoorUnits: {
      condenserStandard: [
        "MOU-B24V-4",
        "MOU-B30V-4",
        "MOU-B36V-4",
        "MOU-B48V-4",
        "MOU-B60V-4",
      ],
      condenserExtreme: [
        "MOU-B24VH-4",
        "MOU-B30VH-4",
        "MOU-B36VH-4",
        "MOU-B48VH-4",
        "MOU-B55VH-4",
      ],
    },
  },

  "light-commercial-cassette": {
    eyebrow: "Light Commercial Systems",
    categoryLabel: "Light Commercial Cassette",
    title: "Cassette Systems",
    description:
      "CT Morley light commercial cassette systems provide ceiling-mounted comfort solutions for larger-capacity applications.",
    specs: [
      { label: "System Type", value: "Light Commercial" },
      { label: "Mounting", value: "Cassette Indoor Unit" },
      { label: "Application", value: "Light Commercial" },
      { label: "Heating", value: "Standard / Extreme" },
      { label: "Voltage", value: "Varies by system" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["Cassette", "Light Commercial", "Indoor Unit"],
    indoorUnits: [
      { model: "MIU-B36LC-2", size: "36" },
      { model: "MIU-B48LC-2", size: "48" },
    ],
  },

  "light-commercial-ducted": {
    eyebrow: "Light Commercial Systems",
    categoryLabel: "Light Commercial Ducted",
    title: "Ducted Systems",
    description:
      "CT Morley light commercial ducted systems support larger concealed applications.",
    specs: [
      { label: "System Type", value: "Light Commercial" },
      { label: "Mounting", value: "Concealed Ducted Indoor Unit" },
      { label: "Application", value: "Light Commercial" },
      { label: "Heating", value: "Standard / Extreme" },
      { label: "Voltage", value: "Varies by system" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["Ducted", "Light Commercial", "Indoor Unit"],
    indoorUnits: [
      { model: "MIU-B36LD-2", size: "36" },
      { model: "MIU-B48LD-2", size: "48" },
      { model: "MIU-B60LD-2", size: "60" },
    ],
  },

  "light-commercial-floor-mounted": {
    eyebrow: "Light Commercial Systems",
    categoryLabel: "Light Commercial Floor Mounted",
    title: "Floor Mounted Systems",
    description:
      "CT Morley light commercial floor mounted systems provide an alternate indoor unit style for projects requiring larger-capacity comfort and flexible installation.",
    specs: [
      { label: "System Type", value: "Light Commercial" },
      { label: "Mounting", value: "Floor Mounted Indoor Unit" },
      { label: "Application", value: "Light Commercial" },
      { label: "Heating", value: "Standard / Extreme" },
      { label: "Voltage", value: "Varies by system" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["Floor Mounted", "Light Commercial", "Indoor Unit"],
    indoorUnits: [
      { model: "MIU-B36LF-2", size: "36" },
      { model: "MIU-B48LF-2", size: "48" },
      { model: "MIU-B60LF-2", size: "60" },
    ],
  },

  "light-commercial-ahu": {
    eyebrow: "Light Commercial Systems",
    categoryLabel: "Light Commercial AHU",
    title: "AHU Systems",
    description:
      "CT Morley light commercial AHU systems are designed for larger ducted applications.",
    specs: [
      { label: "System Type", value: "Light Commercial" },
      { label: "Mounting", value: "AHU / Air Handler" },
      { label: "Application", value: "Light Commercial" },
      { label: "Heating", value: "Standard / Extreme" },
      { label: "Voltage", value: "Varies by system" },
      { label: "Refrigerant", value: "R454B" },
      { label: "Operation", value: "Heating + Cooling" },
    ],
    highlightTags: ["AHU", "Light Commercial", "Indoor Unit"],
    indoorUnits: [
      { model: "MIU-B24V-4", size: "24" },
      { model: "MIU-B30V-4", size: "30" },
      { model: "MIU-B36V-4", size: "36" },
      { model: "MIU-B48V-4", size: "48" },
      { model: "MIU-B60V-4", size: "60" },
    ],
  },

  "accessories-heater-v4": {
    eyebrow: "Accessories",
    categoryLabel: "Accessories",
    title: "Heater for V-4 Model",
    description:
      "CT Morley heater accessories for V-4 model applications.",
    specs: [
      { label: "Category", value: "Accessory" },
      { label: "Accessory Type", value: "Heater" },
      { label: "Application", value: "Accessories" },
      { label: "Compatible Platform", value: "V-4 Model" },
      { label: "Refrigerant", value: "R454B" },
    ],
    highlightTags: ["Accessories", "Heater", "V-4 Model"],
    indoorUnits: [
      { model: "EAH-05B (UL)", size: "05" },
      { model: "EAH-08B (UL)", size: "08" },
      { model: "EAH-10B (UL)", size: "10" },
      { model: "EAH-15B (UL)", size: "15" },
    ],
  },

  "accessories-third-party-interface": {
    eyebrow: "Accessories",
    categoryLabel: "Accessories",
    title: "3rd Party Interface",
    description:
      "CT Morley third-party interface accessory for compatible systems.",
    specs: [
      { label: "Category", value: "Accessory" },
      { label: "Accessory Type", value: "3rd Party Interface" },
      { label: "Application", value: "Accessories" },
      { label: "Refrigerant", value: "R454B" },
    ],
    highlightTags: ["Accessories", "3rd Party Interface"],
    indoorUnits: [{ model: "M24VA-CT", size: "N/A" }],
  },
};

const productFamiliesR454B = Object.fromEntries(
  Object.entries(baseProductFamilies454B).map(([slug, family]) => [
    slug,
    setFamilyRefrigerant(family, "R454B"),
  ])
);

const productFamiliesR410A = Object.fromEntries(
  Object.entries(baseProductFamilies454B).map(([slug, family]) => {
    const r410aSlug = `${slug}-r410a`;

    const convertedFamily = pruneMissingModels(
      replaceBSeriesWithASeries(setFamilyRefrigerant(family, "R410A")),
      missingR410AModels
    );

    return [r410aSlug, convertedFamily];
  })
);

if (productFamiliesR410A["residential-multi-zone-outdoor-r410a"]) {
  productFamiliesR410A["residential-multi-zone-outdoor-r410a"].outdoorUnits =
    residentialMultiZoneOutdoorUnitsR410A;
}

[
  "residential-shared-wall-mounted-r410a",
  "residential-shared-ducted-r410a",
  "residential-shared-one-way-cassette-r410a",
  "residential-shared-four-way-cassette-r410a",
  "residential-shared-floor-mounted-r410a",
  "residential-shared-ahu-r410a",
].forEach((slug) => {
  if (productFamiliesR410A[slug]) {
    productFamiliesR410A[slug].compatibleMultiZoneOutdoorUnits =
      residentialMultiZoneOutdoorUnitsR410A;
  }
});

if (productFamiliesR410A["residential-single-zone-wall-mounted-r410a"]) {
  const extremeList =
    productFamiliesR410A["residential-single-zone-wall-mounted-r410a"]
      .singleZoneOutdoorUnits?.extreme || [];

  productFamiliesR410A["residential-single-zone-wall-mounted-r410a"]
    .singleZoneOutdoorUnits.extreme = extremeList.map((model) =>
    model === "MIU-A33HW-2 / MOU-A33H-2"
      ? "MIU-A33W-2 / MOU-A33H-2"
      : model
  );
}

export const productFamilies = {
  ...productFamiliesR454B,
  ...productFamiliesR410A,
};