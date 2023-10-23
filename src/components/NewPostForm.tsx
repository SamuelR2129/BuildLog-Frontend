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
  const [inputValue, setInputValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);
  const trpcUtils = api.useUtils();
  const session = useSession();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue("");

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

    createTweet.mutate({ content: inputValue });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4 ">
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="text-grey-200 flex-grow resize-none overflow-hidden p-4 text-lg font-thin outline-none"
          placeholder="What's happening?"
        />
      </div>
      <Button className="self-end">Submit</Button>
    </form>
  );
};
