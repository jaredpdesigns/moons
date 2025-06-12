import { writeFile } from "fs/promises";

/**
 * Build year data for a specific year
 * @param {number} targetYear - The year to build data for (defaults to current year)
 * @returns {Promise<Object>} The built year data
 */
const buildYearData = async (targetYear = new Date().getFullYear()) => {
  console.log(`📅 Building calendar data for ${targetYear}...`);

  /*
   * Import the month constructors dynamically to get fresh data
   */
  const { builtMonth } = await import("../scripts/monthConstructors.js");

  const builtYear = new Array(12).fill(0).map((_, i) => {
    const monthNumber = i + 1;
    const month = new Date(targetYear, i + 1, 0);
    const monthName = month.toLocaleString("en-US", {
      month: "long"
    });

    /*
     * Get the built month data for this specific month
     */
    const foundData = builtMonth(monthNumber);

    if (!foundData) {
      throw new Error(`Could not build data for ${monthName} ${targetYear}`);
    }

    return {
      monthNumber,
      monthName,
      ...foundData
    };
  });

  return builtYear;
};

const buildYear = async () => {
  console.log("🗓️  Starting to build year data...");

  try {
    const targetYear = new Date().getFullYear();
    const builtYear = await buildYearData(targetYear);

    /*
     * Validate that builtYear data is properly constructed
     */
    if (!builtYear || !Array.isArray(builtYear) || builtYear.length !== 12) {
      throw new Error("Invalid builtYear data structure");
    }

    /*
     * Write current year data
     */
    await writeFile(
      "./_builders/currentYear.json",
      JSON.stringify(builtYear, null, 2)
    );

    /*
     * Calculate and display statistics about the generated data
     */
    const totalDays = builtYear.reduce((total, month) => {
      return total + (month.monthBuilt ? month.monthBuilt.length : 0);
    }, 0);

    const leapYear =
      targetYear % 4 === 0 &&
      (targetYear % 100 !== 0 || targetYear % 400 === 0);
    const expectedDays = leapYear ? 366 : 365;

    console.log(`✅ Successfully built year data for ${targetYear}`);
    console.log(`📊 Generated ${totalDays} days (expected: ${expectedDays})`);

    if (totalDays !== expectedDays) {
      console.log(
        `⚠️  Day count mismatch - this may indicate an issue with moon phase calculations`
      );
    }

    console.log("🌙 Year data build complete!");
  } catch (error) {
    console.error(`💥 Error building year data: ${error.message}`);
    process.exit(1);
  }
};

buildYear();
