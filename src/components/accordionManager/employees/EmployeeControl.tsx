import React, { type FormEvent, useState, useEffect } from "react";
import { Collapse } from "react-collapse";
import { type AccordionItemProps } from "../types";
import { AccordionHeader } from "../AccordionHeader";
import { api } from "~/utils/api";
import { EmployeeForm, type UserEntry } from "./EmployeeForm";
import { useSession } from "next-auth/react";
import { type UpdateUserValue } from "./EmployeeFormEntry";

export type UpdateData = {
  user_id: string;
  name: string;
  email?: string;
  password?: string;
  admin: boolean;
};

export const EmployeeItem = ({ open, toggle, title }: AccordionItemProps) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [admin, setIsAdmin] = useState<boolean>(false);
  const [employees, setEmployees] = useState<UserEntry[]>();
  const [passwordVerifier, setPasswordVerifier] = useState<string>("");
  const session = useSession();
  console.log(session);

  const trpcUtils = api.useUtils();

  const { data, isLoading, isError } =
    api.manageEmployees.getEmployees.useQuery();

  if (isError) {
    console.error("Error getting employee entries");
  }
  useEffect(() => {
    setEmployees(data?.employees);
  }, [data?.employees]);

  const createMutation = api.manageEmployees.createEmployee.useMutation({
    onSuccess: async () => {
      setName("");
      setEmail("");
      setPassword("");
      setPasswordVerifier("");
      setIsAdmin(false);
      const checkbox = document.getElementById(
        "adminCheckbox",
      ) as HTMLInputElement;
      checkbox.checked = false;
      await trpcUtils.manageEmployees.getEmployees.invalidate();
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error submitting your entry.");
    },
  });

  const updateMutation = api.manageEmployees.updateEmployee.useMutation({
    onSuccess: (data) => {
      const newEmployees = employees?.map((employee) => {
        if (employee.user_id === data.user_id) {
          return {
            email: data.email,
            name: data.name,
            user_id: data.user_id,
            app_metadata: { admin: data.app_metadata.admin },
          };
        }
        return employee;
      });

      setEmployees(newEmployees);
    },
    onError: (e) => {
      console.error(e);
      alert("There was a error updating your entry.");
    },
  });

  const deleteMutation = api.manageEmployees.deleteEmployee.useMutation({
    onSuccess: (user_id) => {
      const newEmployees = employees?.filter(
        (employee) => employee.user_id !== user_id,
      );

      setEmployees(newEmployees);
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

    if (!password.match(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/))) {
      alert(
        "Password must be atleast 6 characters long, have 1 uppercase letter, 1 lowercase letter and a number.",
      );
      return;
    }

    if (password !== passwordVerifier) {
      alert("Passwords need to match exactly.");
      return;
    }
    createMutation.mutate({ email, name, password, passwordVerifier, admin });
  };

  //update employee
  const updateFormEntry = (user_id: string, formValue: UpdateUserValue) => {
    const updateData: UpdateData = {
      user_id,
      name: formValue.name,
      password: formValue.password,
      admin: formValue.admin,
    };

    if (formValue.email !== formValue.compareEmail)
      updateData.email = formValue.email;

    updateMutation.mutate(updateData);
  };

  //delete employee
  const deleteFormEntry = (user_id: string) => {
    deleteMutation.mutate({ user_id });
  };

  const entriesPresent = employees && employees.length > 0;

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
    employees: employees,
    entryType: "Employee",
    updateFormEntry,
    deleteFormEntry,
    setIsAdmin,
    admin,
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
