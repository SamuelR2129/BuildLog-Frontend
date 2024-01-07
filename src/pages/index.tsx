import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { VscSignIn } from "react-icons/vsc";
import { Header } from "~/components/Header";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { InfiniteTweetList } from "~/components/feed/InfiniteTweetList";
import { NewPostForm } from "~/components/feed/NewPostForm";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>();
  const session = useSession();
  const user = session.data?.user;
  const { data, isLoading, isError } = api.manageBuildSites.getSites.useQuery(
    {},
  );

  if (session.status !== "authenticated") {
    return <h1>Please sign in, you are unauthenticated.</h1>;
  }

  if (!user?.admin) {
    return <h1>You are not an admin.</h1>;
  }

  return (
    <>
      <Header />
      <NewPostForm
        buildSites={data?.buildSites}
        siteIsLoading={isLoading}
        siteIsError={isError}
      />

      <div className="px-3 py-3 pt-9 md:px-8 md:py-6">
        {isLoading ? null : (
          <>
            {isError || !data.buildSites ? (
              <h2 className="my-4 text-center text-2xl text-gray-500">
                There was an error getting the addresses for the feed.
              </h2>
            ) : null}
            <select
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value)}
              className="form-select block w-full rounded-md border border-gray-400 bg-white px-4  py-2 text-gray-400 shadow focus:border-blue-500 focus:outline-none focus:ring-blue-500 md:font-thin"
            >
              <option disabled selected>
                Filter by address...
              </option>
              <option value="all">All addresses.</option>
              {data?.buildSites.map((site) => {
                return (
                  <option key={site.id} value={site.buildSite}>
                    {site.buildSite}
                  </option>
                );
              })}
            </select>
          </>
        )}
      </div>

      <InfiniteTweetList selectedTab={selectedTab} />
    </>
  );
};

export default Home;
