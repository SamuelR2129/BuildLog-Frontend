import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type User,
  type Profile,
  type Account,
  type AuthProfile,
  type CustomSession,
  type ISODateString,
  type DefaultSession,
} from "next-auth";
import { db } from "~/server/db";
import Auth0Provider from "next-auth/providers/auth0";
import { env } from "~/env.mjs";
import { type AdapterUser } from "next-auth/adapters";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      admin?: boolean | null;
      id: string;
    };
    expires: ISODateString;
  }
  interface CustomSession {
    session: Session;
    user: AuthUser;
  }

  interface AuthUser extends AdapterUser {
    admin?: boolean;
  }

  interface AuthProfile extends Profile {
    admin?: boolean;
  }
}

type SignInCallback = {
  user: User | AdapterUser;
  account: Account | null;
  profile?: AuthProfile | undefined;
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn: async ({ user, profile }: SignInCallback) => {
      const prismaUser = await db.user.findUnique({
        where: {
          email: user.email ?? "",
        },
      });

      //bug: if user tries to update admin from false to true, will it update?????
      if (prismaUser && prismaUser.admin === null) {
        const updatedUser = await db.user.update({
          where: {
            email: prismaUser?.email,
          },
          data: {
            admin: profile?.admin ?? false,
          },
        });

        if (!updatedUser.admin) {
          console.error("There was an error adding admin to a user.");
        }
      }

      console.log("USER AUTH", user, "PRISMAUSER", prismaUser);

      return Promise.resolve(true);
    },
    session: ({ session, user }: CustomSession) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          admin: user.admin,
        },
      };
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER_BASE_URL,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
