export const uploadImagesToS3 = async (url: string, image: File) => {
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
