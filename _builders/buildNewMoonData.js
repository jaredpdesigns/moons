import { writeFile } from "fs/promises";

const buildMoonData = async () => {
  const currentYearNumber = new Date().getFullYear();
  const beforeCurrentYear = Array(50)
    .fill()
    .map((_, i) => currentYearNumber - 1 - i);
  const currentYear = [currentYearNumber];
  const afterCurrentYear = Array(50)
    .fill()
    .map((_, i) => currentYearNumber + 1 + i);
  const years = [
    ...beforeCurrentYear.reverse(),
    ...currentYear,
    ...afterCurrentYear
  ];
  const arr = [];

  for (const year of years) {
    try {
      const response = await fetch(
        `https://aa.usno.navy.mil/api/moon/phases/year?year=${year}`
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      arr.push({
        [year]: json.phasedata
          .filter((_) => _.phase === "New Moon")
          .map((phase) => ({ day: phase.day, month: phase.month }))
      });
    } catch (error) {
      console.error(error.message);
    }
  }
  writeFile("./_builders/newMoonData.json", JSON.stringify(arr, null, 2));
  console.log(`🌕 Built ${arr.length} years worth of moon data`);
};

buildMoonData();
