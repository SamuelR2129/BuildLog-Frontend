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
  const { data, isLoading, isError } = api.manageBuildSites.getSites.useQuery(
    {},
  );

  return (
    <>
      <Header />
      {session.status === "authenticated" ? (
        <>
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
                  className="form-select block w-full rounded-md border border-gray-400 bg-white px-4  py-2 font-thin text-gray-400 shadow focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="my-4 text-center text-2xl text-gray-500">
            You need to sign in
          </h2>
          <button onClick={() => void signIn()}>
            <IconHoverEffect green>
              <span className="item-center flex gap-4">
                <VscSignIn className="h-6 w-6 fill-green-700" />
                <span className="mt-[2px] hidden self-center  text-green-700 md:flex">
                  Sign In
                </span>
              </span>
            </IconHoverEffect>
          </button>
        </div>
      )}
    </>
  );
};

export default Home;
