import React, { useState } from "react";
import { VscCheck, VscTrash } from "react-icons/vsc";
import { TbEdit } from "react-icons/tb";
import { IconHoverEffect } from "../../IconHoverEffect";
import { type UserEntry } from "./EmployeeForm";

const style = {
  li: `flex justify-between bg-slate-50 py-4 px-2 mt-2 rounded border`,
  row: `flex items-center`,
  text: `ml-2 text-center pt-[1px]`,
  button: `cursor-pointer flex items-center `,
  input: `text-base pl-1 ml-2 rounded border`,
};

export type UserValue = {
  email: string;
  name: string;
  password?: string;
  admin: boolean;
};

type EntryProps = {
  user_id: string;
  value: UserEntry;
  updateFormEntry: (user_id: string, value: UserValue) => void;
  deleteFormEntry: (user_id: string) => void;
  admin: boolean;
  setIsAdmin: (admin: boolean) => void;
};

const EmployeeFormEntry = ({
  user_id,
  value,
  updateFormEntry,
  deleteFormEntry,
  setIsAdmin,
  admin,
}: EntryProps) => {
  const [editedNameValue, setEditedNameValue] = useState(value.name);
  const [editedEmailValue, setEditedEmailValue] = useState(value.email);
  const [editedPasswordValue, setEditedPasswordValue] = useState<
    string | undefined
  >();
  const [isEditing, setIsEditing] = useState(false);

  /* When you click the edit button, it will swap out the text for 
     a editable input, then hitting the tick will trigger update flow */

  return (
    <li className={style.li}>
      <div className={style.row}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>
            <IconHoverEffect>
              <TbEdit size={20} className="text-blue-700" />
            </IconHoverEffect>
          </button>
        ) : (
          <button
            onClick={() =>
              updateFormEntry(user_id, {
                name: editedNameValue,
                email: editedEmailValue,
                password: editedPasswordValue,
                admin,
              })
            }
          >
            <IconHoverEffect green>
              <VscCheck size={20} className="text-green-700" />
            </IconHoverEffect>
          </button>
        )}
        <div className="flex flex-col">
          <div className="flex">
            {!isEditing ? (
              <p className={style.text}>{value.name}</p>
            ) : (
              <input
                className={style.input}
                type="text"
                value={editedNameValue}
                onChange={(e) => setEditedNameValue(e.target.value)}
              />
            )}

            {!isEditing ? (
              <p className={style.text}>{value.email}</p>
            ) : (
              <input
                className={style.input}
                type="text"
                value={editedEmailValue}
                onChange={(e) => setEditedEmailValue(e.target.value)}
              />
            )}
          </div>

          <div className="flex">
            {isEditing ? (
              <div className="flex">
                <span className="pl-2 text-sm">Admin: </span>
                <input
                  className={style.input}
                  type="checkbox"
                  onChange={() => setIsAdmin(!!admin)}
                />
              </div>
            ) : value?.user_metadata?.admin ? (
              <span className="pl-2 text-blue-400">Admin</span>
            ) : null}

            {!isEditing ? (
              <p className={style.text}>#########</p>
            ) : (
              <input
                className={style.input}
                type="text"
                value={editedPasswordValue}
                placeholder="Enter new password."
                onChange={(e) => setEditedPasswordValue(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (!confirm("Are you sure you want to delete?")) return;
          deleteFormEntry(user_id);
        }}
      >
        <IconHoverEffect red>
          <VscTrash size={20} className="fill-red-500" />
        </IconHoverEffect>
      </button>
    </li>
  );
};

export default EmployeeFormEntry;
