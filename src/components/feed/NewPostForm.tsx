import React, {
  type FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Button } from "../Button";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { CiImageOn } from "react-icons/ci";
import { IconHoverEffect } from "../IconHoverEffect";
import { uploadImagesToS3 } from "./imageS3Handler";
import { removeDollarSign, removeSpacesInFileNames } from "./newPostFormUtils";

type PostData = {
  content?: string;
  hours?: string;
  costs?: string;
  buildSite?: string;
  imageNames?: string[];
};

type NewPostData = {
  id: string;
  content: string;
  createdAt: Date;
  buildSite: string;
  imageNames?: string[];
  user: {
    name: string;
    id: string;
  };
};

type NewPostFormProps = {
  buildSites?: {
    id: string;
    buildSite: string;
    createdAt: Date;
  }[];
  siteIsLoading: boolean;
  siteIsError: boolean;
};

type FormProps = {
  buildSites: {
    id: string;
    buildSite: string;
    createdAt: Date;
  }[];
};

const updateTextAreaSize = (textArea?: HTMLTextAreaElement) => {
  if (!textArea) return;

  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};

export const NewPostForm = ({
  buildSites,
  siteIsLoading,
  siteIsError,
}: NewPostFormProps) => {
  const session = useSession();
  if (session.status !== "authenticated") return null;
  if (siteIsLoading) return null;
  if (siteIsError || !buildSites) return null;
  return <Form buildSites={buildSites} />;
};

const Form = ({ buildSites }: FormProps) => {
  const [contentValue, setContentValue] = useState<string>("");
  const [hoursValue, setHoursValue] = useState<string>("");
  const [costsValue, setCostsValue] = useState<string>("");
  const [buildSiteValue, setBuildSiteValue] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const [isLoading, setIsLoading] = useState(false);

  //For the text area
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);
  const trpcUtils = api.useUtils();
  const session = useSession();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [contentValue]);
  //For the text area

  const createTweet = api.tweet.create.useMutation({
    onError: (e) => {
      console.error(e);
      setIsLoading(false);
      alert(`Error uploading the post`);
      return;
    },
    onSuccess: (newTweet) => {
      setContentValue("");
      setHoursValue("");
      setCostsValue("");
      setBuildSiteValue("");
      setImageFiles(null);

      if (session.status !== "authenticated") return;

      if (newTweet.content === "") {
        return;
      }

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData?.pages[0]) return;

        if (!session.data.user.name)
          throw new Error("User name missing from session.");

        const newCacheTweet: NewPostData = {
          id: newTweet.id,
          content: newTweet.content ?? "",
          createdAt: newTweet.createdAt,
          buildSite: newTweet.buildSite ?? "",
          user: {
            id: session.data.user.id,
            name: session.data.user.name,
          },
        };

        if (newTweet?.imageNames)
          newCacheTweet.imageNames = newTweet.imageNames.split(",");

        setIsLoading(false);

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

  const { mutateAsync: mutateFetchPresignedUrls } =
    api.images.getImageUploadUrls.useMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (contentValue.length !== 0 && buildSiteValue.length === 0) {
      alert("Select a build site for your report.");
      return;
    }

    const postData: PostData = {
      content: contentValue,
      hours: hoursValue,
      costs: removeDollarSign(costsValue),
      buildSite: buildSiteValue,
    };

    try {
      setIsLoading(true);

      if (imageFiles && imageFiles.length > 0) {
        const imageNamesWithNoSpaces = removeSpacesInFileNames(imageFiles);

        const preSignedUrls = await mutateFetchPresignedUrls({
          imageNames: imageNamesWithNoSpaces,
        });

        preSignedUrls?.map(async (url, index) => {
          await uploadImagesToS3(url, imageFiles[index]!);
        });

        postData.imageNames = imageNamesWithNoSpaces;
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      alert(`Error uploading the image`);
      return;
    }

    createTweet.mutate(postData);
  };

  const handleImageClick = () => {
    setImageFiles(null);
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    const input = document.querySelector(
      "input[type='file']",
    ) as HTMLInputElement;
    input.click();
  };

  const onImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageFiles(e.target.files);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-2 border-b px-4 py-2 ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div>
            <span>Hours</span>
            <input
              value={hoursValue}
              placeholder="0"
              onChange={(e) => setHoursValue(e.target.value)}
              className="w-full resize-none overflow-hidden rounded-lg border border-gray-400 pl-2 text-lg font-thin"
            />
          </div>
          <div>
            <span>Costs</span>
            <input
              placeholder="0.00"
              value={costsValue}
              onChange={(e) => setCostsValue(e.target.value)}
              className="w-full resize-none overflow-hidden rounded-lg border border-gray-400 pl-2 text-lg font-thin"
            />
          </div>
        </div>
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={contentValue}
          onChange={(e) => setContentValue(e.target.value)}
          className="w-full flex-grow resize-none overflow-hidden  rounded-lg border border-gray-400 p-4 text-lg text-sm font-thin outline-none  focus:border-2 focus:border-blue-500"
          placeholder="What's happening?"
        />
        <select
          className="w-full resize-none overflow-hidden rounded-lg border border-gray-400 bg-white p-2 pl-2 text-sm font-thin text-gray-700 outline-none"
          value={buildSiteValue}
          onChange={(e) => setBuildSiteValue(e.target.value)}
        >
          <option>Choose a build site.</option>
          {buildSites.map((site) => {
            return (
              <option key={site.id} value={site.buildSite}>
                {site.buildSite}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <IconHoverEffect>
            <div className="container flex cursor-pointer items-center justify-center">
              <CiImageOn
                className="h-8 w-8 fill-blue-500"
                onClick={handleImageClick}
              />
              <input
                type="file"
                name="image"
                className="hidden h-9 w-8"
                multiple
                onChange={onImageInputChange}
              />
            </div>
          </IconHoverEffect>
          {imageFiles && (
            <div className={`rounded-full bg-gray-200 px-4 py-2 `}>
              {imageFiles.length}
            </div>
          )}
        </div>

        <Button>Submit</Button>
      </div>
    </form>
  );
};
