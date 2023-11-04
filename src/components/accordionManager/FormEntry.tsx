import React, { useState } from "react";
import { VscCheck, VscTrash } from "react-icons/vsc";
import { TbEdit } from "react-icons/tb";
import { IconHoverEffect } from "../IconHoverEffect";

const style = {
  li: `flex justify-between bg-slate-50 py-4 px-2 mt-2 rounded border`,
  row: `flex items-center`,
  text: `ml-2 text-center pt-[1px]`,
  button: `cursor-pointer flex items-center `,
  input: `text-base pl-1 ml-2 rounded`,
};

type EntryProps = {
  id: string;
  value: string;
  updateFormEntry: (id: string, value: string) => void;
  deleteFormEntry: (id: string) => void;
};

const FormEntry = ({
  id,
  value,
  updateFormEntry,
  deleteFormEntry,
}: EntryProps) => {
  const [editedValue, setEditedValue] = useState(value);
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
          <button onClick={() => updateFormEntry(id, editedValue)}>
            <IconHoverEffect green>
              <VscCheck size={20} className="text-green-700" />
            </IconHoverEffect>
          </button>
        )}

        {!isEditing ? (
          <p className={style.text}>{value}</p>
        ) : (
          <input
            className={style.input}
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
          />
        )}
      </div>

      <button
        onClick={() => {
          if (!confirm("Are you sure you want to delete?")) return;
          deleteFormEntry(id);
        }}
      >
        <IconHoverEffect red>
          <VscTrash size={20} className="fill-red-500" />
        </IconHoverEffect>
      </button>
    </li>
  );
};

export default FormEntry;
