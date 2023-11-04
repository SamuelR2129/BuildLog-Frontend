import React, { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { type AccordionItemProps } from "./types";
import { AccordionHeader } from "./AccordionHeader";
import { VscAdd } from "react-icons/vsc";
import FormEntry from "./FormEntry";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../LoadingSpinner";

const style = {
  form: `flex justify-between`,
  input: `border p-2 w-full text-md`,
  button: `border p-1 ml-2 bg-blue-500`,
};

type BuildSite = {
  id: string;
  buildSite: string;
  createdAt: Date;
};

const examples = [
  {
    id: "1",
    buildSite: "7 Rose St",
    createdAt: new Date("04/11/2023"),
  },
  {
    id: "2",
    buildSite: "11 Beach St",
    createdAt: new Date("03/11/2023"),
  },
];

export const BuildSiteItem = ({
  open,
  toggle,
  title,
  desc,
}: AccordionItemProps) => {
  //get build sites
  const { data, isLoading, isError } = api.manageBuildSites.getSites.useQuery(
    {},
  );

  if (isError) {
    console.error;
  }

  if (isLoading || !data) return <LoadingSpinner />;

  //create build site

  //update build site
  const editFormValue = (formValue: string) => {};
  //delete build site

  const buildSites = data.buildSites.length > 0;

  return (
    <div className="pt-[10px]">
      <AccordionHeader toggle={toggle} title={title} open={open} />
      <Collapse isOpened={open}>
        <div className="bg-gray-100 px-1 pb-[20px] shadow-md">
          <div className="border-1 m-auto w-full rounded-lg border bg-white px-2 text-xs">
            <form className={style.form}>
              <input
                className={style.input}
                type="text"
                placeholder="Add a build site"
              />
              <button className={style.button}>
                <VscAdd size={30} />
              </button>
            </form>
            {buildSites ? (
              <ul>
                {data.buildSites.map((site, index) => {
                  return (
                    <FormEntry
                      key={index}
                      value={site.buildSite}
                      editFormValue={editFormValue}
                    />
                  );
                })}
              </ul>
            ) : (
              <div className="flex justify-center py-5 text-gray-500">
                <p>No entries.</p>
              </div>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
};
