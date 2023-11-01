export type TableData = {
  id: string;
  costs: string;
  createdAt: Date;
  hours: string;
  name: string;
};

export type UserCosts = Record<
  string,
  {
    costs: number;
  }
>;

export type UserHours = Record<
  string,
  {
    hours: number;
  }
>;

export type ComputedDailyData = Record<string, TableData[]>;

type TableProps = {
  tableProps: {
    weeklyData: ComputedDailyData;
    totalHours: UserHours;
    totalCosts: UserCosts;
    days: string[];
    names: string[];
  };
};

export const Table = (props: TableProps) => {
  const { weeklyData, totalCosts, totalHours, days, names } = props.tableProps;

  const getCellData = (name: string, day: string): TableData | undefined => {
    return weeklyData[day]?.find((item: TableData) => item.name === name);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <table className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
            <thead className="border-b font-medium dark:border-neutral-500">
              <tr>
                <th
                  scope="col"
                  className="border-r px-6 py-4 dark:border-neutral-500"
                >
                  Name
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    scope="col"
                    className="border-r px-6 py-4 dark:border-neutral-500"
                  >
                    {day}
                  </th>
                ))}
                <th
                  scope="col"
                  className="border-r px-6 py-4 dark:border-neutral-500"
                >
                  Total Hours
                </th>
                <th
                  scope="col"
                  className="border-r px-6 py-4 dark:border-neutral-500"
                >
                  Total Costs
                </th>
              </tr>
            </thead>
            <tbody>
              {names.map((name) => (
                <tr key={name} className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                    {name}
                  </td>
                  {days.map((day) => {
                    const cellData = getCellData(name, day);
                    return (
                      <td
                        key={`${name}-${day}`}
                        className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                      >
                        {cellData ? (
                          <>
                            <div>Hours: {cellData.hours}</div>
                            <div>Costs: {cellData.costs}</div>
                          </>
                        ) : null}
                      </td>
                    );
                  })}
                  <td className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                    {totalHours[name]?.hours ?? 0}
                  </td>
                  <td className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                    {totalCosts[name]?.costs ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
