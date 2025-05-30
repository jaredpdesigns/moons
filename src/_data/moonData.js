import { builtMonth } from "../../scripts/monthConstructors.js";

export default () => {
  const today = new Date();
  const foundData = builtMonth(today.getMonth() + 1);
  return foundData;
};
