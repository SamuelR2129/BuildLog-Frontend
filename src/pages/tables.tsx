import React from "react";
import { Header } from "~/components/Header";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { Table } from "~/components/tables/Table";
import { api } from "~/utils/api";
import { mapTableDataForThePage } from "../pageUtils/clientTableUtils";
import { useSession } from "next-auth/react";

const Tables = () => {
  const session = useSession();
  const user = session.data?.user;

  const data = api.table.tableData.useQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const subbieData = api.table.subbieData.useQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  if (data.error)
    return <h1>There has been an error getting the table data.</h1>;

  if (data.isLoading || !data) {
    return <LoadingSpinner />;
  }

  if (subbieData.error)
    return <h1>There has been an error getting the table data.</h1>;

  if (subbieData.isLoading || !subbieData) {
    return <LoadingSpinner />;
  }

  if (session.status !== "authenticated") {
    return <h1>Please sign in, you are unauthenticated.</h1>;
  }

  if (!user?.admin) {
    return <h1>You are not an admin.</h1>;
  }

  const weeklyTableProps = mapTableDataForThePage(
    data.data.weeklyMappedData,
    data.data.pastDate,
  );

  const weeklySubbieTableProps = mapTableDataForThePage(
    subbieData.data.weeklyMappedData,
    subbieData.data.pastDate,
  );

  if (!weeklyTableProps || !weeklySubbieTableProps)
    return <h1>There has been an error getting the table data.</h1>;

  return (
    <>
      <Header />
      <div className="min-width: 300px; max-width: 100%; margin: 0 auto; padding: 1rem; border: 1px solid #ccc; border-radius: 0.5rem;">
        <h2 className="bold px-2 py-2 pt-4 text-xl">Current Table</h2>
        <div className="overflow-x: auto; margin-top: 1rem;">
          <Table tableProps={weeklyTableProps.table[1]!} />
        </div>
      </div>
      <div className="min-width: 300px; max-width: 100%; margin: 0 auto; padding: 1rem; border: 1px solid #ccc; border-radius: 0.5rem;">
        <h2 className="bold px-2 py-2 text-xl">
          Previous Table - {weeklyTableProps.previousTablesDates.start} to{" "}
          {weeklyTableProps.previousTablesDates.end}
        </h2>
        <div className="overflow-x: auto; margin-top: 1rem;">
          <Table tableProps={weeklyTableProps.table[0]!} />
        </div>
      </div>
      <div className="min-width: 300px; max-width: 100%; margin: 0 auto; padding: 1rem; border: 1px solid #ccc; border-radius: 0.5rem;">
        <h2 className="bold px-2 py-2 pt-4 text-xl">Subbies Current Table</h2>
        <div className="overflow-x: auto; margin-top: 1rem;">
          <Table tableProps={weeklySubbieTableProps.table[1]!} />
        </div>
      </div>
      <div className="min-width: 300px; max-width: 100%; margin: 0 auto; padding: 1rem; border: 1px solid #ccc; border-radius: 0.5rem;">
        <h2 className="bold px-2 py-2 text-xl">
          Subbies Previous Table -{" "}
          {weeklySubbieTableProps.previousTablesDates.start} to
          {weeklySubbieTableProps.previousTablesDates.end}
        </h2>
        <div className="overflow-x: auto; margin-top: 1rem;">
          <Table tableProps={weeklySubbieTableProps.table[0]!} />
        </div>
      </div>
    </>
  );
};

export default Tables;
