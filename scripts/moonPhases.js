import { newMoonData } from "./newMoonData.js";

const moonGroups = [
  {
    name: "Hoʻonui",
    description: "The waxing moon phases. A time of growth and increase.",
    phaseDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    name: "Poepoe",
    description: "The full moon phases, representing fullness and balance.",
    phaseDays: [11, 12, 13, 14, 15, 16]
  },
  {
    name: "Emi",
    description:
      "The waning moon phases. A time of decrease and introspection.",
    phaseDays: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  }
];

const moonPhases = [
  {
    day: 1,
    name: "Hilo",
    description: "The first sliver of the moon appears",
    planting: "Good for planting root crops",
    fishing: "Favorable for beach and reef fishing"
  },
  {
    day: 2,
    name: "Hoaka",
    description: "The moon appears as a faint crescent",
    planting: "Good for planting trees",
    fishing: "Avoid fishing, fish are scared away"
  },
  {
    day: 3,
    name: "Kū Kahi",
    description: "Moon is slightly larger",
    planting: "Excellent for planting vegetables",
    fishing: "Great for fishing"
  },
  {
    day: 4,
    name: "Kū Lua",
    description: "Moon grows further",
    planting: "Plant leafy crops",
    fishing: "Excellent fishing"
  },
  {
    day: 5,
    name: "Kū Kolu",
    description: "Continued growth",
    planting: "Good for planting fruit trees",
    fishing: "Good for fishing"
  },
  {
    day: 6,
    name: "Kū Pau",
    description: "End of the Kū phases",
    planting: "Best for planting leafy greens",
    fishing: "Fishing remains favorable"
  },
  {
    day: 7,
    name: "ʻOle Kū Kahi",
    description: "First of the ʻOle phases",
    planting: "Not ideal for planting",
    fishing: "Poor for fishing"
  },
  {
    day: 8,
    name: "ʻOle Kū Lua",
    description: "The moon continues to grow",
    planting: "Avoid planting",
    fishing: "Fishing is poor"
  },
  {
    day: 9,
    name: "ʻOle Kū Kolu",
    description: "More growth",
    planting: "Planting and fishing both unfavorable",
    fishing: "Bad for fishing"
  },
  {
    day: 10,
    name: "ʻOle Kū Pau",
    description: "Final ʻOle phase",
    planting: "Avoid planting",
    fishing: "Poor fishing"
  },
  {
    day: 11,
    name: "Huna",
    description: "Moon becomes almost full",
    planting: "Good for all planting",
    fishing: "Good for fishing near reefs"
  },
  {
    day: 12,
    name: "Mōhalu",
    description: "Approaching full moon",
    planting: "Best for planting flowers",
    fishing: "Excellent for fishing"
  },
  {
    day: 13,
    name: "Hua",
    description: "Full moon rises",
    planting: "Favorable for planting crops that bear fruit",
    fishing: "Great for fishing"
  },
  {
    day: 14,
    name: "Akua",
    description: "Moon is full",
    planting: "Ideal for planting root crops",
    fishing: "Excellent fishing conditions"
  },
  {
    day: 15,
    name: "Hoku",
    description: "Peak fullness of the moon",
    planting: "Best for all crops",
    fishing: "Best for deep-sea fishing"
  },
  {
    day: 16,
    name: "Mahealani",
    description: "Full moon starts to wane",
    planting: "Good for planting all types",
    fishing: "Great for fishing"
  },
  {
    day: 17,
    name: "Kulu",
    description: "Slight decrease in moon size",
    planting: "Good for harvesting",
    fishing: "Good for fishing at sea"
  },
  {
    day: 18,
    name: "Lāʻau Kū Kahi",
    description: "Moon slowly diminishes",
    planting: "Favorable for planting trees",
    fishing: "Fishing is good"
  },
  {
    day: 19,
    name: "Lāʻau Kū Lua",
    description: "Further waning",
    planting: "Good for harvesting trees",
    fishing: "Fishing remains good"
  },
  {
    day: 20,
    name: "Lāʻau Pau",
    description: "End of Lāʻau phases",
    planting: "Best for harvesting fruit crops",
    fishing: "Fair fishing conditions"
  },
  {
    day: 21,
    name: "ʻOle Kū Kahi",
    description: "Start of ʻOle phases",
    planting: "Avoid planting",
    fishing: "Not good for fishing"
  },
  {
    day: 22,
    name: "ʻOle Kū Lua",
    description: "More waning",
    planting: "Not favorable for planting",
    fishing: "Poor fishing"
  },
  {
    day: 23,
    name: "ʻOle Kū Pau",
    description: "End of the ʻOle phases",
    planting: "Avoid planting",
    fishing: "Poor fishing"
  },
  {
    day: 24,
    name: "Kaloa Kū Kahi",
    description: "Moon gets smaller",
    planting: "Good for harvesting",
    fishing: "Fair fishing at sea"
  },
  {
    day: 25,
    name: "Kaloa Kū Lua",
    description: "Waning further",
    planting: "Good for harvesting root crops",
    fishing: "Good for deep-sea fishing"
  },
  {
    day: 26,
    name: "Kaloa Kū Pau",
    description: "Final Kāloa phase",
    planting: "Best for harvesting fruit and vegetables",
    fishing: "Good for fishing"
  },
  {
    day: 27,
    name: "Kāne",
    description: "Moon almost gone",
    planting: "Great for harvesting",
    fishing: "Fishing is favorable"
  },
  {
    day: 28,
    name: "Lono",
    description: "Small crescent",
    planting: "Good for all planting",
    fishing: "Excellent fishing at sea"
  },
  {
    day: 29,
    name: "Mauli",
    description: "Very little moon left",
    planting: "Best for harvesting",
    fishing: "Fair for fishing near the shore"
  },
  {
    day: 30,
    name: "Muku",
    description: "New moon, moon is not visible",
    planting: "Not ideal for planting",
    fishing: "Best fishing near the new moon"
  }
];

