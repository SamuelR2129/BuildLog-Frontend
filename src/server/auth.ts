import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  User,
  type Profile,
  type Session,
  type AuthUser,
} from "next-auth";
import { db } from "~/server/db";
import Auth0Provider, { Auth0Profile } from "next-auth/providers/auth0";
import { jwtDecode } from "jwt-decode";
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
    user: DefaultSession["user"] & {
      admin: boolean;
      id: string;
    };
  }

  interface AuthUser extends AdapterUser {
    admin?: boolean;
  }
}

type SessionCallback = {
  session: Session;
  user: AuthUser;
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.idToken = account.id_token;
      }
      console.log("JWT ACCOUNT", account);
      console.log("JWT TOKEN", token);
      return token;
    },
    signIn: async ({ user, account, profile }) => {
      // Assuming Auth0 provider is used
      console.log("user", user);
      console.log("account", account);
      console.log("profile", profile);

      // if (typeof profile.admin === "boolean" && user.email) {
      //   // Check if the admin field is already set in the Prisma database
      //   const existingUser = await db.user.findUnique({
      //     where: { email: user.email },
      //     select: { admin: true },
      //   });

      //   // Update the user in the Prisma database only if admin is not set
      //   if (existingUser && typeof existingUser.admin === undefined) {
      //     await db.user.update({
      //       where: { email: user.email },
      //       data: {
      //         admin: profile.admin,
      //       },
      //     });
      //   }
      // }
      return Promise.resolve(true);
    },
    session: ({ session, user, token }) => {
      console.log("SESSION USER", user);
      console.log("TOKEN SESSION", token);
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
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
      profile(profile: Auth0Profile) {
        return {
          id: profile.sub,
          admin: profile.admin as boolean,
        };
      },
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
