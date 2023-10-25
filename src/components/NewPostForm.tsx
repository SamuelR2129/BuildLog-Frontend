import React, {
  type FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./Button";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

const updateTextAreaSize = (textArea?: HTMLTextAreaElement) => {
  if (!textArea) return;

  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};

export const NewPostForm = () => {
  const session = useSession();
  if (session.status !== "authenticated") return null;
  return <Form />;
};

const Form = () => {
  const [contentValue, setContentValue] = useState<string>("");
  const [hoursValue, setHoursValue] = useState<string>("");
  const [costsValue, setCostsValue] = useState<string>("");
  const [buildSiteValue, setBuildSiteValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);
  const trpcUtils = api.useUtils();
  const session = useSession();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [contentValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setContentValue("");

      if (session.status !== "authenticated") return;

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData?.pages[0]) return;

        const newCacheTweet = {
          ...newTweet,
          user: {
            id: session.data.user.id,
            name: session.data.user.name ?? null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    createTweet.mutate({
      content: contentValue,
      hours: hoursValue,
      costs: costsValue,
      buildSite: buildSiteValue,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="px-1 py-1">
            <span>Hours</span>
            <input
              value={hoursValue}
              onChange={(e) => setHoursValue(e.target.value)}
              className="w-full resize-none overflow-hidden border border-gray-200 pl-2 text-lg font-thin"
            />
          </div>
          <div className="px-1 py-1">
            <span>Costs</span>
            <input
              value={costsValue}
              onChange={(e) => setCostsValue(e.target.value)}
              className="w-full resize-none overflow-hidden border border-gray-200 pl-2 text-lg font-thin"
            />
          </div>
        </div>
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={contentValue}
          onChange={(e) => setContentValue(e.target.value)}
          className="w-full flex-grow  resize-none overflow-hidden border border-gray-200 p-4 text-lg font-thin  outline-none"
          placeholder="What's happening?"
        />
        <select
          className="w-full resize-none overflow-hidden border border-gray-200 p-1 pl-2 text-lg font-thin outline-none"
          placeholder="Choose build site"
          value={buildSiteValue}
          onChange={(e) => setBuildSiteValue(e.target.value)}
        >
          <option value="">Choose a build site.</option>
          <option value="34 Thompson Road">34 Thompson Road</option>
          <option value="7 Rose St">7 Rose St</option>
        </select>
      </div>
      <Button className="self-end">Submit</Button>
    </form>
  );
};
