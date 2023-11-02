import { type WeeklyMappedData } from "~/server/api/utils/tableUtils";

type PastDate = {
  previousDaysAndWeek: Date;
  previousDays: Date;
};

export const mapTableDataForThePage = (
  weeklyMappedData: WeeklyMappedData[],
  dates: PastDate,
) => {
  const mappedData = weeklyMappedData.map((tableData) => {
    const days = Object.keys(tableData.weeklyData);
    const names = Object.keys(tableData.overallCosts);

    return {
      weeklyData: tableData.weeklyData,
      totalHours: tableData.overallHours,
      totalCosts: tableData.overallCosts,
      days,
      names,
    };
  });

  const previousTablesDates = {
    start: dates.previousDaysAndWeek.toDateString(),
    end: dates.previousDays.toDateString(),
  };

  return {
    table: mappedData,
    previousTablesDates,
  };
};
