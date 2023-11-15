import { VscAdd } from "react-icons/vsc";
import { LoadingSpinner } from "../../LoadingSpinner";
import { IconHoverEffect } from "../../IconHoverEffect";
import { type FormEvent } from "react";
import EmployeeFormEntry from "./EmployeeFormEntry";

const style = {
  form: `flex justify-between`,
  input: `border p-2 w-full text-md rounded`,
  button: `p-1 ml-2`,
};

type UserEntry = {
  email: string;
  name: string;
  id: string;
};

type FormProps = {
  props: {
    createEntry: (e: FormEvent) => void;
    name: string;
    email: string;
    password: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    isError: boolean;
    mutationLoading: boolean;
    queryLoading: boolean;
    entriesPresent: boolean | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entries: UserEntry[] | undefined;
    updateFormEntry: (
      id: string,
      formValue: { name: string; email: string },
    ) => void;
    deleteFormEntry: (id: string) => void;
    entryType: string;
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
    isError,
    mutationLoading,
    queryLoading,
    entriesPresent,
    entries,
    entryType,
    updateFormEntry,
    deleteFormEntry,
  },
}: FormProps) => {
  return (
    <div className="relative bottom-1.5 rounded-md bg-gray-100 px-1 pb-1">
      <div className="border-1 m-auto w-full rounded-lg border bg-white p-2 text-xs md:p-4">
        <form className={style.form} onSubmit={createEntry}>
          <input
            className={style.input}
            type="text"
            placeholder={`Add a name.`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className={style.input}
            type="text"
            placeholder={`Add a email.`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={style.input}
            type="text"
            placeholder={`Add a password`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
                {entries?.map((entry, index) => {
                  return (
                    <EmployeeFormEntry
                      key={index}
                      id={entry.id}
                      value={entry}
                      updateFormEntry={updateFormEntry}
                      deleteFormEntry={deleteFormEntry}
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
