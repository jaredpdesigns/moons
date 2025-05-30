import { getMoonPhase, getNewMoon } from "./moonPhases.js";

const today = new Date();

const getDaysInCurrentMonth = (refDate) => {
  const date = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0);
  return date.getDate();
};

const builtMonth = (refDate, newMoon, overlap) => {
  return new Array(getDaysInCurrentMonth(refDate)).fill(0).map((_, i) => {
    const date = new Date(refDate.getFullYear(), refDate.getMonth(), i + 1, 0);
    const day = i + 1;
    const newMoonOffset = newMoon - day;
    const handlePhaseDayRef = (offset) => {
      if (offset > 0) {
        return 30 - offset;
      }
      if (offset === 0) {
        return 30;
      }
      return Math.abs(offset);
    };

    return {
      date,
      day,
      isOverlap: overlap,
      phase: getMoonPhase(handlePhaseDayRef(newMoonOffset))
    };
  });
};

const startOfMonthIndex = (refDate) => {
  const mapOfDayNames = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };
  const dayName = refDate.toLocaleString("default", { weekday: "long" });
  return mapOfDayNames[dayName];
};

const builtYear = new Array(12).fill(0).map((_, i) => {
  const month = new Date(today.getFullYear(), i + 1, 0);
  const monthNext = new Date(today.getFullYear(), i + 2, 0);
  const monthPrev = new Date(today.getFullYear(), i, 0);
  const monthNumber = month.getMonth() + 1;
  const monthName = month.toLocaleString("en-US", {
    month: "long"
  });
  const monthDays = getDaysInCurrentMonth(month);
  const newMoonDayPrev = getNewMoon(
    monthPrev.getFullYear(),
    monthPrev.getMonth() + 1
  );
  const newMoonDay = getNewMoon(month.getFullYear(), month.getMonth() + 1);
  const newMoonDayNext = getNewMoon(
    monthNext.getFullYear(),
    monthNext.getMonth() + 1
  );
  const monthBuilt = builtMonth(month, newMoonDay);
  const monthStartIndex = startOfMonthIndex([...monthBuilt].shift().date);
  const lengthOfCalendar = 5 * 7;
  const toFill = lengthOfCalendar - monthDays - monthStartIndex;
  const monthBuiltNext = builtMonth(monthNext, newMoonDayNext, true).slice(
    0,
    toFill
  );
  const monthBuiltPrev =
    monthStartIndex > 0
      ? builtMonth(monthPrev, newMoonDayPrev, true).slice(-monthStartIndex)
      : [];

  return {
    monthNumber,
    monthName,
    monthCalendar: [...monthBuiltPrev, ...monthBuilt, ...monthBuiltNext],
    monthBuilt
  };
});

const getBuiltMonth = (monthRef) => {
  const monthFound = builtYear.find((month) => month.monthNumber === monthRef);
  return monthFound;
};

export { getBuiltMonth as builtMonth, builtYear };
