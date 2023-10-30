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
    costs: string;
  }
>;

export type UserHours = Record<
  string,
  {
    hours: string;
  }
>;

export type ComputedDailyData = {
  monday: TableData[];
  tuesday: TableData[];
  wednesday: TableData[];
  thursday: TableData[];
  friday: TableData[];
  saturday: TableData[];
  sunday: TableData[];
};

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return weeklyData[day].find((item: TableData) => item.name === name);
  };

  return (
    <div className="table-container">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border-b bg-gray-200 px-6 py-3">Name</th>
            {days.map((day) => (
              <th key={day} className="border-b bg-gray-200 px-6 py-3">
                {day}
              </th>
            ))}
            <th className="border-b bg-gray-200 px-6 py-3">Total Hours</th>
            <th className="border-b bg-gray-200 px-6 py-3">Total Costs</th>
          </tr>
        </thead>
        <tbody>
          {names.map((name) => (
            <tr key={name} className="border-b">
              <td className="px-6 py-4">{name}</td>
              {days.map((day) => {
                const cellData = getCellData(name, day);
                return (
                  <td key={`${name}-${day}`} className="px-6 py-4">
                    {cellData ? (
                      <>
                        <div>Hours: {cellData.hours}</div>
                        <div>Costs: {cellData.costs}</div>
                      </>
                    ) : null}
                  </td>
                );
              })}
              <td className="px-6 py-4">{totalHours[name]?.hours ?? 0}</td>
              <td className="px-6 py-4">{totalCosts[name]?.costs ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
