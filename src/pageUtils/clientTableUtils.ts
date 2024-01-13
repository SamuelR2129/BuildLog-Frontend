import { type WeeklyMappedData } from "~/server/api/utils/tableUtils";

type PastDate = {
  previousTwoMondays: Date;
  previousMonday: Date;
};

export const mapTableDataForThePage = (
  weeklyMappedData: WeeklyMappedData[],
  dates: PastDate,
) => {
  const mappedData = weeklyMappedData.map((tableData) => {
    const days = Object.keys(tableData.weeklyData);
    const names = Object.keys(tableData.overallCosts); //Names are attached to the overall costs as keys.

    return {
      weeklyData: tableData.weeklyData,
      totalHours: tableData.overallHours,
      totalCosts: tableData.overallCosts,
      days,
      names,
    };
  });

  const previousTablesDates = {
    start: dates.previousTwoMondays.toDateString(),
    end: dates.previousMonday.toDateString(),
  };

  return {
    table: mappedData,
    previousTablesDates,
  };
};
