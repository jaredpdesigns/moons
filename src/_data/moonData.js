import { builtMonth } from "../../scripts/monthConstructors.js";
import { moonGroups } from "../../scripts/moonPhases.js";

export default () => {
  const today = new Date();
  const foundData = builtMonth(today.getMonth() + 1);
  return {
    ...foundData,
    moonGroups
  };
};
