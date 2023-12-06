import { VscAdd } from "react-icons/vsc";
import { LoadingSpinner } from "../../LoadingSpinner";
import { IconHoverEffect } from "../../IconHoverEffect";
import { type FormEvent } from "react";
import EmployeeFormEntry from "./EmployeeFormEntry";
import { GetUsers200ResponseOneOfInner } from "auth0";

const style = {
  form: `flex justify-between`,
  input: `border p-2 w-full text-md rounded mt-1 md:mr-1`,
  button: `p-1 ml-2`,
};

export type UserEntry = {
  email: string;
  name: string;
  user_id: string;
  user_metadata: { admin: boolean };
};

type FormProps = {
  props: {
    createEntry: (e: FormEvent) => void;
    name: string;
    email: string;
    password: string;
    passwordVerifier: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    setPasswordVerifier: React.Dispatch<React.SetStateAction<string>>;
    isError: boolean;
    mutationLoading: boolean;
    queryLoading: boolean;
    entriesPresent: boolean | undefined;
    employees: UserEntry[] | undefined;
    updateFormEntry: (
      user_id: string,
      formValue: {
        name: string;
        email: string;
        password?: string;
        admin: boolean;
      },
    ) => void;
    deleteFormEntry: (user_id: string) => void;
    entryType: string;
    setIsAdmin: (admin: boolean) => void;
    admin: boolean;
  };
};

export const EmployeeForm = ({
  props: {
    createEntry,
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
    setPasswordVerifier,
    passwordVerifier,
    isError,
    mutationLoading,
    queryLoading,
    entriesPresent,
    employees,
    entryType,
    updateFormEntry,
    deleteFormEntry,
    setIsAdmin,
    admin,
  },
}: FormProps) => {
  return (
    <div className="relative bottom-1.5 rounded-md bg-gray-100 px-1 pb-1">
      <div className="border-1 m-auto w-full rounded-lg border bg-white p-2 text-xs md:p-4">
        <form className={style.form} onSubmit={createEntry}>
          <div className="flex flex-grow flex-col">
            <div className="flex flex-grow flex-col md:flex-row">
              <input
                className={style.input}
                type="text"
                placeholder={`Add a name.`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className={style.input}
                type="email"
                placeholder={`Add a email.`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-grow flex-col md:flex-row">
              <input
                className={style.input}
                type="text"
                placeholder={`Add a password.`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className={style.input}
                type="text"
                placeholder={`Retype your password.`}
                value={passwordVerifier}
                onChange={(e) => setPasswordVerifier(e.target.value)}
              />
            </div>
            <div className="my-2 flex flex-grow">
              <span className=" text-gray-500">User is admin: </span>
              <div className="flex items-center pl-2">
                <input
                  id="adminCheckbox"
                  type="checkbox"
                  onChange={() => {
                    setIsAdmin(!admin);
                  }}
                />
              </div>
            </div>
          </div>

          <button className={style.button}>
            <IconHoverEffect>
              <VscAdd size={30} className="text-blue-500" />
            </IconHoverEffect>
          </button>
        </form>
        {isError ? (
          <div className="flex justify-center py-5 text-gray-500">
            <p>There has been an error getting the {entryType}s.</p>
          </div>
        ) : null}
        {mutationLoading || queryLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {entriesPresent ? (
              <ul>
                {employees?.map((employee, index) => {
                  return (
                    <EmployeeFormEntry
                      key={index}
                      user_id={employee.user_id}
                      value={employee}
                      updateFormEntry={updateFormEntry}
                      deleteFormEntry={deleteFormEntry}
                      admin={admin}
                      setIsAdmin={setIsAdmin}
                    />
                  );
                })}
              </ul>
            ) : (
              <div className="flex justify-center py-5 text-gray-500">
                <p>No {entryType}s.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
