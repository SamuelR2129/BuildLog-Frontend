import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingSpinner } from "../LoadingSpinner";
import { EmblaImageCarousel } from "./ImageCarousel";
import { api } from "~/utils/api";

export type Tweet = {
  id: string;
  content: string;
  buildSite: string;
  imageNames?: string[];
  createdAt: Date;
  user: { id: string; image?: string; name: string };
  children?: React.ReactNode;
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Australia/Sydney",
});

const TweetCard = ({
  user,
  content,
  createdAt,
  buildSite,
  imageNames,
}: Tweet) => {
  return (
    <li className="flex gap-4 border-b px-4 py-7">
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <div className="font-bold">{user.name}</div>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <span className="text-gray-500">{buildSite}</span>
        <p className="whitespace-pre-wap">{content}</p>
        {imageNames && (
          <div className="py-4">
            <EmblaImageCarousel imageNames={imageNames} />
          </div>
        )}
      </div>
    </li>
  );
};

export const InfiniteTweetList = ({
  selectedTab,
}: {
  selectedTab?: string;
}) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    api.tweet.infiniteFeed.useInfiniteQuery(
      { siteFilter: selectedTab === "all" ? undefined : selectedTab },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  if (isError)
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">
        There was an error getting the posts.
      </h2>
    );

  if (isLoading) return <LoadingSpinner />;

  const tweets = data.pages.flatMap((page): Tweet[] => page.tweets);

  if (!tweets || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No posts.</h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNextPage}
        hasMore={hasNextPage ?? false}
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
