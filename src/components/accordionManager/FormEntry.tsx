import React from "react";
import { VscTrash } from "react-icons/vsc";
import { TbEdit } from "react-icons/tb";

const style = {
  li: `flex justify-between bg-slate-100 p-4 my-2`,
  row: `flex items-center`,
  text: `ml-2 text-center pt-[1px]`,
  button: `cursor-pointer flex items-center `,
};

type EntryProps = {
  value: string;
  editFormValue: (value: string) => void;
};

const FormEntry = ({ value, editFormValue }: EntryProps) => {
  return (
    <li className={style.li}>
      <div className={style.row}>
        <input type="checkbox" />
        <p className={style.text}>{value}</p>
      </div>
      <button onClick={() => editFormValue(value)}>
        <TbEdit size={20} className="fill-blue-700" />
      </button>
      <button className="ml-2">
        <VscTrash size={20} className="fill-red-500" />
      </button>
    </li>
  );
};

export default FormEntry;
