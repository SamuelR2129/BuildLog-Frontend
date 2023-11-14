import React from "react";
import { Collapse } from "react-collapse";
import { type AccordionItemProps } from "./types";
import { AccordionHeader } from "./AccordionHeader";
import { EmployeeForm } from "./EmployeeForm";

export const EmployeeItem = ({ open, toggle, title }: AccordionItemProps) => {
  return (
    <>
      <AccordionHeader toggle={toggle} title={title} open={open} />
      <Collapse isOpened={open}>
        <div className="bg-gray-100 px-[50px] pb-[20px] ">
          <EmployeeForm />
        </div>
      </Collapse>
    </>
  );
};
