import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { BuildSiteControl } from "~/components/accordionManager/BuildSiteControl";
import { EmployeeItem } from "~/components/accordionManager/employees/EmployeeControl";
import { SubbieControl } from "~/components/accordionManager/SubbieControl";
import { Header } from "~/components/Header";

const Manage = () => {
  const [open, setOpen] = useState<number | null | boolean>(false);
  const session = useSession();
  const user = session.data?.user;

  const toggle = (index: number) => {
    if (open === index) {
      return setOpen(null);
    }

    setOpen(index);
  };

  if (session.status !== "authenticated") {
    return <h1>Please sign in, you are unauthenticated.</h1>;
  }

  if (!user?.admin) {
    return <h1>You are not an admin.</h1>;
  }

  return (
    <>
      <Header />
      <div className=" px-12 py-8">
        <span className="text-xs text-gray-500">
          You can manage your company from this page, such as adding and
          removing build sites, subbies and employees.
        </span>
      </div>
      <section className="grid h-screen">
        <div className="px-3 ">
          <BuildSiteControl
            open={open === 0}
            title={"Build Site"}
            toggle={() => toggle(0)}
          />
          <SubbieControl
            open={open === 1}
            title={"Subbies"}
            toggle={() => toggle(1)}
          />
          <EmployeeItem
            open={open === 2}
            title={"Employees"}
            toggle={() => toggle(2)}
          />
        </div>
      </section>
    </>
  );
};

export default Manage;
