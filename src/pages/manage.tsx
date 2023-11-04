import React, { useState } from "react";
import { BuildSiteItem } from "~/components/accordionManager/BuildSiteItem";
import { EmployeeItem } from "~/components/accordionManager/EmployeeItem";
import { SubbieItem } from "~/components/accordionManager/SubbieItem";
import { Header } from "~/components/Header";

const Manage = () => {
  const [open, setOpen] = useState<number | null | boolean>(false);

  const toggle = (index: number) => {
    if (open === index) {
      return setOpen(null);
    }

    setOpen(index);
  };

  const accordionDataOne = {
    title: "iasjof",
    desc: "qwkrnfqeo",
  };
  const accordionDataTwo = {
    title: "JUSDF",
    desc: "CRENFER",
  };

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
          <BuildSiteItem
            open={open === 0}
            title={"Build Site"}
            desc={accordionDataOne.desc}
            toggle={() => toggle(0)}
          />
          <SubbieItem
            open={open === 1}
            title={"Subbies"}
            desc={accordionDataOne.desc}
            toggle={() => toggle(1)}
          />
          <EmployeeItem
            open={open === 2}
            title={"Employees"}
            desc={accordionDataOne.desc}
            toggle={() => toggle(2)}
          />
        </div>
      </section>
    </>
  );
};

export default Manage;
