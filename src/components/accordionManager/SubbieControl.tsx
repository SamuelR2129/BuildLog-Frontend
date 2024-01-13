import React, { type FormEvent, useState } from "react";
import { Collapse } from "react-collapse";
import { type AccordionItemProps } from "./types";
import { AccordionHeader } from "./AccordionHeader";
import { api } from "~/utils/api";
import { SimpleAccordionForm } from "./simpleForm/SimpleAccordionForm";

export const SubbieControl = ({ open, toggle, title }: AccordionItemProps) => {
  const trpcUtils = api.useUtils();
  const [input, setInput] = useState("");

  const createMutation = api.manageSubbies.createSubbie.useMutation({
    onSuccess: async () => {
      setInput("");
      await trpcUtils.manageSubbies.getSubbies.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error submitting your entry.");
    },
  });

  const updateMutation = api.manageSubbies.updateSubbie.useMutation({
    onSuccess: async () => {
      await trpcUtils.manageSubbies.getSubbies.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error updating your entry.");
    },
  });

  const deleteMutation = api.manageSubbies.deleteSubbie.useMutation({
    onSuccess: async () => {
      await trpcUtils.manageSubbies.getSubbies.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error deleting your entry.");
    },
  });

  //get subbies
  const { data, isLoading, isError } = api.manageSubbies.getSubbies.useQuery(
    {},
  );

  if (isError) {
    console.error("Error getting subbie entries");
  }

  //create subbie
  const createEntry = (e: FormEvent) => {
    e.preventDefault();

    if (input === "") {
      alert("Please do not leave the field blank.");
      return;
    }

    createMutation.mutate({ content: input });
  };

  //update subbie
  const updateFormEntry = (id: string, formValue: string) => {
    updateMutation.mutate({ id, content: formValue });
  };

  //delete subbie
  const deleteFormEntry = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const entriesPresent = data && data.subbies.length > 0;

  const formProps = {
    createEntry: createEntry,
    input,
    setInput,
    isError,
    mutationLoading: updateMutation.isLoading,
    queryLoading: isLoading,
    entriesPresent,
    entries: data?.subbies,
    entryType: "Subbie",
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
