import { VscAdd } from "react-icons/vsc";
import FormEntry from "./FormEntry";
import { LoadingSpinner } from "../LoadingSpinner";
import { IconHoverEffect } from "../IconHoverEffect";
import { type FormEvent } from "react";

const getContent = (entry: { buildSite: string } | { subbieName: string }) => {
  if ("buildSite" in entry) {
    return entry.buildSite;
  } else {
    return entry.subbieName;
  }
};

const style = {
  form: `flex justify-between`,
  input: `border p-2 w-full text-md rounded`,
  button: `p-1 ml-2`,
};

type FormProps = {
  props: {
    createEntry: (e: FormEvent) => void;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    isError: boolean;
    mutationLoading: boolean;
    queryLoading: boolean;
    entriesPresent: boolean | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entries:
      | {
          id: string;
          buildSite: string;
          createdAt: Date;
        }[]
      | { id: string; subbieName: string; createdAt: Date }[]
      | undefined;
    updateFormEntry: (id: string, formValue: string) => void;
    deleteFormEntry: (id: string) => void;
    entryType: string;
  };
};

export const SimpleAccordionForm = ({
  props: {
    createEntry,
    input,
    setInput,
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
            placeholder={`Add a ${entryType}.`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
                    <FormEntry
                      key={index}
                      id={entry.id}
                      value={getContent(entry)}
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
