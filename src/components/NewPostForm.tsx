import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./Button";
import { useSession } from "next-auth/react";

const updateTextAreaSize = (textArea?: HTMLTextAreaElement) => {
  if (!textArea) return;

  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};

export const NewPostForm = () => {
  const session = useSession();
  //   if(session.status !== 'authenticated') return null;
  return <Form />;
};

const Form = () => {
  const session = useSession();
  const [inputValue, setInputValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  return (
    <form className="flex flex-col gap-2 border-b px-4 py-2">
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
