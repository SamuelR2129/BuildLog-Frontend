import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Header } from "~/components/Header";
import { InfiniteTweetList } from "~/components/feed/InfiniteTweetList";
import { NewPostForm } from "~/components/feed/NewPostForm";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>();
  const session = useSession();
  const { data, isLoading, isError } = api.manageBuildSites.getSites.useQuery(
    {},
  );
  return (
    <>
      <Header />
      <NewPostForm />
      {session.status === "authenticated" && (
        <div className="px-3 py-3 pt-9 md:px-8 md:py-6">
          <select
            value={selectedTab}
            onChange={(e) => setSelectedTab(e.target.value)}
            className="form-select block w-full rounded-md border border-gray-400 bg-white px-4  py-2 font-thin text-gray-400 shadow focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option disabled selected>
              Filter by address...
            </option>
            <option value="all">All addresses.</option>
            <option value="34 Thompson Road">34 Thompson Road</option>
            <option value="7 Rose St">7 Rose St</option>
          </select>
        </div>
      )}
      <InfiniteTweetList selectedTab={selectedTab} />
    </>
  );
};

export default Home;
