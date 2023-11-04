import React, { type FormEvent, useState } from "react";
import { Collapse } from "react-collapse";
import { type AccordionItemProps } from "./types";
import { AccordionHeader } from "./AccordionHeader";
import { VscAdd } from "react-icons/vsc";
import FormEntry from "./FormEntry";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../LoadingSpinner";
import { IconHoverEffect } from "../IconHoverEffect";

const style = {
  form: `flex justify-between`,
  input: `border p-2 w-full text-md rounded`,
  button: `p-1 ml-2`,
};

export const BuildSiteItem = ({ open, toggle, title }: AccordionItemProps) => {
  const trpcUtils = api.useUtils();
  const [input, setInput] = useState("");

  const createMutation = api.manageBuildSites.createSite.useMutation({
    onSuccess: async () => {
      setInput("");
      await trpcUtils.manageBuildSites.getSites.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error submitting your request.");
    },
  });

  const updateMutation = api.manageBuildSites.updateSite.useMutation({
    onSuccess: async () => {
      await trpcUtils.manageBuildSites.getSites.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error updating your request.");
    },
  });

  const deleteMutation = api.manageBuildSites.deleteSite.useMutation({
    onSuccess: async () => {
      await trpcUtils.manageBuildSites.getSites.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error deleting your request.");
    },
  });

  //get build sites
  const { data, isLoading, isError } = api.manageBuildSites.getSites.useQuery(
    {},
  );

  if (isError) {
    console.error;
  }

  //create build site
  const createEntry = (e: FormEvent) => {
    e.preventDefault();

    if (input === "") {
      alert("Please do not leave the field blank.");
      return;
    }

    createMutation.mutate({ content: input });
  };

  //update build site
  const updateFormValue = (id: string, formValue: string) => {
    updateMutation.mutate({ id, content: formValue });
  };

  //delete build site
  const deleteFormValue = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const buildSitesPresent = data && data.buildSites.length > 0;

  return (
    <div>
      <AccordionHeader toggle={toggle} title={title} open={open} />
      <Collapse isOpened={open}>
        <div className="relative bottom-1.5 rounded-md bg-gray-100 px-1 pb-1">
          <div className="border-1 m-auto w-full rounded-lg border bg-white p-2 text-xs md:p-4">
            <form className={style.form} onSubmit={createEntry}>
              <input
                className={style.input}
                type="text"
                placeholder="Add a build site."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className={style.button}>
                <IconHoverEffect>
                  <VscAdd size={30} className="text-blue-500" />
                </IconHoverEffect>
              </button>
            </form>
            {isError && (
              <div className="flex justify-center py-5 text-gray-500">
                <p>No entries.</p>
              </div>
            )}
            {updateMutation.isLoading || isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                {buildSitesPresent ? (
                  <ul>
                    {data?.buildSites.map((site, index) => {
                      return (
                        <FormEntry
                          key={index}
                          id={site.id}
                          value={site.buildSite}
                          updateFormValue={updateFormValue}
                          deleteFormValue={deleteFormValue}
                        />
                      );
                    })}
                  </ul>
                ) : (
                  <div className="flex justify-center py-5 text-gray-500">
                    <p>No entries.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
};
