import { writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";

/**
 * Check if we have existing moon data that's sufficient
 * @returns {Promise<boolean>} True if data exists and is valid
 */
const hasValidExistingData = async () => {
  try {
    if (!existsSync("./scripts/newMoonData.js")) {
      return false;
    }

    const { newMoonData } = await import("../scripts/newMoonData.js");

    if (!Array.isArray(newMoonData) || newMoonData.length === 0) {
      return false;
    }

    const currentYear = new Date().getFullYear();
    const hasCurrentYear = newMoonData.some(
      (yearData) => Object.keys(yearData)[0] == currentYear.toString()
    );

    console.log(`📦 Found existing moon data with ${newMoonData.length} years`);
    if (hasCurrentYear) {
      console.log(`✅ Data includes current year (${currentYear})`);
    } else {
      console.log(`⚠️  Data missing current year (${currentYear})`);
    }

    return newMoonData.length >= 50; // Reasonable threshold for sufficient data
  } catch (error) {
    console.log(`⚠️  Error checking existing data: ${error.message}`);
    return false;
  }
};

/**
 * Sync JSON data to the scripts directory for use by the live site
 * @param {Array} data - The moon data to sync
 */
const syncToScripts = async (data) => {
  try {
    /*
     * Generate the scripts/newMoonData.js file content
     * that matches the existing format
     */
    const jsContent = `const newMoonData = ${JSON.stringify(data, null, 2)};

export { newMoonData };
`;

    await writeFile("./scripts/newMoonData.js", jsContent);
    console.log("🔄 Synced moon data to scripts/newMoonData.js");
  } catch (error) {
    console.error(`⚠️  Failed to sync to scripts: ${error.message}`);
  }
};

/**
 * Fetches moon phase data for a specific year from USNO API
 * @param {number} year - The year to fetch data for
 * @param {number} retries - Number of retries on failure
 * @returns {Promise<Object|null>} Moon phase data or null if failed
 */
const fetchYearData = async (year, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://aa.usno.navy.mil/api/moon/phases/year?year=${year}`,
        {
          timeout: 10000, // 10 second timeout
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for year ${year}`);
      }

      const json = await response.json();
      return {
        [year]: json.phasedata
          .filter((phase) => phase.phase === "New Moon")
          .map((phase) => ({ day: phase.day, month: phase.month }))
      };
    } catch (error) {
      if (attempt === retries) {
        console.error(
          `❌ Failed to fetch data for year ${year} after ${
            retries + 1
          } attempts: ${error.message}`
        );
        return null;
      } else {
        console.log(`⚠️  Retry ${attempt + 1}/${retries} for year ${year}`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        ); // Exponential backoff
      }
    }
  }
  return null;
};

/**
 * Fallback: Use existing static moon data if available
 * @returns {Promise<Array>} Existing moon data or empty array
 */
const loadExistingMoonData = async () => {
  try {
    if (existsSync("./scripts/newMoonData.js")) {
      const { newMoonData } = await import("../scripts/newMoonData.js");
      console.log(
        `📦 Loaded existing moon data with ${newMoonData.length} years`
      );
      return newMoonData;
    }
  } catch (error) {
    console.log(`⚠️  Could not load existing data: ${error.message}`);
  }
  return [];
};

/**
 * Processes requests in batches to avoid overwhelming the API
 * @param {Array} years - Array of years to process
 * @param {number} batchSize - Number of concurrent requests
 * @returns {Promise<Array>} Array of successful results
 */
const processBatches = async (years, batchSize = 5) => {
  const results = [];

  for (let i = 0; i < years.length; i += batchSize) {
    const batch = years.slice(i, i + batchSize);
    console.log(
      `🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        years.length / batchSize
      )} (years ${batch[0]}-${batch[batch.length - 1]})`
    );

    const batchPromises = batch.map((year) => fetchYearData(year));
    const batchResults = await Promise.all(batchPromises);

    // Filter out failed requests and add successful ones
    const successfulResults = batchResults.filter((result) => result !== null);
    results.push(...successfulResults);

    // Add delay between batches to be respectful to the API
    if (i + batchSize < years.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
};

const buildMoonData = async () => {
  console.log("🌙 Starting to build moon data...");

  if (await hasValidExistingData()) {
    console.log("⚡ Using existing moon data");
    console.log("🌕 Moon data already up-to-date!");
    return;
  }

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

  console.log(
    `📅 Fetching data for ${years.length} years (${years[0]} - ${
      years[years.length - 1]
    })`
  );

  try {
    const results = await processBatches(years);

    if (results.length === 0) {
      console.log("🔄 API unavailable, attempting to use existing data...");
      const existingData = await loadExistingMoonData();

      if (existingData.length > 0) {
        /* Data is already in scripts, no need to rewrite */
        console.log(
          `✅ Used existing moon data for ${existingData.length} years`
        );
        console.log(
          "📋 Consider updating the API data when connectivity is restored"
        );
        return;
      } else {
        throw new Error("No data available from API or existing sources");
      }
    }

    await syncToScripts(results);

    const failedCount = years.length - results.length;
    console.log(`✅ Successfully built moon data for ${results.length} years`);
    if (failedCount > 0) {
      console.log(`⚠️  ${failedCount} years failed to fetch`);
    }
    console.log("🌕 Moon data build complete!");
  } catch (error) {
    console.error(`💥 Critical error during build: ${error.message}`);
    process.exit(1);
  }
};

buildMoonData();
