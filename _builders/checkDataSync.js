import { readFile, stat } from "fs/promises";
import { existsSync } from "fs";

/**
 * Check if files are in sync by comparing modification times and content
 */
const checkDataSync = async () => {
  console.log("🔍 Checking data synchronization status...\n");

  const checks = [];

  try {
    // Check 1: Moon data file existence and content
    const scriptMoonExists = existsSync("./scripts/newMoonData.js");

    checks.push({
      name: "Moon Data Files",
      status: scriptMoonExists ? "✅ PASS" : "❌ FAIL",
      details: `scripts/newMoonData.js: ${
        scriptMoonExists ? "exists" : "missing"
      }`
    });

    if (scriptMoonExists) {
      // Check 2: Moon data content validation
      try {
        const { newMoonData } = await import("../scripts/newMoonData.js");

        const currentYear = new Date().getFullYear();
        const hasCurrentYear = newMoonData.some(
          (yearData) => Object.keys(yearData)[0] == currentYear.toString()
        );

        checks.push({
          name: "Moon Data Content",
          status: hasCurrentYear ? "✅ PASS" : "⚠️  WARN",
          details: `${
            newMoonData.length
          } years, Current year (${currentYear}): ${
            hasCurrentYear ? "included" : "missing"
          }`
        });
      } catch (error) {
        checks.push({
          name: "Moon Data Content",
          status: "❌ FAIL",
          details: `Error loading data: ${error.message}`
        });
      }
    }

    // Check 3: Year data files
    const currentYearExists = existsSync("./_builders/currentYear.json");

    checks.push({
      name: "Year Data Files",
      status: currentYearExists ? "✅ PASS" : "❌ FAIL",
      details: `currentYear.json: ${currentYearExists ? "exists" : "missing"}`
    });

    if (currentYearExists) {
      // Check 4: Year data content validation
      const yearContent = await readFile(
        "./_builders/currentYear.json",
        "utf-8"
      );
      const yearData = JSON.parse(yearContent);

      const isValidYear = Array.isArray(yearData) && yearData.length === 12;
      const hasAllMonths = yearData.every(
        (month) => month.monthNumber && month.monthName && month.monthBuilt
      );

      checks.push({
        name: "Year Data Structure",
        status: isValidYear && hasAllMonths ? "✅ PASS" : "❌ FAIL",
        details: `12 months: ${isValidYear ? "yes" : "no"}, Valid structure: ${
          hasAllMonths ? "yes" : "no"
        }`
      });

      // Check 5: Current year data accuracy
      const currentYear = new Date().getFullYear();
      const firstMonth = yearData[0];
      const firstDay = firstMonth.monthBuilt[0];
      const dataYear = new Date(firstDay.date).getFullYear();

      checks.push({
        name: "Year Data Accuracy",
        status: dataYear === currentYear ? "✅ PASS" : "⚠️  WARN",
        details: `Expected: ${currentYear}, Found: ${dataYear}`
      });
    }

    // Check 6: Site data source validation
    try {
      const { builtMonth } = await import("../scripts/monthConstructors.js");
      const testMonth = builtMonth(1); // January

      checks.push({
        name: "Site Data Source",
        status: testMonth ? "✅ PASS" : "❌ FAIL",
        details: testMonth
          ? "monthConstructors working"
          : "monthConstructors broken"
      });
    } catch (error) {
      checks.push({
        name: "Site Data Source",
        status: "❌ FAIL",
        details: `Error: ${error.message}`
      });
    }
  } catch (error) {
    checks.push({
      name: "System Check",
      status: "❌ FAIL",
      details: `Error: ${error.message}`
    });
  }

  // Display results
  console.log("📋 Synchronization Status Report:");
  console.log("=".repeat(50));

  checks.forEach((check) => {
    console.log(`${check.status} ${check.name}`);
    console.log(`   ${check.details}\n`);
  });

  const passCount = checks.filter((c) => c.status.includes("PASS")).length;
  const failCount = checks.filter((c) => c.status.includes("FAIL")).length;
  const warnCount = checks.filter((c) => c.status.includes("WARN")).length;

  console.log("📊 Summary:");
  console.log(`   ✅ ${passCount} passed`);
  console.log(`   ⚠️  ${warnCount} warnings`);
  console.log(`   ❌ ${failCount} failed`);

  if (failCount === 0 && warnCount === 0) {
    console.log("\n🎉 All systems synchronized and working correctly!");
  } else if (failCount === 0) {
    console.log("\n✅ System is functional with minor warnings.");
  } else {
    console.log("\n⚠️  System has issues that should be addressed.");
  }
};

checkDataSync();
