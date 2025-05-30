import { writeFile } from "fs/promises";
import { builtYear } from "../scripts/monthConstructors.js";

const buildYear = async () => {
  writeFile("./_builders/currentYear.json", JSON.stringify(builtYear, null, 2));
  console.log("🗓️ Built year of data");
};

buildYear();
