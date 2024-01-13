import {
  getAustralianDateMidnight,
  type WeeklyMappedData,
} from "~/server/api/utils/tableUtils";
import { mapTableDataForThePage } from "../pageUtils/clientTableUtils";

describe("mapTableDataForThePage", () => {
  const weeklyMappedData = [
    {
      weeklyData: {
        Monday: [
          {
            hours: "10",
            costs: "100",
            name: "sam",
            id: "123",
            createdAt: getAustralianDateMidnight(new Date("2023-11-10")),
          },
          {
            hours: "10",
            costs: "250",
            name: "jack",
            id: "123",
            createdAt: getAustralianDateMidnight(new Date("2023-11-10")),
          },
        ],
        Tuesday: [
          {
            hours: "20",
            costs: "200",
            name: "sam",
            id: "123",
            createdAt: getAustralianDateMidnight(new Date("2023-11-10")),
          },
        ],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      },
      overallHours: { sam: 30, jack: 10 },
      overallCosts: { sam: 300, jack: 250 },
    },
  ] as unknown as WeeklyMappedData[];

  const dates = {
    previousTwoMondays: getAustralianDateMidnight(new Date("2023-10-09")),
    previousMonday: getAustralianDateMidnight(new Date("2023-10-16")),
  };

  it("should return a mapped data object with the correct values", () => {
    const mappedData = mapTableDataForThePage(weeklyMappedData, dates);

    expect(mappedData.table).toEqual([
      {
        weeklyData: {
          Friday: [],
          Monday: [
            {
              hours: "10",
              costs: "100",
              name: "sam",
              id: "123",
              createdAt: new Date(
                "Sat Nov 10 2023 00:00:00 GMT+1100 (Australian Eastern Daylight Time)",
              ),
            },
            {
              hours: "10",
              costs: "250",
              name: "jack",
              id: "123",
              createdAt: new Date(
                "Sat Nov 10 2023 00:00:00 GMT+1100 (Australian Eastern Daylight Time)",
              ),
            },
          ],
          Saturday: [],
          Sunday: [],
          Thursday: [],
          Tuesday: [
            {
              hours: "20",
              costs: "200",
              name: "sam",
              id: "123",
              createdAt: new Date(
                "Sat Nov 10 2023 00:00:00 GMT+1100 (Australian Eastern Daylight Time)",
              ),
            },
          ],
          Wednesday: [],
        },
        totalHours: { sam: 30, jack: 10 },
        totalCosts: { sam: 300, jack: 250 },
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        names: ["sam", "jack"],
      },
    ]);

    expect(mappedData.previousTablesDates).toEqual({
      start: "Mon Oct 09 2023",
      end: "Mon Oct 16 2023",
    });
  });

  it("should handle empty weekly mapped data", () => {
    const mappedData = mapTableDataForThePage([], dates);

    expect(mappedData.table).toEqual([]);
    expect(mappedData.previousTablesDates).toEqual({
      start: "Mon Oct 09 2023",
      end: "Mon Oct 16 2023",
    });
  });
});