const getMoonGroup = (dayRef) => {
  /*
   * Ensure dayRef is within valid range (1-30)
   * If outside range, normalize it
   */
  let normalizedDay = dayRef;
  if (dayRef < 1) normalizedDay = 1;
  if (dayRef > 30) normalizedDay = 30;

  return moonGroups.find((group) => group.phaseDays.includes(normalizedDay));
};

const getMoonPhase = (dayRef) => {
  /*
   * Ensure dayRef is within valid range (1-30)
   * If outside range, normalize it
   */
  let normalizedDay = dayRef;
  if (dayRef < 1) normalizedDay = 1;
  if (dayRef > 30) normalizedDay = 30;

  const foundPhase = moonPhases.find((phase) => normalizedDay === phase.day);
  const foundGroup = getMoonGroup(normalizedDay);

  /*
   * Calculate absolute grid position within 32 total frames
   * Hoʻonui: grid positions 1-10 (with gap at 11)
   * Poepoe: grid positions 12-17 (with gap at 18)
   * Emi: grid positions 19-32
   */
  let gridPosition = 1;

  if (foundGroup) {
    const dayIndex = foundGroup.phaseDays.indexOf(normalizedDay);

    if (dayIndex !== -1) {
      if (foundGroup === moonGroups[0]) {
        /* Hoʻonui group: positions 1-10 */
        gridPosition = dayIndex + 1;
      } else if (foundGroup === moonGroups[1]) {
        /* Poepoe group: positions 12-17 (skip gap at 11) */
        gridPosition = dayIndex + 12;
      } else if (foundGroup === moonGroups[2]) {
        /* Emi group: positions 19-32 (skip gaps at 11 and 18) */
        gridPosition = dayIndex + 19;
      }
    }
  }

  /*
   * Ensure we always return valid data structure
   */
  return {
    day: normalizedDay,
    name: foundPhase?.name || "Unknown",
    description: foundPhase?.description || "Unknown phase",
    planting: foundPhase?.planting || "No guidance available",
    fishing: foundPhase?.fishing || "No guidance available",
    gridPosition: gridPosition,
    group: foundGroup
      ? { name: foundGroup.name, description: foundGroup.description }
      : { name: "Unknown", description: "Unknown group" }
  };
};

const getNewMoon = (yearRef, monthRef) => {
  const foundYear = newMoonData.find((data) => data[yearRef]) || {};
  const foundMonth =
    Object.values(foundYear)
      .flat()
      .find((data) => data.month === monthRef) || {};
  return foundMonth.day;
};

export {
  moonGroups,
  moonPhases as moonPhase,
  getMoonGroup,
  getMoonPhase,
  getNewMoon
};
