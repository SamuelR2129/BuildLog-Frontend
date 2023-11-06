import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
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

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const cloudfrontClient = new CloudFrontClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export const tweetRouter = createTRPCRouter({
  infiniteFeed: protectedProcedure
    .input(
      z.object({
        siteFilter: z.string().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, cursor, siteFilter }, ctx }) => {
      const data = await ctx.db.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        where: siteFilter
          ? {
              AND: [
                { content: { not: "" } },
                {
                  buildSite: { contains: siteFilter },
                },
              ],
            }
          : { content: { not: "" } },
        select: {
          id: true,
          content: true,
          buildSite: true,
          createdAt: true,
          imageNames: true,
          user: {
            select: { name: true, id: true },
          },
        },
      });

      let nextCursor: typeof cursor | undefined;

      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        tweets: data.map((tweet) => {
          if (!tweet.content || !tweet.buildSite)
            console.error("A feed post is missing its content and buildsite");

          const newCacheTweet: NewPostData = {
            id: tweet.id,
            content: tweet.content ?? "",
            createdAt: tweet.createdAt,
            buildSite: tweet.buildSite ?? "",
            user: { ...tweet.user },
          };

          if (tweet?.imageNames)
            newCacheTweet.imageNames = tweet.imageNames.split(",");
          return newCacheTweet;
        }),
        nextCursor,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().optional(),
        costs: z.string().optional(),
        hours: z.string().optional(),
        buildSite: z.string().optional(),
        imageNames: z.array(z.string()).optional(),
      }),
    )
    .mutation(
      async ({
        input: { content, costs, hours, buildSite, imageNames },
        ctx,
      }) => {
        const stringifiedImageNames = imageNames?.toString();
        return await ctx.db.tweet.create({
          data: {
            content,
            costs,
            hours,
            buildSite,
            imageNames: stringifiedImageNames,
            userId: ctx.session.user.id,
          },
        });
      },
    ),

  deletePost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        imageNames: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input: { id, imageNames }, ctx }) => {
      for (const name in imageNames) {
        try {
          const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: name,
          };

          //delete image from s3.
          const s3DeleteCommand = new DeleteObjectCommand(params);
          await s3Client.send(s3DeleteCommand);

          const invalidationParams = {
            DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
            InvalidationBatch: {
              CallerReference: name,
              Paths: {
                Quantity: 1,
                Items: ["/" + name],
              },
            },
          };

          //delete image from cloudfront cache.
          const invalidationCommand = new CreateInvalidationCommand(
            invalidationParams,
          );
          await cloudfrontClient.send(invalidationCommand);
        } catch (e) {
          console.error(e);
          throw new Error(
            "Unable to delete s3 image and invalidate cloudfront cache.",
          );
        }
      }

      return await ctx.db.tweet.delete({
        where: {
          id: id,
        },
      });
    }),
});
