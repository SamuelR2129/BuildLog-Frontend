import React, { type FormEvent, useState } from "react";
import { Collapse } from "react-collapse";
import { type AccordionItemProps } from "../types";
import { AccordionHeader } from "../AccordionHeader";
import { api } from "~/utils/api";
import { EmployeeForm } from "./EmployeeForm";

export type EmployeeInput = {
  name: string;
  email: string;
  password?: string;
};

export const EmployeeItem = ({ open, toggle, title }: AccordionItemProps) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVerifier, setPasswordVerifier] = useState<string>("");

  const trpcUtils = api.useUtils();

  const { data, isLoading, isError } =
    api.manageEmployees.getEmployees.useQuery();

  if (isError) {
    console.error("Error getting employee entries");
  }

  const createMutation = api.manageEmployees.createEmployee.useMutation({
    onSuccess: async () => {
      setName("");
      setEmail("");
      setPassword("");
      setPasswordVerifier("");
      await trpcUtils.manageEmployees.getEmployees.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error submitting your entry.");
    },
  });

  const updateMutation = api.manageEmployees.updateEmployee.useMutation({
    onSuccess: async () => {
      await trpcUtils.manageEmployees.getEmployees.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error updating your entry.");
    },
  });

  const deleteMutation = api.manageEmployees.deleteEmployee.useMutation({
    onSuccess: async () => {
      await trpcUtils.manageEmployees.getEmployees.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error deleting your entry.");
    },
  });

  //create employee
  const createEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!name?.length || !email?.length || !password?.length) {
      alert("Please do not leave the field blank.");
      return;
    }

    if (!password.match(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{5,}$/))) {
      alert(
        "Password must be atleast 4 characters long, have 1 uppercase letter, 1 lowercase letter and a number.",
      );
      return;
    }

    if (password !== passwordVerifier) {
      alert("Passwords need to match exactly.");
      return;
    }

    createMutation.mutate({ email, name, password, passwordVerifier });
  };

  //update employee
  const updateFormEntry = (id: string, formValue: EmployeeInput) => {
    updateMutation.mutate({
      id,
      email: formValue.email,
      name: formValue.name,
      password: formValue.password,
    });
  };

  //delete employee
  const deleteFormEntry = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const entriesPresent = data && data.employees.length > 0;

  const formProps = {
    createEntry: createEntry,
    name,
    email,
    password,
    passwordVerifier,
    setName,
    setEmail,
    setPassword,
    setPasswordVerifier,
    isError,
    mutationLoading: updateMutation.isLoading,
    queryLoading: isLoading,
    entriesPresent,
    entries: data?.employees,
    entryType: "Employee",
    updateFormEntry,
    deleteFormEntry,
  };

  return (
    <>
      <AccordionHeader toggle={toggle} title={title} open={open} />
      <Collapse isOpened={open}>
        <EmployeeForm props={formProps} />
      </Collapse>
    </>
  );
};
