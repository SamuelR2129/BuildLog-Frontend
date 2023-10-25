import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingSpinner } from "./LoadingSpinner";
import { useSession } from "next-auth/react";

export type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; image?: string; name: string | null };
  children?: React.ReactNode;
};

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore?: boolean;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Australia/Sydney",
});

const TweetCard = ({ id, user, content, createdAt }: Tweet) => {
  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <div className="font-bold">{user.name}</div>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wap">{content}</p>
      </div>
    </li>
  );
};

export const InfiniteTweetList = ({
  tweets,
  isError,
  isLoading,
  fetchNewTweets,
  hasMore = false,
}: InfiniteTweetListProps) => {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error</h1>;
  if (!tweets || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {tweets.map((tweet) => {
          return (
            <TweetCard key={tweet.id} {...tweet}>
              {tweet.content}
            </TweetCard>
          );
        })}
      </InfiniteScroll>
    </ul>
  );
};
