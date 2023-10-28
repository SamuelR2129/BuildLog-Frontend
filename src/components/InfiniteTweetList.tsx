import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingSpinner } from "./LoadingSpinner";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import EmblaCarousel, {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
  EmblaEventType,
} from "embla-carousel";
import { EmblaImageCarousel } from "./ImageCarousel";

export type Tweet = {
  id: string;
  content: string;
  buildSite: string;
  imageNames?: string[];
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

const TweetCard = ({
  id,
  user,
  content,
  createdAt,
  buildSite,
  imageNames,
}: Tweet) => {
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
