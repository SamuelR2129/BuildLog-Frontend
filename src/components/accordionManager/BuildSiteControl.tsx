import React, { type FormEvent, useState } from "react";
import { Collapse } from "react-collapse";
import { type AccordionItemProps } from "./types";
import { AccordionHeader } from "./AccordionHeader";
import { api } from "~/utils/api";
import { SimpleAccordionForm } from "./simpleForm/SimpleAccordionForm";

export const BuildSiteControl = ({
  open,
  toggle,
  title,
}: AccordionItemProps) => {
  const trpcUtils = api.useUtils();
  const [input, setInput] = useState("");

  const createMutation = api.manageBuildSites.createSite.useMutation({
    onSuccess: async () => {
      setInput("");
      await trpcUtils.manageBuildSites.getSites.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error submitting your entry.");
    },
  });

  const updateMutation = api.manageBuildSites.updateSite.useMutation({
    onSuccess: async () => {
      await trpcUtils.manageBuildSites.getSites.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error updating your entry.");
    },
  });

  const deleteMutation = api.manageBuildSites.deleteSite.useMutation({
    onSuccess: async () => {
      await trpcUtils.manageBuildSites.getSites.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error deleting your entry.");
    },
  });

  //get build sites
  const { data, isLoading, isError } = api.manageBuildSites.getSites.useQuery(
    {},
  );

  if (isError) {
    console.error("Error getting buildSite entries");
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
  const updateFormEntry = (id: string, formValue: string) => {
    updateMutation.mutate({ id, content: formValue });
  };

  //delete build site
  const deleteFormEntry = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const entriesPresent = data && data.buildSites.length > 0;

  const formProps = {
    createEntry: createEntry,
    input,
    setInput,
    isError,
    mutationLoading: updateMutation.isLoading,
    queryLoading: isLoading,
    entriesPresent,
    entries: data?.buildSites,
    entryType: "Build Site",
    updateFormEntry,
    deleteFormEntry,
  };

  return (
    <>
      <AccordionHeader toggle={toggle} title={title} open={open} />
      <Collapse isOpened={open}>
        <SimpleAccordionForm props={formProps} />
      </Collapse>
    </>
  );
};
