import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import { SideNav } from "~/components/SideNav";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>BuildLog</title>
        <meta
          name="description"
          content="Keep track of whats happening on site."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex sm:pr-10 lg:px-[180px]">
        <SideNav />
        <div className="min-h-screen flex-grow items-start border-x">
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
