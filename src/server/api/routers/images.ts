import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const getUploadImageUrl = async (name: string): Promise<string> => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
  const command = new PutObjectCommand({
    Key: name,
    Bucket: process.env.BUCKET_NAME,
  });

  const imageUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  if (!imageUrl) {
    throw new Error("Image upload url from s3 returned null/undefined");
  }

  return imageUrl;
};

// Get presigned URLs for the images

export const imagesRouter = createTRPCRouter({
  getImageUploadUrls: protectedProcedure
    .input(
      z.object({
        imageNames: z.array(z.string()),
      }),
    )
    .mutation(async ({ input: { imageNames } }) => {
      const imageUrls = await Promise.all(
        imageNames.map(async (name) => {
          return await getUploadImageUrl(name);
        }),
      );

      return imageUrls;
    }),
});
