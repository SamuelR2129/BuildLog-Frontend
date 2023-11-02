import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";
import {
  VscHome,
  VscSignIn,
  VscSignOut,
  VscTable,
  VscOrganization,
  VscListUnordered,
} from "react-icons/vsc";

export const SideNav = () => {
  const session = useSession();
  const user = session.data?.user;
  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href={"/"}>
            <IconHoverEffect>
              <span className="item-center flex gap-4">
                <VscHome className="h-8 w-8 fill-blue-500" />
                <span className="hidden self-center text-lg text-blue-500 md:flex">
                  Home
                </span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        <li>
          <Link href={"/tables"}>
            <IconHoverEffect>
              <span className="item-center flex gap-4">
                <VscTable className="h-8 w-8 fill-blue-500" />
                <span className="hidden self-center text-lg text-blue-500 md:flex">
                  Tables
                </span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        <li>
          <Link href={"/subbies"}>
            <IconHoverEffect>
              <span className="item-center flex gap-4">
                <VscOrganization className="h-8 w-8 fill-blue-500" />
                <span className="hidden self-center text-lg text-blue-500 md:flex">
                  Subbies
                </span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        <li>
          <Link href={"/manage"}>
            <IconHoverEffect>
              <span className="item-center flex gap-4">
                <VscListUnordered className="h-8 w-8 fill-blue-500" />
                <span className="hidden self-center text-lg text-blue-500 md:flex">
                  Manage
                </span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        {user && (
          <li>
            <button onClick={() => void signOut()}>
              <IconHoverEffect>
                <span className="item-center flex gap-4">
                  <VscSignOut className="h-8 w-8 fill-red-700" />
                  <span className="hidden self-center text-lg text-red-700 md:flex">
                    Sign Out
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}
        {!user && (
          <li>
            <button onClick={() => void signIn()}>
              <IconHoverEffect>
                <span className="item-center flex gap-4">
                  <VscSignIn className="h-8 w-8 fill-green-700" />
                  <span className="hidden self-center text-lg text-green-700 md:flex">
                    Sign In
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};
