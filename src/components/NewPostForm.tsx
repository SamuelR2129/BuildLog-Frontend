import React, {
  type FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Button } from "./Button";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { VscDeviceCamera } from "react-icons/vsc";
import { IconHoverEffect } from "./IconHoverEffect";

type PostData = {
  content: string;
  hours: string;
  costs: string;
  buildSite: string;
  imageNames?: string[];
};

type NewPostData = {
  id: string;
  content: string;
  createdAt: Date;
  buildSite: string;
  imageNames?: string[];
  user: {
    name: string | null;
    id: string;
  };
};

const updateTextAreaSize = (textArea?: HTMLTextAreaElement) => {
  if (!textArea) return;

  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};

const uploadImagesToS3 = async (url: string, image: File) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": image.type,
    },
    body: image,
  });

  if (response.status !== 200) {
    console.error("Failed to upload image with presigned url");
  }
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
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>();

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

  const { mutateAsync: fetchPresignedUrls } =
    api.images.getImageUploadUrls.useMutation();

  const getImageNamesFromFormData = async (
    images: FileList,
  ): Promise<string[]> => {
    const imageNamesWithNoSpaces = [...images].map((image) => {
      return image.name.replace(/ /g, "_");
    });

    const preSignedUrls = await fetchPresignedUrls({
      imageNames: imageNamesWithNoSpaces,
    }).catch((err) => {
      alert(`Error uploading the image`);
      console.error(err);
    });

    preSignedUrls &&
      preSignedUrls.map(async (url, index) => {
        await uploadImagesToS3(url, images[index]!);
      });

    return imageNamesWithNoSpaces;
  };

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setContentValue("");

      if (session.status !== "authenticated") return;

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData?.pages[0]) return;

        const newCacheTweet: NewPostData = {
          id: newTweet.id,
          content: newTweet.content,
          createdAt: newTweet.createdAt,
          buildSite: newTweet.buildSite,
          user: {
            id: session.data.user.id,
            name: session.data.user.name ?? null,
          },
        };

        if (newTweet?.imageNames)
          newCacheTweet.imageNames = newTweet.imageNames.split(",");

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const postData: PostData = {
      content: contentValue,
      hours: hoursValue,
      costs: costsValue,
      buildSite: buildSiteValue,
    };

    if (imageFiles && imageFiles.length > 0)
      postData.imageNames = await getImageNamesFromFormData(imageFiles);

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
          className="w-full resize-none overflow-hidden border border-gray-200 p-2 pl-2 font-thin outline-none"
          placeholder="Choose build site"
          value={buildSiteValue}
          onChange={(e) => setBuildSiteValue(e.target.value)}
        >
          <option value="">Choose a build site.</option>
          <option value="34 Thompson Road">34 Thompson Road</option>
          <option value="7 Rose St">7 Rose St</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <IconHoverEffect>
            <div className="container flex cursor-pointer items-center justify-center">
              <VscDeviceCamera
                className="h-8 w-8 fill-blue-500"
                onClick={handleImageClick}
              />
              <input
                type="file"
                name="image"
                className="hidden h-9 w-8"
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
