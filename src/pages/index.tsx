import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Header } from "~/components/Header";
import {
  InfiniteTweetList,
  type Tweet,
} from "~/components/feed/InfiniteTweetList";
import { NewPostForm } from "~/components/feed/NewPostForm";
import { api } from "~/utils/api";

const RecentTweets = ({ selectedTab }: { selectedTab?: string }) => {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    { siteFilter: selectedTab === "all" ? undefined : selectedTab },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page): Tweet[] => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
};

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>();
  const session = useSession();
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
            <option value="" disabled selected>
              Filter by address...
            </option>
            <option value="all">All addresses.</option>
            <option value="34 Thompson Road">34 Thompson Road</option>
            <option value="7 Rose St">7 Rose St</option>
          </select>
        </div>
      )}
      <RecentTweets selectedTab={selectedTab} />
    </>
  );
};

export default Home;
