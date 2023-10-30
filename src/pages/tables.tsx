import React from "react";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { Table } from "~/components/tables/Table";
import { api } from "~/utils/api";

const Tables = () => {
  const data = api.tweet.tableData.useQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  if (data.error)
    return <h1>There has been an error getting the table data.</h1>;

  if (data.isLoading || !data) {
    return <LoadingSpinner />;
  }

  const weeklyTableProps = data.data?.weeklyMappedData.map((tableData) => {
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

  console.log(weeklyTableProps);

  if (!weeklyTableProps)
    return <h1>There has been an error getting the table data.</h1>;

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">EAC-ROWAN BUILD</h1>
      </header>
      <div className="min-width: 300px; max-width: 100%; margin: 0 auto; padding: 1rem; border: 1px solid #ccc; border-radius: 0.5rem;">
        <h2>Current Table</h2>
        <div className="overflow-x: auto; margin-top: 1rem;">
          <Table tableProps={weeklyTableProps[1]!} />
        </div>
      </div>
      <div className="min-width: 300px; max-width: 100%; margin: 0 auto; padding: 1rem; border: 1px solid #ccc; border-radius: 0.5rem;">
        <h2>Previous Table</h2>
        <div className="overflow-x: auto; margin-top: 1rem;">
          <Table tableProps={weeklyTableProps[0]!} />
        </div>
      </div>
    </>
  );
};

export default Tables;
