import { type WeeklyMappedData } from "~/server/api/utils/tableUtils";
import { mapTableDataForThePage } from "../pages/utils/clientTableUtils";

describe("mapTableDataForThePage", () => {
  const weeklyMappedData = [
    {
      weeklyData: {
        Monday: {
          hours: 10,
          cost: 100,
        },
        Tuesday: {
          hours: 20,
          cost: 200,
        },
      },
      overallHours: 30,
      overallCosts: 300,
    },
  ] as unknown as WeeklyMappedData[];

  const dates = {
    previousDaysAndWeek: new Date(2023, 10, 29),
    previousDays: new Date(2023, 10, 28),
  };

  it("should return a mapped data object with the correct values", () => {
    const mappedData = mapTableDataForThePage(weeklyMappedData, dates);

    expect(mappedData.table).toEqual([
      {
        weeklyData: {
          Monday: {
            hours: 10,
            cost: 100,
          },
          Tuesday: {
            hours: 20,
            cost: 200,
          },
        },
        totalHours: 30,
        totalCosts: 300,
        days: ["Monday", "Tuesday"],
        names: ["Monday", "Tuesday"],
      },
    ]);

    expect(mappedData.previousTablesDates).toEqual({
      start: "2023-10-23",
      end: "2023-10-28",
    });
  });

  it("should handle empty weekly mapped data", () => {
    const mappedData = mapTableDataForThePage([], dates);

    expect(mappedData.table).toEqual([]);
    expect(mappedData.previousTablesDates).toEqual({
      start: "2023-10-23",
      end: "2023-10-28",
    });
  });
});
