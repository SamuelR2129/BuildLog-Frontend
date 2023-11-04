import { api } from "~/utils/api";

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

export const imageS3Handler = async (images: FileList): Promise<string[]> => {
  const { mutateAsync: fetchPresignedUrls } =
    api.images.getImageUploadUrls.useMutation();

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
