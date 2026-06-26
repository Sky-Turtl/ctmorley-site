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
    dimensions: {
      standard: {
        "MIU-B09W-1 / MOU-B09G-1": {
          Indoor: { width: "28 3/4", depth: "7 7/8", height: "11 1/2" },
          Outdoor: { width: "30 1/8", depth: "11 15/16", height: "21 7/8" },
        },
        "MIU-B12W-1 / MOU-B12G-1": {
          Indoor: {  width: "31 5/8", depth: "7 7/8", height: "11 5/8" },
          Outdoor: { width: "30 1/8", depth: "11 15/16", height: "21 7/8" },
        },
        "MIU-B09GW-2 / MOU-B09G-2": {
          Indoor: { width: "28 3/4", depth: "7 7/8", height: "11 1/2" },
          Outdoor: { width: "30 1/8", depth: "11 15/16", height: "21 7/8" },
        },
        "MIU-B12GW-2 / MOU-B12G-2": {
          Indoor: { width: "31 5/8", depth: "7 7/8", height: "11 5/8" },
          Outdoor: { width: "30 1/8", depth: "11 15/16", height: "21 7/8" },
        },  
        "MIU-B18GW-2 / MOU-B18G-2": {
          Indoor: { width: "38 1/4", depth: "9", height: "12 11/16" },
          Outdoor: { width: "31 3/4", depth: "13", height: "21 13/16" },
        },
        "MIU-B24GW-2 / MOU-B24G-2": {
          Indoor: {  width: "42 5/8", depth: "9 1/4", height: "13 5/16" },
          Outdoor: {  width: "35 1/16", depth: "13 1/2", height: "26 1/2" },
        },
        "MIU-B30W-2 / MOU-B30G-2": {
          Indoor: { width: "49 5/8", depth: "11 3/16", height: "14 5/16" },
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },
        },
        "MIU-B36W-2 / MOU-B36G-2": {
          Indoor: { width: "49 5/8", depth: "11 3/16", height: "14 5/16" },
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },
        },
      },
      extreme: {
        "MIU-B09W-2 / MOU-B09H-2": {
          Indoor: { width: "31 5/8", depth: "7 7/8", height: "11 5/8" },
          Outdoor: {  width: "31 3/4", depth: "13", height: "21 13/16" },
        },
        "MIU-B12W-2 / MOU-B12H-2": {
          Indoor: { width: "31 5/8", depth: "7 7/8", height: "11 5/8" },
          Outdoor: {  width: "31 3/4", depth: "13", height: "21 13/16" },
        },
        "MIU-B18W-2 / MOU-B18H-2": {
          Indoor: { width: "42 5/8", depth: "9 1/4", height: "13 5/16" },
          Outdoor: {  width: "35 1/16", depth: "13 1/2", height: "26 1/2" },
        },
        "MIU-B24W-2 / MOU-B24H-2": {
          Indoor: { width: "42 5/8", depth: "9 1/4", height: "13 5/16" },
          Outdoor: {  width: "37 1/4", depth: "16 3/16", height: "31 15/16" },
        },
        "MIU-B33HW-2 / MOU-B33H-2": {
          Indoor: { width: "49 5/8", depth: "11 3/16", height: "14 5/16" },
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },
        }
      }
    },
    pipeSizes: {
      standard: {
        "MIU-B09W-1 / MOU-B09G-1": {
          Liquid: "1/4\"",
          Gas: "3/8\"",
        },
        "MIU-B12W-1 / MOU-B12G-1": {
          Liquid: "1/4\"",
          Gas: "3/8\"",
        },
        "MIU-B09GW-2 / MOU-B09G-2": {
          Liquid: "1/4\"",
          Gas: "3/8\"",
        },
        "MIU-B12GW-2 / MOU-B12G-2": {
          Liquid: "1/4\"",
          Gas: "3/8\"",
        },
        "MIU-B18GW-2 / MOU-B18G-2": {
          Liquid: "1/4\"",
          Gas: "1/2\"",
        },
        "MIU-B24GW-2 / MOU-B24G-2": {
          Liquid: "3/8\"",
          Gas: "5/8\"",
        },
        "MIU-B30W-2 / MOU-B30G-2": {
          Liquid: "3/8\"",
          Gas: "5/8\"",
        },
        "MIU-B36W-2 / MOU-B36G-2": {
          Liquid: "3/8\"",
          Gas: "5/8\"",
        },
      },
      extreme: {
        "MIU-B09W-2 / MOU-B09H-2": {
          Liquid: "1/4\"",
          Gas: "3/8\"",
        },
        "MIU-B12W-2 / MOU-B12H-2": {
          Liquid: "1/4\"",
          Gas: "3/8\"",
        },
        "MIU-B18W-2 / MOU-B18H-2": {
          Liquid: "1/4\"",
          Gas: "1/2\"",
        },
        "MIU-B24W-2 / MOU-B24H-2": {
          Liquid: "3/8\"",
          Gas: "5/8\"",
        },
        "MIU-B33HW-2 / MOU-B33H-2": {
          Liquid: "3/8\"",
          Gas: "3/4\"",
        },
      }
    },
    operatingRanges: {
      standard: {
        "MIU-B09W-1 / MOU-B09G-1": {
          Cooling: {
            f: [5,122],
            c: [-15,50],
          },
          Heating: {
            f: [5,75],
            c: [-15,24]
          }
        },
        "MIU-B12W-1 / MOU-B12G-1": {
          Cooling: {
            f: [5,122],
            c: [-15,50],
          },
          Heating: {
            f: [5,75],
            c: [-15,24]
          }
        },
        "MIU-B09GW-2 / MOU-B09G-2": {
          Cooling: {
            f: [5,122],
            c: [-15,50],
          },
          Heating: {
            f: [5,75],
            c: [-15,24]
          }
        },
        "MIU-B12GW-2 / MOU-B12G-2": {
          Cooling: {
            f: [5,122],
            c: [-15,50],
          },
          Heating: {
            f: [5,75],
            c: [-15,24]
          }
        },
        "MIU-B18GW-2 / MOU-B18G-2": {
          Cooling: {
            f: [5,122],
            c: [-15,50],
          },
          Heating: {
            f: [5,75],
            c: [-15,24]
          }
        },
        "MIU-B24GW-2 / MOU-B24G-2": { 
          Cooling: {
            f: [5,122],
            c: [-15,50],
          },
          Heating: {
            f: [5,75],
            c: [-15,24]
          }
        },
        "MIU-B30W-2 / MOU-B30G-2": {
          Cooling: {
            f: [-13,122],
            c: [-25,50],
          },
          Heating: {
            f: [-13,75],
            c: [-25,24]
          }
        },
        "MIU-B36W-2 / MOU-B36G-2": {
          Cooling: {
            f: [-13,122],
            c: [-25,50],
          },
          Heating: {
            f: [-13,75],
            c: [-25,24]
          }
        },
      },
      extreme: {
        "MIU-B09W-2 / MOU-B09H-2": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f: [-22, 75],
            c: [-30, 24]
          }
        },
        "MIU-B12W-2 / MOU-B12H-2": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f: [-22, 75],
            c: [-30, 24]
          }
        },
        "MIU-B18W-2 / MOU-B18H-2": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f: [-22, 75],
            c: [-30, 24]
          }
        },
        "MIU-B24W-2 / MOU-B24H-2": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f: [-22, 75],
            c: [-30, 24]
          }
        },
        "MIU-B33HW-2 / MOU-B33H-2": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f: [-22, 75],
            c: [-30, 24]
          }
        }
      },
    },
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
    dimensions: {
      standard: {
        "MOU-3B18G-2": {
          Outdoor: { width: "35 1/16", depth: "13 1/2", height: "26 1/2" },
        },
        "MOU-4B27G-2": {
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },
        },
        "MOU-5B36G-2": {
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },
        },
        "MOU-6B48G-2": {
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },
        },
        "MOU-6B60G-2": {
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },
        },
      },
      extreme: {
        "MOU-3B18H-2": {
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },
        },
        "MOU-4B27H-2": {
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },
        },
        "MOU-5B36H-2": {
          Outdoor: { width: "38 5/8", depth: "16 3/8", height: "38 7/16" },
        },
        "MOU-6B48H-2": {
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },
        },
        "MOU-6B55H-2": {
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },
        },
      },
    },
    pipeSizes: {
      standard: {
        "MOU-3B18G-2": {
          Liquid: "3 x 1/4\"",
          Gas: "3 x 3/8\"",
        },
        "MOU-4B27G-2": {
          Liquid: "4 x 1/4\"",
          Gas: "3 x 3/8 + 1 x 1/2\"",
        },
        "MOU-5B36G-2": {
          Liquid: "5 x 1/4\"",
          Gas: "4 x 3/8 + 1 x 1/2\"",
        },
        "MOU-6B48G-2": {
          Liquid: "6 x 1/4\"",
          Gas: "4 x 3/8 + 2 x 1/2\"",
        },
        "MOU-6B60G-2": {
          Liquid: "6 x 1/4\"",
          Gas: "4 x 3/8 + 2 x 1/2\"",
        },
      },
      extreme: {
        "MOU-3B18H-2": {
          Liquid: "3 x 1/4\"",
          Gas: "3 x 3/8\"",
        },
        "MOU-4B27H-2": {
          Liquid: "4 x 1/4\"",
          Gas: "3 x 3/8 + 1 x 1/2\"",
        },
        "MOU-5B36H-2": {
          Liquid: "5 x 1/4\"",
          Gas: "3 x 3/8 + 2 x 1/2\"",
        },
        "MOU-6B48H-2": {
          Liquid: "6 x 1/4\"",
          Gas: "4 x 3/8 + 2 x 1/2\"",
        },
        "MOU-6B55H-2": {
          Liquid: "6 x 1/4\"",
          Gas: "4 x 3/8 + 2 x 1/2\"",
        },
      },
    },
    operatingRanges: {
      standard: {
        "MOU-3B18G-2": {
          Cooling: {
            f: [-13, 122],
            c: [-25, 50],
          },
          Heating: {
            f: [-13, 75],
            c: [-25, 24],
          }
        },
        "MOU-4B27G-2": {
          Cooling: {
            f: [-13, 122],
            c: [-25, 50],
          },
          Heating: {
            f: [-13, 75],
            c: [-25, 24],
          }
        },
        "MOU-5B36G-2": {
          Cooling: {
            f: [-13, 122],
            c: [-25, 50],
          },
          Heating: {
            f: [-13, 75],
            c: [-25, 24],
          }
        },
        "MOU-6B48G-2": {
          Cooling: {
            f: [-13, 122],
            c: [-25, 50],
          },
          Heating: {
            f: [-13, 75],
            c: [-25, 24],
          }
        },
        "MOU-6B60G-2": {
          Cooling: {
            f: [-13, 122],
            c: [-25, 50],
          },
          Heating: {
            f: [-13, 75],
            c: [-25, 24],
          }
        },
      },
      extreme: {
        "MOU-3B18H-2": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f: [-22, 75],
            c: [-30, 24],
          }
        },
        "MOU-4B27H-2": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f: [-22, 75],
            c: [-30, 24],
          }
        },
        "MOU-5B36H-2": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f: [-22, 75],
            c: [-30, 24],
          }
        },
        "MOU-6B48H-2": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f: [-22, 75],
            c: [-30, 24],
          }
        },
        "MOU-6B55H-2": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f: [-22, 75],
            c: [-30, 24],
          }
        },
      }
    },
    ports: {
      standard: {
        "MOU-3B18G-2": 3,
        "MOU-4B27G-2": 4,
        "MOU-5B36G-2": 5,
        "MOU-6B48G-2": 6,
        "MOU-6B60G-2": 6,
      },
      extreme: {
        "MOU-3B18H-2": 3,
        "MOU-4B27H-2": 4,
        "MOU-5B36H-2": 5,
        "MOU-6B48H-2": 6,
        "MOU-6B55H-2": 6,
      },
    },
    mca:{
      standard: {
        "MOU-3B18G-2": 16,
        "MOU-4B27G-2": 23,
        "MOU-5B36G-2": 30.5,
        "MOU-6B48G-2": 40,
        "MOU-6B60G-2": 40,
      },
      extreme: {
        "MOU-3B18H-2": 17.5,
        "MOU-4B27H-2": 30,
        "MOU-5B36H-2": 37,
        "MOU-6B48H-2": 43,
        "MOU-6B55H-2": 43,
      },
    },
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
    dimensions: {
      "MIU-B06W-2" : {
        Indoor: { width: "28 3/4", depth: "7 7/8", height: "11 1/2" },
      },
      "MIU-B09W-2": {
        Indoor: { width: "31 5/8", depth: "7 7/8", height: "11 5/8" },
      },
      "MIU-B12W-2": {
        Indoor: { width: "31 5/8", depth: "7 7/8", height: "11 5/8" },
      },
      "MIU-B18W-2": {
        Indoor: { width: "42 5/8", depth: "9 1/4", height: "13 5/16" },
      },
      "MIU-B24W-2": {
        Indoor: { width: "42 5/8", depth: "9 1/4", height: "13 5/16" },
      },
    },
    pipeSizes: {
      "MIU-B06W-2": {
        Liquid: "1/4\"",
        Gas: "3/8\"",
      },
      "MIU-B09W-2": {
        Liquid: "1/4\"",
        Gas: "3/8\"",
      },
      "MIU-B12W-2": {
        Liquid: "1/4\"",
        Gas: "3/8\"",
      },
      "MIU-B18W-2": {
        Liquid: "1/4\"",
        Gas: "1/2\"",
      },
      "MIU-B24W-2": {
        Liquid: "3/8\"",
        Gas: "5/8\"",
      },
    },
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
    dimensions: {
      "MIU-B09D-2": {
        Indoor: {width: "27 9/16", depth: "29 9/16", height: "9 11/16" },
      },
      "MIU-B12D-2": {
        Indoor: {width: "27 9/16", depth: "29 9/16", height: "9 11/16" },
      },
      "MIU-B18D-2": { 
        Indoor: {width : "39 3/8", depth: "29 9/16", height: "9 11/16" },
      },
      "MIU-B24D-2": {
        Indoor: {width: "39 3/8", depth: "29 9/16", height: "9 11/16" },
      }
    },
    pipeSizes: {
      "MIU-B09D-2": {
        Liquid: "1/4\"",
        Gas: "3/8\"",
      },
      "MIU-B12D-2": {
        Liquid: "1/4\"",
        Gas: "3/8\"",
      },
      "MIU-B18D-2": {
        Liquid: "1/4\"",
        Gas: "1/2\"",
      },
      "MIU-B24D-2": {
        Liquid: "3/8\"",
        Gas: "5/8\"",
      },
    },
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
    dimensions: {
      "MIU-B09CO-2": {
        Indoor: { width: "50 3/8", depth: "13 1/4", height: "9" },
      },
      "MIU-B12CO-2": {
        Indoor: { width: "50 3/8", depth: "13 1/4", height: "9" },
      },
      "MIU-B18CO-2": {
        Indoor: { width: "50 3/8", depth: "13 1/4", height: "9" },
      },
    },
    pipeSizes: {
      "MIU-B09CO-2": {
        Liquid: "1/4\"",
        Gas: "3/8\"", 
      },
      "MIU-B12CO-2": {
        Liquid: "1/4\"",
        Gas: "3/8\"",
      },
      "MIU-B18CO-2": {
        Liquid: "1/4\"",
        Gas: "1/2\"",
      },
    },
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
    dimensions: {
      "MIU-B09C-2": {
        Indoor: {width: "22 1/2", depth: "22 1/2", height: "9 11/16" },
      },
      "MIU-B12C-2": {
        Indoor: {width: "22 1/2", depth: "22 1/2", height: "9 11/16" },
      },
      "MIU-B18C-2": {
        Indoor: {width: "22 1/2", depth: "22 1/2", height: "9 11/16" },
      },
      "MIU-B24C-2": {
        Indoor: {width: "32 11/16", depth: "32 11/16", height: "8 1/8" },
      },
    },
    pipeSizes: {
      "MIU-B09C-2": {
        Liquid: "1/4\"",
        Gas: "3/8\"",
      },
      "MIU-B12C-2": {
        Liquid: "1/4\"",
        Gas: "3/8\"",
      },
      "MIU-B18C-2": {
        Liquid: "1/4\"",
        Gas: "1/2\"",
      },
      "MIU-B24C-2": {
        Liquid: "3/8\"",
        Gas: "5/8\"",
      },
    },
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
    dimensions: { 
      "MIU-B12F-2": {
        Indoor: { width: "31 5/16", depth: "7 7/8", height: "24 1/2" },
      },
      "MIU-B16F-2": {
        Indoor: { width: "31 5/16", depth: "7 7/8", height: "24 1/2" },
      },
      "MIU-B18F-2": {
        Indoor: { width: "42 1/16", depth: "26 5/8", height: "9 5/16" },
      },
      "MIU-B24F-2": {
        Indoor: { width: "42 1/16", depth: "26 5/8", height: "9 5/16" },
      }
    },
    pipeSizes: {
      "MIU-B12F-2": {
        Liquid: "1/4\"",
        Gas: "3/8\"",
      },
      "MIU-B16F-2": {
        Liquid: "1/4\"",
        Gas: "1/2\"",
      },
      "MIU-B18F-2": {
        Liquid: "1/4\"",
        Gas: "1/2\"",
      },
      "MIU-B24F-2": {
        Liquid: "3/8\"",
        Gas: "5/8\"",
      },
    },
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
    dimensions: {
      "MIU-B18V-2": {
        Indoor: { width: "21 1/16", depth: "17 9/16", height: "45" },	
      },
      "MIU-B24V-2": {
        Indoor: { width: "21 1/16", depth: "17 9/16", height: "45" },
      },
      "MIU-B30V-2": {
        Indoor: { width: "21 1/16", depth: "17 9/16", height: "45" },
      },
      "MIU-B36V-2": {
        Indoor: { width: "21 1/16", depth: "17 9/16", height: "45" },		
      }
    },
    pipeSizes :{
      "MIU-B18V-2": {
        Liquid: "1/4\"",
        Gas: "1/2\""
      },
      "MIU-B24V-2": {
        Liquid: "3/8\"",
        Gas: "5/8 \""
      },
      "MIU-B30V-2": {
        Liquid: "3/8\"",
        Gas: "5/8\""
      },
      "MIU-B36V-2": {
        Liquid: "3/8\"",
        Gas: "5/8\""
      }
    },    
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
    dimensions: {
      standard: {
        "MIU-B24V-4 / MOU-B24V-4": {
          Indoor: { width: "17 9/16", depth: "21 1/16", height: "45" },		
          Outdoor: { width: "35 1/16", depth: "13 1/2", height: "26 1/2" },		
        },
        "MIU-B30V-4 / MOU-B30V-4": {
          Indoor: { width: "21 1/16", depth: "21 1/16", height: "49 1/16" },		
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },		
        },
        "MIU-B36V-4 / MOU-B36V-4": {
          Indoor: { width: "21 1/16", depth: "21 1/16", height: "49 1/16" },		
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },		
        },
        "MIU-B48V-4 / MOU-B48V-4": {
          Indoor: { width: "24 1/2", depth: "21 1/16", height: "53" },		
          Outdoor: { width: "38 5/8", depth: "16 3/8", height: "38 7/16" },		
        },
        "MIU-B60V-4 / MOU-B60V-4": {
          Indoor: { width: "24 1/2", depth: "21 1/16", height: "53" },		
          Outdoor: { width: "38 5/8", depth: "16 3/8", height: "38 7/16" },		
        }
      },
      extreme:{
        "MIU-B24V-4 / MOU-B24VH-4": {
          Indoor: { width: "17 9/16", depth: "21 1/16", height: "45" },		
          Outdoor: { width: "35 1/16", depth: "13 1/2", height: "26 1/2" },		
        },
        "MIU-B30V-4 / MOU-B30VH-4": {
          Indoor: { width: "21 1/16", depth: "21 1/16", height: "49 1/16" },		
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },		
        },
        "MIU-B36V-4 / MOU-B36VH-4": {
          Indoor: { width: "21 1/16", depth: "21 1/16", height: "49 1/16" },		
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },		
        },
        "MIU-B48V-4 / MOU-B48VH-4": {
          Indoor: { width: "24 1/2", depth: "21 1/16", height: "53" },		
          Outdoor: { width: "38 5/8", depth: "16 3/8", height: "38 7/16" },		
        },
        "MIU-B60V-4 / MOU-B55VH-4": {
          Indoor: { width: "24 1/2", depth: "21 1/16", height: "53" },		
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        }
      }
    },
    pipeSizes: {
      standard: {
        "MIU-B24V-4 / MOU-B24V-4": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B30V-4 / MOU-B30V-4": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B36V-4 / MOU-B36V-4": { 
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B48V-4 / MOU-B48V-4": { 
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B60V-4 / MOU-B60V-4": { 
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
      },
      extreme: {
        "MIU-B24V-4 / MOU-B24VH-4": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B30V-4 / MOU-B30VH-4": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B36V-4 / MOU-B36VH-4": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B48V-4 / MOU-B48VH-4": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B60V-4 / MOU-B55VH-4": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        }
      }
    },
    operatingRanges: {
      standard:{ 
        "MIU-B24V-4 / MOU-B24V-4": {
          Cooling: {
            f: [-13, 122],
            c: [-25, 50],
          },
          Heating: {
            f: [-13, 75],
            c: [-25, 24]
          }
        },
        "MIU-B30V-4 / MOU-B30V-4": {
          Cooling: {
            f: [-13, 122],
            c: [-25, 50],
          },
          Heating: {
            f: [-13, 75],
            c: [-25, 24]
          }
        },
        "MIU-B36V-4 / MOU-B36V-4": {
          Cooling: {
            f: [-13, 122],
            c: [-25, 50],
          },
          Heating: {
            f: [-13, 75],
            c: [-25, 24]
          }
        },
        "MIU-B48V-4 / MOU-B48V-4": {
          Cooling: {
            f: [-13, 122],
            c: [-25, 50],
          },
          Heating: {
            f: [-13, 75],
            c: [-25, 24]
          }
        },
        "MIU-B60V-4 / MOU-B60V-4": {
          Cooling: {
            f: [-13, 122],
            c: [-25, 50],
          },
          Heating: {
            f: [-13, 75],
            c: [-25, 24]
          }
        },
      },
      extreme:{
        "MIU-B24V-4 / MOU-B24VH-4": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f:[-22, 75],
            c:[-30, 24]
          }
        },
        "MIU-B30V-4 / MOU-B30VH-4": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f:[-22, 75],
            c:[-30, 24]
          }
        },
        "MIU-B36V-4 / MOU-B36VH-4": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f:[-22, 75],
            c:[-30, 24]
          }
        },
        "MIU-B48V-4 / MOU-B48VH-4": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f:[-22, 75],
            c:[-30, 24]
          }
        },
        "MIU-B60V-4 / MOU-B55VH-4": {
          Cooling: {
            f: [-22, 122],
            c: [-30, 50],
          },
          Heating: {
            f:[-22, 75],
            c:[-30, 24]
          }
        },
      }
    },
    highlightTags: ["Outdoor Unit", "Condenser", "Light Commercial"],
    outdoorUnits: {
      standard: [
        "MIU-B24V-4 / MOU-B24V-4",
        "MIU-B30V-4 / MOU-B30V-4",
        "MIU-B36V-4 / MOU-B36V-4",
        "MIU-B48V-4 / MOU-B48V-4",
        "MIU-B60V-4 / MOU-B60V-4",
      ],
      extreme: [
        "MIU-B24V-4 / MOU-B24VH-4",
        "MIU-B30V-4 / MOU-B30VH-4",
        "MIU-B36V-4 / MOU-B36VH-4",
        "MIU-B48V-4 / MOU-B48VH-4",
        "MIU-B60V-4 / MOU-B55VH-4",
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
    dimensions: {
      standard: {
        "MIU-B36LC-2 / MOU-B36L-2": {
          Indoor: { width: "32 11/16", depth: "32 11/16", height: "9 11/16" },		
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },		
        },
        "MIU-B48LC-2 / MOU-B48L-2": {
          Indoor: { width: "32 11/16", depth: "32 11/16", height: "11 5/16" },		
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        },
      },
      extreme: {
        "MIU-B36LC-2 / MOU-B36LH-2": {
          Indoor: { width: "32 11/16", depth: "32 11/16", height: "9 11/16" },		
          Outdoor: { width: "38 5/8", depth: "16 3/8", height: "38 7/16" },		
        },
        "MIU-B48LC-2 / MOU-B48LH-2": {
          Indoor: { width: "32 11/16", depth: "32 11/16", height: "11 5/16" },		
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        },
      }
    },
    pipeSizes: {
      standard: {
        "MIU-B36LC-2 / MOU-B36L-2": {
          Liquid: "3/8\"",
          Gas: "3/4\"",
        },
        "MIU-B48LC-2 / MOU-B48L-2": {
          Liquid: "3/8\"",
          Gas: "3/4\"",
        },
      },
      extreme: {
        "MIU-B36LC-2 / MOU-B36LH-2": {
          Liquid: "3/8\"",
          Gas: "3/4\"",
        },
        "MIU-B48LC-2 / MOU-B48LH-2": {
          Liquid: "3/8\"",
          Gas: "3/4\"",
        },
      }
    },
    highlightTags: ["Cassette", "Light Commercial", "Indoor Unit"],
    pairings: {
      standard: [
        "MIU-B36LC-2 / MOU-B36L-2",
        "MIU-B48LC-2 / MOU-B48L-2",
      ],
      extreme: [
        "MIU-B36LC-2 / MOU-B36LH-2",
        "MIU-B48LC-2 / MOU-B48LH-2",
      ],
    },
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
    dimensions: {
      standard: {
        "MIU-B36LD-2 / MOU-B36L-2": {
          Indoor: { width: "47 1/4", depth: "29 9/16", height: "11 13/16" },		
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },		
        },
        "MIU-B48LD-2 / MOU-B48L-2": {
          Indoor: { width: "47 1/4", depth: "29 9/16", height: "11 13/16" },		
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        },
        "MIU-B60LD-2 / MOU-B60L-2": {
          Indoor: { width: "55 1/8", depth: "31 1/2", height: "15" },		
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        }
      },
      extreme: {
        "MIU-B36LD-2 / MOU-B36LH-2": {
          Indoor: { width: "47 1/4", depth: "29 9/16", height: "11 13/16" },		
          Outdoor: { width: "38 5/8", depth: "16 3/8", height: "38 7/16" },		
        },
        "MIU-B48LD-2 / MOU-B48LH-2": {
          Indoor: { width: "47 1/4", depth: "29 9/16", height: "11 13/16" },		
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        },
        "MIU-B60LD-2 / MOU-B55LH-2": {
          Indoor: { width: "55 1/8", depth: "31 1/2", height: "15" },		
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        }
      }
    },
    pipeSizes: {
      standard: {
        "MIU-B36LD-2 / MOU-B36L-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B48LD-2 / MOU-B48L-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B60LD-2 / MOU-B60L-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
      },
      extreme: {
        "MIU-B36LD-2 / MOU-B36LH-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B48LD-2 / MOU-B48LH-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B60LD-2 / MOU-B55LH-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        }
      }
    },
    highlightTags: ["Ducted", "Light Commercial", "Indoor Unit"],
    pairings: {
      standard: [
        "MIU-B36LD-2 / MOU-B36L-2",
        "MIU-B48LD-2 / MOU-B48L-2",
        "MIU-B60LD-2 / MOU-B60L-2",
      ],
      extreme: [
        "MIU-B36LD-2 / MOU-B36LH-2",
        "MIU-B48LD-2 / MOU-B48LH-2",
        "MIU-B60LD-2 / MOU-B55LH-2",
      ],
    },
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
    dimensions: {
      standard: {
        "MIU-B36LF-2 / MOU-B36L-2": {
          Indoor: { width: "65", depth: "26 5/8", height: "9 1/4" },		
          Outdoor: { width: "37 1/4", depth: "16 3/16", height: "31 15/16" },		
        },
        "MIU-B48LF-2 / MOU-B48L-2": {
          Indoor: { width: "65", depth: "26 5/8", height: "9 1/4" },		
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        },
        "MIU-B60LF-2 / MOU-B60L-2": {
          Indoor: { width: "65", depth: "26 5/8", height: "9 1/4" },		
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        }
      },
      extreme: {
        "MIU-B36LF-2 / MOU-B36LH-2": {
          Indoor: { width: "65", depth: "26 5/8", height: "9 1/4" },	
          Outdoor: { width: "38 5/8", depth: "16 3/8", height: "38 7/16" },		
        },
        "MIU-B48LF-2 / MOU-B48LH-2": {
          Indoor: { width: "65", depth: "26 5/8", height: "9 1/4" },	
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        },
        "MIU-B60LF-2 / MOU-B55LH-2": {
          Indoor: { width: "65", depth: "26 5/8", height: "9 1/4" },	
          Outdoor: { width: "37 1/2", depth: "16 3/8", height: "52 1/2" },		
        },
      }
    },
    pipeSizes: {
      standard: {
        "MIU-B36LF-2 / MOU-B36L-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B48LF-2 / MOU-B48L-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B60LF-2 / MOU-B60L-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        }
      },
      extreme: {
        "MIU-B36LF-2 / MOU-B36LH-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B48LF-2 / MOU-B48LH-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
        "MIU-B60LF-2 / MOU-B55LH-2": {
          Liquid: "3/8\"",
          Gas: "3/4\""
        },
      }
    },
    highlightTags: ["Floor Mounted", "Light Commercial", "Indoor Unit"],
    pairings: {
      standard: [
        "MIU-B36LF-2 / MOU-B36L-2",
        "MIU-B48LF-2 / MOU-B48L-2",
        "MIU-B60LF-2 / MOU-B60L-2",
      ],
      extreme: [
        "MIU-B36LF-2 / MOU-B36LH-2",
        "MIU-B48LF-2 / MOU-B48LH-2",
        "MIU-B60LF-2 / MOU-B55LH-2",
      ],
    },
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